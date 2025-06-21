import {Either, makeRight} from "@/shared/either";
import {db} from "@/infra/db";
import {schema} from "@/infra/db/schemas";
import {eq} from "drizzle-orm";

export async function incrementLinkAccessCount(id: string, accessCount: number): Promise<Either<never, number>> {
    const newAccessCount = accessCount + 1;
    await db.update(schema.links).set({
        accessCount: newAccessCount
    }).where(eq(schema.links.id, id));
    return makeRight(newAccessCount);
}