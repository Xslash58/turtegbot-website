<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { myUser } from "$lib/stores/userStore";

	const emoteUrls = [
		"https://cdn.7tv.app/emote/01GQ637BD800023EFT95G0MECC/4x.avif",
		"https://cdn.7tv.app/emote/01HRQJ7J2G0008EJM05NVB2SYD/4x.avif",
		"https://cdn.7tv.app/emote/01J6Q2AS900007DP4FW3NF42RA/4x.avif",
		"https://cdn.7tv.app/emote/01HJN8TYR0000BYEJVE2JB316C/4x.avif",
		"https://cdn.7tv.app/emote/01J0VRQRV80006HGJYSD04F5VA/4x.avif",
		"https://cdn.7tv.app/emote/01GV56F8QR0006FW5TVZVMFVWE/4x.avif",
		"https://cdn.7tv.app/emote/01GQFT1WF80002Q9KS8SKQMHHY/4x.avif",
		"https://cdn.7tv.app/emote/01GXY8F948000CAGQJD077GE47/4x.avif",
		"https://cdn.7tv.app/emote/01H94RXK8G000A3085VTM7A7ME/4x.avif",
		"https://cdn.7tv.app/emote/01GWSGBQ7R0008X0SB6ANMACKG/4x.avif"
	]

	let title = page.error?.message ?? "Error";
	let status = page.status ?? 500;
	let randomEmoteUrl = emoteUrls[Math.floor(Math.random() * emoteUrls.length)];

	if(page.error?.message == "fake_notfound") {
		title = "Not Found";
		status = 404;
	}

	myUser.subscribe((value) => {
		if (value && window && location) {
			goto(location.href)
		}
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="container">
	<img src={randomEmoteUrl} alt="random emote">
	<h1>{title}</h1>
	<span>
		{#if status === 401}
			You are unauthorized to view this page.
		{:else if status === 403}
			You do not have permission to view this page.
		{:else if status === 404}
			The page you were looking for could not be found.
		{:else}
			An internal error occurred.
			<br />
			You can try refreshing the page.
			<br />
			If the problem persists, please contact us.
		{/if}
	</span>
	<a href="/">Go Back</a>
</div>

<style>
	.container {
		height: 100%;

		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		text-align: center;

		font-size: 1.25rem;

		h1 {
			margin: 0;
		}
	}

	a {
		color: var(--text);
	}
</style>