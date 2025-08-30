export function formatDate(dateStr: Date) {
		const date = new Date(dateStr);
		const pad = (n: number) => n.toString().padStart(2, '0');
		return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function copyToClipboard(text: string) {
	if(!navigator?.clipboard) return;

	navigator.clipboard.writeText(text).then(() => {
		alert("Content copied to clipboard");
	}).catch(err => {
		console.error('Failed to copy: ', err);
	});
}