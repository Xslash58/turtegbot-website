export interface FFZBadge {
    id: string;
    title: string;
    image: string;
    urls: Record<number, string>;
    svg: boolean;
    users: string[];
}