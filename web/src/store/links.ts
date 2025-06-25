import { create } from "zustand";
import { getLinks } from "@/http/get-links.ts";
import {deleteLink} from "@/http/delete-link.ts";
import {createLink} from "@/http/create-link.ts";
import {exportLinks} from "@/http/export-links.ts";
import type {Link, LinkInput} from "@/types/link.ts";
import {immer} from "zustand/middleware/immer";

export interface LinksState {
    // State
    links: Link[];
    loading: boolean;
    error: unknown;
    reportUrl: string;
    isLoadingForm: boolean;
    errorCreate: unknown;

    // Actions
    fetchLinks: () => Promise<void>;
    deleteLink: (id: string) => Promise<void>;
    createLink: (payload: LinkInput) => Promise<Link>;
    exportCSV: () => Promise<string | undefined>;
}

export const useLinkStore = create<LinksState, [['zustand/immer', never]]>(immer((set, get) => ({
    links: [],
    loading: false,
    error: null,
    reportUrl: "",
    isLoadingForm: false,
    errorCreate: null,

    fetchLinks: async() => {
        set({ loading: true, error: null });
        try {
            const links = await getLinks();

            set({ links: links.links, loading: false });
        } catch (error) {
            set({ error, loading: false });
        }
    },

    deleteLink: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const deletedSuccessfully = await deleteLink(id);
            if (deletedSuccessfully) {
                set((state) => ({
                    links: state.links.filter((l: Link) => l.id !== id),
                    loading: false,
                }));
            } else {
                set({ loading: false, error: "Falha ao deletar" });
            }
        } catch (error) {
            set({ error, loading: false });
        }
    },

    createLink: async (payload: LinkInput) => {
        set({ isLoadingForm: true, error: null });
        try {
            const link = await createLink(payload);
            set({ isLoadingForm: false });
            await get().fetchLinks();
            return link;
        } catch (error) {
            set({ errorCreate: error, isLoadingForm: false });
            throw error;
        }
    },

    exportCSV: async () => {
        set({ loading: true, error: null });
        try {
            const report = await exportLinks();
            set({ reportUrl: report.reportUrl, loading: false });
            return report.reportUrl;
        } catch (error) {
            set({ error, loading: false });
        }
    }
})));