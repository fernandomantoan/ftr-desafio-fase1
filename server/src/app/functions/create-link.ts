import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { Either, makeRight } from "@/shared/either";
import { z } from "zod";

const createLinkInput = z.object({
    originalUrl: z.string().url(),
    shortUrl: z.string().min(1).max(100),
});

type CreateLinkInput = z.input<typeof createLinkInput>;

export async function createLink(input: CreateLinkInput): Promise<Either<never, { id: string }>> {
    const id = await db.insert(schema.links).values({
        originalUrl: input.originalUrl,
        shortUrl: input.shortUrl,
        createdAt: new Date(),
        accessCount: 0,
    }).returning({ id: schema.links.id });
    return makeRight(id[0]);
}