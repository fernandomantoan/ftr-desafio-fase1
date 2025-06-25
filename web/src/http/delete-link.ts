import {httpClient} from "@/http/http-client.ts";

export async function deleteLink(id: string) {
    const response = await httpClient.delete(`/links/${id}`);
    return response.status === 204;
    
}