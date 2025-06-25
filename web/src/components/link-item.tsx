import type {Link} from "@/types/link.ts";
import {Button} from "@/components/ui/button.tsx";
import {ClipboardIcon, TrashIcon} from "@phosphor-icons/react";
import {toast} from "sonner";
import {env} from "@/env";
import {useLinkStore} from "@/store/links.ts";
import {useState} from "react";

type LinkItemProps = {
    link: Link
};

function LinkItem({ link }: LinkItemProps) {

    const deleteLink = useLinkStore((state) => state.deleteLink);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const onCopy = (link) => {
        navigator.clipboard.writeText(env.VITE_FRONTEND_URL + "/" + link.shortUrl);
    };

    const onDelete = (link) => {
        if (window.confirm("Deseja realmente excluir o link?")) {
            setLoadingDelete(true);
            deleteLink(link.id).then(() => {
                setLoadingDelete(false);
                toast.success("Link excluído com sucesso!");
            }).catch((err) => {
                console.error(err);
                setLoadingDelete(false);
                toast.error("Erro ao excluir o link!");
            });
        }
    };

    return (
        <li key={link.id} className="flex items-center justify-between py-4 gap-3">
            <div className="flex-1 min-w-0">
                <a
                    href={link.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[17px] text-[#3A48A1] font-semibold hover:underline truncate"
                >
                    {link.shortUrl}
                </a>
                <span className="block text-gray-400 text-[15px] truncate">{link.originalUrl}</span>
            </div>
            <span className="whitespace-nowrap text-gray-500 text-[15px] font-medium mr-4">
                                            {link.accessCount} acessos
                                          </span>
            <div className="flex gap-2">
                <Button
                    size="icon"
                    variant="ghost"
                    className="bg-gray-100 hover:bg-gray-200"
                    title="Copiar"
                    onClick={() => onCopy(link)}
                >
                    <ClipboardIcon size={18} className="text-[#3A48A1]" />
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className="bg-gray-100 hover:bg-red-100"
                    title="Excluir"
                    onClick={() => onDelete(link)}
                    disabled={loadingDelete}
                >
                    <TrashIcon size={18} className="text-gray-400 group-hover:text-red-600 transition" />
                </Button>
            </div>
        </li>
    );
}

export default LinkItem;