export type Badge = {
	id: string;
	title: string;
	image: string;
	urls: Record<string, string>;
	svg: boolean;
	users: string[];
};
