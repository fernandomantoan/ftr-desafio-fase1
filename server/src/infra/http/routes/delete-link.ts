import {FastifyPluginAsyncZod, ZodTypeProvider} from "fastify-type-provider-zod";
import { z } from "zod";
import { deleteLink } from "@/app/functions/delete-link";
import {unwrapEither} from "@/shared/either";

export const deleteLinkRoute: FastifyPluginAsyncZod = async (server) => {
    server.withTypeProvider<ZodTypeProvider>().delete(
        "/links/:id",
        {
            schema: {
                summary: "Delete a link by ID",
                tags: ["links"],
                params: z.object({ id: z.string().describe("Link ID") }),
                response: {
                    204: z.null().describe("Link deleted successfuly"),
                    404: z.object({ message: z.string() })
                }
            }
        },
        async (request, reply) => {
            const { id } = request.params;
            const result = unwrapEither(await deleteLink(id));
            if (result) {
                return reply.status(204).send();
            }
            return reply.status(404).send({ message: "Link not found" });
        }
    );
};