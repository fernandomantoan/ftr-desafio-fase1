import {env} from "@/env";

function NotFound() {
    const url = env.VITE_FRONTEND_URL;
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#e6e8ed]">
            <div
                className="w-full max-w-md md:max-w-xl bg-white/80 rounded-lg shadow p-8 md:p-16 flex flex-col items-center">
                <div className="relative text-[64px] md:text-[90px] font-extrabold mb-2 select-none">
                    <span className="absolute left-0 top-0 text-blue-600 animate-glitch1">404</span>
                    <span className="absolute left-0 top-0 text-red-400 animate-glitch2">404</span>
                    <span className="relative text-gray-800">404</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-4 text-center">
                    Link não encontrado
                </h1>
                <p className="text-center text-gray-700 max-w-xs md:max-w-md">
                    O link que você está tentando acessar não existe, foi removido ou é uma URL inválida.
                    Saiba mais em <a href={url} className="text-blue-600 underline">brev.ly</a>.
                </p>
            </div>
            <style>{`
                @keyframes glitch1 {
                0 % {transform: translate(0, 0); opacity: 1;}
                20% {transform: translate(-2px,-2px); opacity:0.7;}
                40% {transform: translate(-4px,2px); opacity:0.7;}
                60% {transform: translate(2px,-1px); opacity:0.7;}
                80% {transform: translate(-1px,2px); opacity:0.7;}
                100% {transform: translate(0,0); opacity:1;}
            }
                @keyframes glitch2 {
                0 % {transform: translate(0, 0); opacity: 1;}
                20% {transform: translate(2px,2px); opacity:0.7;}
                40% {transform: translate(4px,-1px); opacity:0.7;}
                60% {transform: translate(-2px,1px); opacity:0.7;}
                80% {transform: translate(1px,-2px); opacity:0.7;}
                100% {transform: translate(0,0); opacity:1;}
            }
                .animate-glitch1 {animation: glitch1 1.5s infinite;}
                .animate-glitch2 {animation: glitch2 1.5s infinite;}`}
            </style>
        </div>
    );
}

export default NotFound;