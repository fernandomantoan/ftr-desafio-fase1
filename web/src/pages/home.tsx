import logo from "@/assets/logo.svg";
import FormLink from "@/components/form-link.tsx";
import LinkList from "@/components/link-list.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";

function Home() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center flex-col">
            <header className="flex px-20 pt-16 pb-10 max-w-5xl w-full pl-24">
              <span>
                  <img src={logo} />
              </span>
            </header>
            <main className="flex-1 flex items-start justify-center">
                <div className="flex gap-10 w-full max-w-5xl justify-center flex-col md:flex-row">
                    <FormLink />
                    <LinkList />
                </div>
            </main>
            <Toaster />
        </div>
    );
}

export default Home;