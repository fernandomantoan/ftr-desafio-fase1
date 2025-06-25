import {FastifyPluginAsyncZod, ZodTypeProvider} from "fastify-type-provider-zod";
import {z} from "zod";
import {isRight, unwrapEither} from "@/shared/either";
import {incrementLinkAccessCount} from "@/app/functions/increment-link-access-count";
import {getLinkByShortUrl} from "@/app/functions/get-link-by-short-url";

export const getLinkByShortUrlRoute: FastifyPluginAsyncZod = async (server) => {
    server.withTypeProvider<ZodTypeProvider>().get(
        "/links/short/:shortUrl",
        {
            schema: {
                summary: "Get a link by short url and increments its access count",
                tags: ["links"],
                params: z.object({ shortUrl: z.string().describe("Link short url") }),
                response: {
                    200: z.object({
                        id: z.string(),
                        originalUrl: z.string(),
                        shortUrl: z.string(),
                        createdAt: z.date(),
                        accessCount: z.number()
                    }),
                    404: z.object({ message: z.string() })
                }
            }
        },
        async (request, reply) => {
            const { shortUrl } = request.params;
            const result = await getLinkByShortUrl(shortUrl);
            if (isRight(result)) {
                const linkFound = unwrapEither(result);
                const resultIncrement = await incrementLinkAccessCount(linkFound.id, linkFound.accessCount);
                linkFound.accessCount = unwrapEither(resultIncrement);
                return reply.status(200).send(linkFound);
            }
            return reply.status(404).send({ message: "Link not found" });
        }
    );
};