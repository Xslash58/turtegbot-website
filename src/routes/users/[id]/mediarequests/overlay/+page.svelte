<script lang="ts">
	import { page } from '$app/state';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import { GetMediaQueue } from '$lib/API/Media';
	import type { MediaRequest } from '$lib/API/Models/Media';
	import type { UserPage } from '$lib/API/Models/Users';
	import { GetUserPage } from '$lib/API/Users';
	import { X } from 'phosphor-svelte';
	import { onDestroy, onMount } from 'svelte';

	let mediaQueue: MediaRequest[] = $state([]);
	let profileUser: UserPage | null = $state(null);

	let wsConnectionAttempts: number = $state(0);
	let ws: WebSocket | null = null;
	let wsState: number = $state(WebSocket.CONNECTING);

	let currentSong: MediaRequest | null = $state(null);
	let isBackupPlaylistPlaying: boolean = $state(false);
	let isSongMissing: boolean = $state(true);

	let isFirstLoad: boolean = $state(true);

	let isOverlayRequested: boolean = $state(false);
	let isOverlayShown: boolean = $state(false);
	let overlayHideTimeout: ReturnType<typeof setTimeout> | null = null;

	let isDebugToolsEnabled: boolean = $state(false);

	const currentId = page.params.id ?? '';

	onMount(async () => {
		profileUser = await GetUserPage(currentId);
		if (!profileUser) {
			console.error(`User with ID ${currentId} not found.`);
			return;
		}
		if (!profileUser.user || Object.keys(profileUser.user.roomIds).length < 1) {
			console.error(`User with ID ${currentId} does not have any associated rooms.`);
			return;
		}

		let currentUser = profileUser.user;

		ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

		ws.onopen = () => {
			console.log('WebSocket connection established');
			wsConnectionAttempts = 0;
			wsState = WebSocket.OPEN;

			for (const [_, roomId] of Object.entries(currentUser.roomIds)) {
				ws?.send(JSON.stringify({ action: 'subscribe', room: `room:${roomId}` }));
			}

			loadMediaQueue(isFirstLoad);
			isFirstLoad = false;
		};

		ws.onmessage = (event) => {
			const msg = JSON.parse(event.data);
			if (msg.event === 'media_request') {
				mediaQueue.push(msg.data);
				if (isBackupPlaylistPlaying) {
					isBackupPlaylistPlaying = false;
					endMedia();
				}
				isSongMissing = false; // Reset the missing song flag
			} else if (msg.event == 'media_request_history') {
				const msg = JSON.parse(event.data);
				if (currentSong) {
					mediaQueue.unshift(currentSong);
				}
				currentSong = msg.data;
				isBackupPlaylistPlaying = false;
				isSongMissing = false; // Reset the missing song flag
				showOverlay();
			} else if (msg.event == 'media_skip') {
				if (currentSong && currentSong.id === msg.data.id) {
					endMedia();
				} else {
					mediaQueue = mediaQueue.filter((media) => media.id !== msg.data.id);
				}
			} else if (msg.event == 'media_overlay_show') {
				showOverlay();
			} else if (msg.event == 'media_overlay_hide') {
				isOverlayRequested = false;
			} else if (msg.event == 'media_overlay_peek') {
				showOverlay();
			}
		};
		ws.onclose = () => {
			console.log('WebSocket connection closed');
			wsState = WebSocket.CLOSED;
			setTimeout(webSocketReconnect, 5000);
		};
	});

	onDestroy(() => {
		if (ws) {
			ws.close();
		}
	});

	$effect(() => {
		isOverlayShown = isOverlayRequested || wsState !== WebSocket.OPEN;
		if (currentSong) {
			if (currentSong.title.length > 30) {
				currentSong.title = currentSong.title.substring(0, 30) + '...';
			}
		}
	});

	function webSocketReconnect() {
		if (wsConnectionAttempts >= 3) return;

		if (wsState === WebSocket.CLOSED && ws) {
			wsState = WebSocket.CONNECTING;
			wsConnectionAttempts += 1;
			const newWs = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

			newWs.onopen = ws.onopen;
			newWs.onmessage = ws.onmessage;
			newWs.onclose = ws.onclose;

			ws = newWs;
		}
	}

	async function loadMediaQueue(isFirstLoad: boolean = false) {
		if (!profileUser || !profileUser.user) return;

		mediaQueue = [];

		for (const roomId of Object.values(profileUser.user.roomIds)) {
			const fetchedQueue = await GetMediaQueue(roomId);
			if (fetchedQueue) {
				mediaQueue = [...mediaQueue, ...fetchedQueue];
			}
		}

		if (isFirstLoad) {
			endMedia();
		}
	}

	function endMedia() {
		if (mediaQueue.length > 0) {
			currentSong = mediaQueue.shift()!;
			isSongMissing = false;
			isBackupPlaylistPlaying = false;
		} else {
			currentSong = null;
			isBackupPlaylistPlaying = true;
			isSongMissing = true;
		}
		showOverlay();
	}

	function showOverlay() {
		if (overlayHideTimeout) {
			clearTimeout(overlayHideTimeout);
			overlayHideTimeout = null;
		}

		isOverlayRequested = true;
		overlayHideTimeout = setTimeout(() => {
			isOverlayRequested = false;
		}, 5000);
	}

	function enableDebugTools() {
		isDebugToolsEnabled = true;
		return 'Debug Tools Enabled.';
	}
</script>

<section class="overlay">
	<section
		class="currently-playing"
		class:hidden={!isOverlayShown}
		class:error={wsState === WebSocket.CLOSED}
	>
		{#if wsState === WebSocket.CONNECTING}
			<section class="ws-info">
				<LoadingIndicator size={24} />
				<p>Connecting to WebSocket...</p>
			</section>
		{:else if wsState === WebSocket.CLOSED}
			<section class="ws-info">
				<X size="24px" />
				<p>WebSocket connection closed. Please refresh overlay.</p>
			</section>
		{:else if isSongMissing}
			<h2>Nothing Playing</h2>
			<p>No more media in the queue.</p>
		{:else if currentSong}
			<img src={currentSong.thumbnail_url} alt={currentSong.title} />
			<section class="metadata">
				<h2>Currently Playing</h2>
				<p>{currentSong.title}</p>
				<p>Requested by {currentSong.requested_by}</p>
			</section>
		{/if}
	</section>

	{#if isDebugToolsEnabled}
		<button onclick={() => (isOverlayShown = !isOverlayShown)}>Toggle visibility</button>
		<p style="color:black">WebSocket state: {wsState}</p>
	{/if}
</section>

<style lang="scss">
	.currently-playing {
		position: fixed;
		bottom: 20px;
		left: 20px;

		text-align: center;
		color: white;
		background-color: #000000e2;
		border: #44ff00 2px solid;
		border-radius: 10px;

		padding: 10px 20px;

		transition: 1s;
		transform: translateY(0px);

		width: 512px;

		&.error {
			border: red 2px solid;
			animation: pulse_error 1s infinite;
		}

		img {
			width: 128px;
			float: left;
		}

		h2 {
			margin: 0;
			font-size: 1.5rem;
		}

		p {
			font-size: 1.25rem;
			margin: 0;
		}

		&.hidden {
			transform: translateY(150%);
		}
	}

	@keyframes pulse_error {
		0% {
			background-color: #ff0000e9;
		}
		50% {
			background-color: #000000e2;
		}
		100% {
			background-color: #ff0000e9;
		}
	}
</style>
