import { createLink } from "@/app/functions/create-link";
import { unwrapEither } from "@/shared/either";
import { FastifyPluginAsyncZod, ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

const createLinkSchema = z.object({
    originalUrl: z.string().url().describe("The original URL to be shortened"),
    shortUrl: z.string().regex(/^[a-z0-9-]+$/).describe("The custom short URL"),
});
type CreateLinkBody = z.infer<typeof createLinkSchema>;

export const createLinkRoute: FastifyPluginAsyncZod = async (server) => {
    server.withTypeProvider<ZodTypeProvider>().post(
        "/links", 
        {
            schema: {
                summary: "Create a new link",
                tags: ["links"],
                body: createLinkSchema,
                response: {
                    201: z.object({ id: z.string() }).describe("Created link ID"),
                    400: z.object({ message: z.string() }).describe("Bad Request"),
                }
            }
        },
        async (request, reply) => {
            const { originalUrl, shortUrl } = request.body;
            const result = await createLink({
                originalUrl: originalUrl,
                shortUrl: shortUrl,
            });

            const { id } = unwrapEither(result);
            return reply.status(201).send({ id });
        }
    );
};