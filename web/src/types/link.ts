export type Link = {
    id: string,
    originalUrl: string,
    shortUrl: string,
    createdAt: string,
    accessCount: number
};

export type LinkInput = {
    originalUrl: string,
    shortUrl: string,
};