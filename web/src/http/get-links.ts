import type {Link} from "@/types/link.ts";
import {httpClient} from "@/http/http-client.ts";

type GetLinksOutput = {
    links: Link[]
};

export async function getLinks(): Promise<GetLinksOutput> {
    const response = await httpClient.get('/links');
    return response.data;
}