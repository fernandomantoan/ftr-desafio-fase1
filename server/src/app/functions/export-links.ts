import {Either, makeRight} from "@/shared/either";
import {db, pg} from "@/infra/db";
import {schema} from "@/infra/db/schemas";
import {PassThrough, Transform, TransformCallback} from "node:stream";
import {stringify} from "csv-stringify";
import {pipeline} from "node:stream/promises";
import {uploadFileToStorage} from "@/infra/storage/upload-file-to-storage";

type ExportLinksOutput = {
    reportUrl: string;
};

export async function exportLinks(): Promise<Either<never, ExportLinksOutput>> {
    const { sql, params } = db.select({
        id: schema.links.id,
        originalUrl: schema.links.originalUrl,
        shortUrl: schema.links.shortUrl,
        createdAt: schema.links.createdAt,
        accessCount: schema.links.accessCount,
    }).from(schema.links).toSQL();

    const cursor = pg.unsafe(sql, params as string[]).cursor(2);
    const uploadToStorageStream = new PassThrough();

    const csv = stringify({
        delimiter: ",",
        header: true,
        columns: [
            { key: "id", header: "ID" },
            { key: "original_url", header: "URL Original" },
            { key: "short_url", header: "URL Encurtada" },
            { key: "created_at", header: "Criado Em" },
            { key: "access_count", header: "Qtd de Acessos" },
        ]
    });

    const convertToCSVPipeline = pipeline(
        cursor,
        new Transform({
            objectMode: true,
            transform(chunks: any, encoding: BufferEncoding, callback: TransformCallback) {
                for (const chunk of chunks) {
                    this.push(chunk);
                }
                callback();
            }
        }),
        csv,
        uploadToStorageStream
    );

    const uploadToStorage = uploadFileToStorage({
        contentType: "text/csv",
        folder: "downloads",
        fileName: `${new Date().toISOString()}-links.csv`,
        contentStream: uploadToStorageStream
    });

    const [{ url }] = await Promise.all([
        uploadToStorage,
        convertToCSVPipeline
    ]);

    return makeRight({ reportUrl: url });
}