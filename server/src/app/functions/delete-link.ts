import {Either, makeRight} from "@/shared/either";
import {db} from "@/infra/db";
import {schema} from "@/infra/db/schemas";
import {eq} from "drizzle-orm";

export async function deleteLink(id: string): Promise<Either<never, boolean>> {
    const link = await db.select({ id: schema.links.id }).from(schema.links).where(eq(schema.links.id, id)).limit(1);
    if (!link || link.length === 0) {
        return makeRight(false);
    } else {
        await db.delete(schema.links).where(eq(schema.links.id, id));
        return makeRight(true);
    }
}