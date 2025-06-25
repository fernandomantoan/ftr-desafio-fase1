import {httpClient} from "@/http/http-client.ts";

type ReportOutput = {
    reportUrl: string;
};

export async function exportLinks(): Promise<ReportOutput> {
    const response = await httpClient.post('/links/export');
    return response.data;
};