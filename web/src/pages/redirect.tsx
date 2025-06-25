import chain from "@/assets/chain.svg";
import {useParams} from "react-router";
import {getLinkByShortUrl} from "@/http/get-link-by-short-url.ts";
import {useEffect, useState} from "react";
import NotFound from "@/pages/404.tsx";
import type {Link} from "@/types/link.ts";

function Redirect() {
    const { shortUrl } = useParams();
    const [error, setError] = useState(false);
    const [link, setLink] = useState<Link | null>(null);
    useEffect(() => {
        getLinkByShortUrl(shortUrl as string).then((res) => {
            if (res) {
                setLink(res);
                setTimeout(() => {
                    window.location.replace(res.originalUrl);
                }, 2000);
                return;
            }
            throw new Error();
        }).catch((err) => {
            console.error(err);
            setError(true);
        })
    }, [shortUrl]);

    if (error) {
        return <NotFound />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#e6e8ed]">
            <div className="w-full max-w-md md:max-w-xl bg-white/80 rounded-lg shadow p-8 md:p-16 flex flex-col items-center">
                <img src={chain} />
                <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center mt-4">
                    Redirecionando...
                </h1>
                <div className="text-center text-gray-700 max-w-xs md:max-w-md">
                    O link será aberto automaticamente em alguns instantes.
                    <br />
                    Não foi redirecionado?{" "}
                    <a
                        href={link ? link.originalUrl : "#"}
                        className="text-blue-700 underline font-medium"
                    >
                        Acesse aqui
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Redirect;