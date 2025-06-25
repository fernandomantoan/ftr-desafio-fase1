import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {useLinkStore} from "@/store/links.ts";
import {useState} from "react";
import {z} from "zod";
import {toast} from "sonner";

const createLinkSchema = z.object({
    originalUrl: z.string().url().describe("The original URL to be shortened"),
    shortUrl: z.string().regex(/^[a-z0-9-]+$/).describe("The custom short URL"),
});

function FormLink() {
    const createLink = useLinkStore((state) => state.createLink);
    const isLoading = useLinkStore((state) => state.isLoadingForm);
    const [formData, setFormData] = useState({
        originalUrl: '',
        shortUrl: '',
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const saveLink = async (evt) => {
        evt.preventDefault();
        const result = createLinkSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: { [key: string]: string } = {};
            result.error.errors.forEach((err) => {
                const field = err.path[0];
                fieldErrors[field] = err.message;
            });
            setFormErrors(fieldErrors);
            return;
        }
        setFormErrors({});
        try {
            await createLink(formData);
            toast.success("Link criado com sucesso.");
        } catch (err) {
            console.error("ERRO")
            toast.error("Erro ao criar link, tente novamente.")
        }
    };

    return (
        <form onSubmit={saveLink}>
            <Card className="lg:min-w-[400px] sm:w-auto">
                <CardHeader>
                    <CardTitle>Novo Link</CardTitle>
                </CardHeader>
                <CardContent className="w-full">
                    <div className="grid w-full items-center gap-3">
                        <Label htmlFor="originalUrl">LINK ORIGINAL</Label>
                        <Input id="originalUrl" placeholder="www.exemplo.com.br" className="w-full"
                               name="originalUrl" value={formData.originalUrl} onChange={handleChange}
                        />
                        {formErrors.originalUrl && <span className="text-red-500 text-sm">URL Inválida</span>}
                    </div>
                    <div className="grid w-full items-center gap-3 pt-4">
                        <Label htmlFor="shortUrl">LINK ENCURTADO</Label>
                        <div className="flex items-center relative w-full">
                            <span className="absolute left-4 text-gray-500 pointer-events-none z-10">https://brev.ly/</span>
                            <Input id="shortUrl" className="pl-[124px] w-full" name="shortUrl" value={formData.shortUrl} onChange={handleChange} />
                        </div>
                        {formErrors.shortUrl && <span className="text-red-500 text-sm">Encurtamento Inválido</span>}
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full" disabled={isLoading}>Salvar Link</Button>
                </CardFooter>
            </Card>
        </form>
    );
}

export default FormLink;