import {Card, CardAction, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {LoadingSpinner} from "@/components/ui/spinner.tsx";
import {useLinkStore} from "@/store/links.ts";
import {useEffect, useState} from "react";
import { toast } from "sonner"
import LinkItem from "@/components/link-item.tsx";
import {LinkIcon} from "@phosphor-icons/react";

function LinkList() {
    const fetchLinks = useLinkStore((state) => state.fetchLinks);
    const exportCsv = useLinkStore((state) => state.exportCSV);
    const links = useLinkStore((state) => state.links);
    const loadingLinks = useLinkStore((state) => state.loading);
    const error = useLinkStore((state) => state.error);

    const [loadingCsv, setLoadingCsv] = useState(false);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    const onExport = () => {
        setLoadingCsv(true);
        exportCsv().then((reportUrl) => {
            window.open(reportUrl, "_blank");
            setLoadingCsv(false);
        }).catch((err) => {
            console.error(err);
            toast.error("Erro ao exportar o CSV!");
            setLoadingCsv(false);
        })
    };

    if (error) return <div>Erro ao carregar links!</div>;

    return (
        <Card className="flex-1 lg:min-w-[480px] sm:w-auto">
            <CardHeader>
                <CardTitle>Meus Links</CardTitle>
                <CardAction>
                    <Button onClick={onExport} disabled={loadingCsv}>Exportar CSV</Button>
                </CardAction>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto scrollbar scrollbar-thumb-blue-700">
                {loadingLinks && (
                    <LoadingSpinner className="w-full" />
                )}
                {links != null && links.length > 0 && (
                    <ul className="divide-y divide-gray-200">
                        {links.map((link) => (
                            <LinkItem link={link} />
                        ))}
                    </ul>
                )}
                {links == null || links.length === 0 && (
                    <div className="flex items-center justify-center flex-col gap-8 text-gray-500">
                        <LinkIcon className="text-5xl mt-10" />
                        <p className="flex items-center justify-center">
                            AINDA NÃO EXISTEM LINKS CADASTRADOS
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default LinkList;