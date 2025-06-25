import {httpClient} from "@/http/http-client.ts";
import type {LinkInput} from "@/types/link.ts";

export async function createLink(input: LinkInput) {
    const response = await httpClient.post('/links', input);
    return response.data;
}