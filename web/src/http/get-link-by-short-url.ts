import {httpClient} from "@/http/http-client.ts";

export async function getLinkByShortUrl(shortUrl: string) {
    const response = await httpClient.get(`/links/short/${shortUrl}`);
    return response.data;
}