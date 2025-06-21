import {db} from "@/infra/db";
import {schema} from "@/infra/db/schemas";
import {eq} from "drizzle-orm";
import {Either, makeLeft, makeRight} from "@/shared/either";
import {LinkNotFound} from "@/app/functions/errors/link-not-found";

type GetLinkOutput = {
    id: string;
    originalUrl: string;
    shortUrl: string;
    createdAt: Date;
    accessCount: number;
};

export async function getLink(id: string): Promise<Either<LinkNotFound, GetLinkOutput>> {
    const link = await db.select({
        id: schema.links.id,
        originalUrl: schema.links.originalUrl,
        shortUrl: schema.links.shortUrl,
        createdAt: schema.links.createdAt,
        accessCount: schema.links.accessCount,
    }).from(schema.links).where(eq(schema.links.id, id)).limit(1);

    if (link && link.length > 0) {
        return makeRight(link[0]);
    }
    return makeLeft(new LinkNotFound());
}