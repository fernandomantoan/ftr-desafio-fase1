import {FastifyPluginAsyncZod, ZodTypeProvider} from "fastify-type-provider-zod";
import { z } from "zod";
import {isRight, unwrapEither} from "@/shared/either";
import {getLink} from "@/app/functions/get-link";
import {incrementLinkAccessCount} from "@/app/functions/increment-link-access-count";

export const getLinkRoute: FastifyPluginAsyncZod = async (server) => {
    server.withTypeProvider<ZodTypeProvider>().get(
        "/links/:id",
        {
            schema: {
                summary: "Get a link by ID and increments its access count",
                tags: ["links"],
                params: z.object({ id: z.string().describe("Link ID") }),
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
            const { id } = request.params;
            const result = await getLink(id);
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