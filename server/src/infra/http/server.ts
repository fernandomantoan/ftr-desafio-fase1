import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { env } from "@/env";
import { deleteLinkRoute } from "./routes/delete-link";
import { createLinkRoute } from "./routes/create-link";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {getLinksRoute} from "@/infra/http/routes/get-links";
import {getLinkRoute} from "@/infra/http/routes/get-link";
import {exportLinksRoute} from "@/infra/http/routes/export-links";
import {getLinkByShortUrlRoute} from "@/infra/http/routes/get-link-by-short-url";

const server = fastify({
    logger: true
});

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(fastifyCors, {
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    origin: "*",
});

server.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Upload image API",
            version: "0.1.0",
        },
    },
    transform: jsonSchemaTransform
});

server.register(fastifySwaggerUi, {
    routePrefix: "/docs",
});

server.register(exportLinksRoute);
server.register(getLinkRoute);
server.register(getLinkByShortUrlRoute);
server.register(getLinksRoute);
server.register(createLinkRoute);
server.register(deleteLinkRoute);

server.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
    console.log("Hello world");
});