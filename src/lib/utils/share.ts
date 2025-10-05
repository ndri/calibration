export function shareOnBluesky(text: string) {
	const encodedText = encodeURIComponent(text);
	const url = `https://bsky.app/intent/compose?text=${encodedText}`;
	window.open(url, '_blank');
}
