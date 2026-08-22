<script lang="ts">
	import { goto } from '$app/navigation';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import VolumeSlider from '$components/users/media-requests/VolumeSlider.svelte';
	import UserComponent from '$components/users/UserComponent.svelte';
	import YoutubePlayer from '$components/YoutubePlayer.svelte';
	import {
		GetMediaHistory,
		GetMediaQueue,
		GetMediaSettings,
		RequestHistoryMedia,
		SkipMedia
	} from '$lib/API/Media';
	import type { MediaRequest, MediaSettings } from '$lib/API/Models/Media';
	import { feedbackDialog } from '$lib/stores/modalStore';
	import { profileUser } from '$lib/stores/userStore';
	import {
		CaretLeft,
		CaretRight,
		Gear,
		Play,
		SkipBack,
		SkipForward,
		Trash,
		X
	} from 'phosphor-svelte';
	import { onDestroy, onMount } from 'svelte';

	let user = $profileUser;

	let playerRef: YoutubePlayer | null = $state(null);
	let playerCustomLoadMessage: string | null = $state(null);

	let mediaSettings: MediaSettings | null = $state(null);
	let songQueue: MediaRequest[] = $state([]);
	let songHistory: MediaRequest[] = $state([]);
	let currentSong: MediaRequest | null = $state(null);
	let isPlayerReady: boolean = $state(false);
	let isQueueLoaded: boolean = $state(false);
	let isSongMissing: boolean = $state(false);
	let isBackupPlaylistPlaying: boolean = $state(false);
	let isHistoryLoading: boolean = $state(false);
	let historyPage: number = $state(0);
	let currentCategory: number = $state(0);
	let volume: number = $state(10);
	let wsState: number = $state(WebSocket.CONNECTING);
	let ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
	let wsConnectionAttempts: number = $state(0);
	let isFirstLoad: boolean = $state(true);
	let pingInterval: ReturnType<typeof setInterval> | null = null;

	onMount(async () => {
		if (user == null) return;

		if (user.roomIds == null || Object.keys(user.roomIds).length === 0) {
			feedbackDialog.set({
				title: 'No Room Found',
				content: 'Add bot to your channel first. If you have already done so, please login again.',
				visible: true
			});
			goto(`/users/${user.id}`);
			return;
		}

		// Beta disclaimer
		clearLegacyData();
		feedbackDialog.set({
			title: 'Media Requests are in Public Beta',
			content: `Some features might not be fully functional yet.
			If you encounter any issues or have feedback, please let us know!`,
			visible: true
		});

		ws.onopen = async () => {
			console.log('WebSocket connection established');
			wsConnectionAttempts = 0;
			wsState = WebSocket.OPEN;

			for (const [_, roomId] of Object.entries(user.roomIds)) {
				ws.send(JSON.stringify({ action: 'subscribe', room: `room:${roomId}` }));
			}

			let currentPlayerTime = undefined;
			if (!isFirstLoad) currentPlayerTime = playerRef?.getCurrentTime();

			await loadMediaQueue();

			// If player loaded first then start the queue here.
			if (isPlayerReady && (currentSong === null || !isBackupPlaylistPlaying)) {
				endSong();
			}

			if (currentPlayerTime != undefined) {
				endSong();
				setTimeout(() => {
					playerRef?.seekTo(currentPlayerTime ?? 0);
				}, 1000);
			}

			isFirstLoad = false;
		};

		ws.onmessage = (event) => {
			const msg = JSON.parse(event.data);
			if (msg.event === 'media_request') {
				songQueue.push(msg.data);
				if (isBackupPlaylistPlaying) {
					isBackupPlaylistPlaying = false;
					endSong();
				}
				isSongMissing = false; // Reset the missing song flag
			} else if (msg.event == 'media_request_history') {
				const msg = JSON.parse(event.data);
				playerRef?.setVideoById(msg.data.video_id);
				if (currentSong) {
					songQueue.unshift(currentSong);
				}
				currentSong = msg.data;
				isBackupPlaylistPlaying = false;
				isSongMissing = false; // Reset the missing song flag
			} else if (msg.event == 'media_skip') {
				handleWebSocketMediaSkip(msg.data.id);
			} else if (msg.event === 'media_volume') {
				if (playerRef) {
					playerRef.setVolume(msg.data.volume);
					volume = msg.data.volume;
				}
			}
		};

		ws.onclose = () => {
			console.log('WebSocket connection closed');
			wsState = WebSocket.CLOSED;
			setTimeout(webSocketReconnect, 5000);
		};

		if (window) {
			pingInterval = window.setInterval(webSocketPing, 30000);
		}

		mediaSettings = await GetMediaSettings(user.roomIds[Object.keys(user.roomIds)[0]]);
		await loadHistoryPage(historyPage);
	});

	onDestroy(() => {
		if (pingInterval) {
			window.clearInterval(pingInterval);
		}
		if (ws) {
			ws.onclose = null;
			ws.close();
		}
	});

	$effect(() => {
		if (!currentSong && !isBackupPlaylistPlaying && isQueueLoaded && isPlayerReady)
			playerCustomLoadMessage = 'Waiting for media...';
		else playerCustomLoadMessage = null;
	});

	function webSocketReconnect() {
		if (wsConnectionAttempts >= 3) {
			feedbackDialog.set({
				title: 'WebSocket Connection Closed',
				content:
					'The connection to the server has been closed. Please refresh the page to reconnect.',
				visible: true
			});
			return;
		}
		if (wsState === WebSocket.CLOSED) {
			wsState = WebSocket.CONNECTING;
			wsConnectionAttempts += 1;
			const newWs = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

			newWs.onopen = ws.onopen;
			newWs.onmessage = ws.onmessage;
			newWs.onclose = ws.onclose;

			ws = newWs;
		}
	}

	function webSocketPing() {
		if (wsState === WebSocket.OPEN) {
			ws.send(JSON.stringify({ action: 'ping' }));
		}
	}

	function handlePlayerReady(event: any) {
		console.log('Player is ready:', event);
		playerRef?.setVolume(volume);
		isPlayerReady = true;

		if (isQueueLoaded) {
			endSong();
		}
	}

	async function handleSongEnded() {
		if (currentSong) await SkipMedia(currentSong.room_id, currentSong.id);
	}

	function handleSongError(errorCode: number) {
		console.error('Error playing song:', errorCode);
		endSong();
	}

	function handleVolumeChange(newVolume: number) {
		playerRef?.setVolume(newVolume);
	}

	async function handlePrevSong() {
		if (songHistory.length > 0) {
			let prevSongIndex = songHistory.length - 1;
			if (currentSong) {
				const currentSongIndex = songHistory.findIndex((song) => song.id === currentSong?.id);
				if (currentSongIndex > 0) {
					prevSongIndex = currentSongIndex - 1;
				}
			}
			const prevSong = songHistory[prevSongIndex];
			await RequestHistoryMedia(prevSong.room_id, prevSong.id);
		}
	}

	function handleWebSocketMediaSkip(song_id: string) {
		if (currentSong && currentSong.id === song_id) {
			endSong();
		} else {
			songQueue = songQueue.filter((song) => song.id !== song_id);
		}
	}

	function endSong() {
		if (currentSong) {
			songHistory.push(currentSong);
			currentSong = null;
		}

		if (songQueue.length > 0) {
			const nextSong = songQueue.shift();
			if (nextSong) {
				let timeoutDuration = 0;
				if (currentSong == null && !isBackupPlaylistPlaying) {
					timeoutDuration = 1000; // delay so the player can load
				}

				setTimeout(() => {
					playerRef?.setVideoById(nextSong.video_id);
					currentSong = nextSong;
				}, timeoutDuration);
			}
		} else {
			isSongMissing = true;
			playerRef?.loadPlaylist(mediaSettings?.queue_backup_playlist_id ?? '');
			if (mediaSettings?.queue_backup_playlist_id) {
				isBackupPlaylistPlaying = true;
			}
		}
	}

	async function playSongFromHistory(media: MediaRequest) {
		await RequestHistoryMedia(media.room_id, media.id);
		// if (index >= 0 && index < songHistory.length) {
		// 	const selectedSong = songHistory[index];

		// 	if (currentSong) {
		// 		songQueue.unshift(currentSong);
		// 	}
		// 	if (selectedSong) {
		// 		console.log('Selected song:', selectedSong);
		// 		songQueue.unshift(selectedSong);
		// 		if (!isSongMissing) endSong();
		// 		isSongMissing = false;
		// 		isBackupPlaylistPlaying = false;
		// 	}
		// }
	}

	async function loadHistoryPage(page: number) {
		if (user == null) return;

		if (page < 0 || isHistoryLoading) return;

		isHistoryLoading = true;
		let tempHistory: MediaRequest[] = [];
		for (const [_, roomId] of Object.entries(user.roomIds)) {
			const fetchedHistory = await GetMediaHistory(roomId, page);
			if (fetchedHistory) {
				tempHistory = [...tempHistory, ...fetchedHistory];
			}
		}

		if (tempHistory.length === 0 && page > 0) {
			isHistoryLoading = false;
			return;
		}

		songHistory = tempHistory;
		historyPage = page;
		isHistoryLoading = false;
	}

	async function loadMediaQueue() {
		if (user == null) return;

		playerCustomLoadMessage = 'Loading media queue...';
		songQueue = [];

		for (const [_, roomId] of Object.entries(user.roomIds)) {
			const fetchedQueue = await GetMediaQueue(roomId);
			if (fetchedQueue) {
				songQueue = [...songQueue, ...fetchedQueue];
			}
		}

		isQueueLoaded = true;
		playerCustomLoadMessage = null;
	}

	async function deleteSong(media: MediaRequest) {
		await SkipMedia(media.room_id, media.id);
	}

	function clearLegacyData() {
		if (window.localStorage) {
			localStorage.removeItem(`turteg-mediarequests-songQueue-${user?.id}`);
			localStorage.removeItem(`turteg-mediarequests-songHistory-${user?.id}`);
			localStorage.removeItem(`turteg-mediarequests-settings`);
		}
	}
</script>

<section class="media-requests">
	<section class="player">
		{#if !isSongMissing || mediaSettings?.queue_backup_playlist_id}
			<YoutubePlayer
				bind:this={playerRef}
				bind:customLoadingMessage={playerCustomLoadMessage}
				onPlayerReady={handlePlayerReady}
				onSongEnded={handleSongEnded}
				onSongError={handleSongError}
			/>
			<section class="current-metadata">
				{#if currentSong}
					<p>
						Requested by:
						<UserComponent
							userId={Number(currentSong.user_id)}
							username={currentSong.requested_by}
						/>
					</p>
				{:else if isBackupPlaylistPlaying}
					<p>Playing backup playlist</p>
				{/if}
			</section>
			<section class="controls">
				<button class="prev" onclick={handlePrevSong}>
					<SkipBack size={24} />
				</button>
				<button class="skip" onclick={handleSongEnded} disabled={isSongMissing}>
					<SkipForward size={24} />
				</button>
				<VolumeSlider onVolumeChange={handleVolumeChange} bind:volume />
				<button class="settings" onclick={() => goto(`mediarequests/settings`)}>
					<Gear size={24} />
				</button>
			</section>
		{:else if !mediaSettings?.queue_backup_playlist_id}
			<h1>No more media in the queue.</h1>
		{/if}
	</section>

	{#if wsState !== WebSocket.OPEN}
		<section class="ws-info" class:closed={wsState === WebSocket.CLOSED}>
			{#if wsState === WebSocket.CONNECTING}
				<LoadingIndicator size={24} />
				<p>Connecting to the WebSocket...</p>
			{:else if wsState === WebSocket.CLOSED}
				<X size={24} />
				<p>Connection lost. Please refresh the page...</p>
			{/if}
		</section>
	{/if}

	<section class="categories">
		<button class:active={currentCategory === 0} onclick={() => (currentCategory = 0)}>
			Queue
		</button>
		<button class:active={currentCategory === 1} onclick={() => (currentCategory = 1)}>
			History
		</button>
	</section>

	<section class="queue">
		{#if currentCategory === 0}
			{#if !isSongMissing}
				{#each songQueue as songData}
					<section class="request">
						<img src={songData.thumbnail_url} alt="" />
						<section class="metadata">
							<p>{songData.title}</p>
							<p class="requested-by">
								Requested by: <UserComponent
									userId={Number(songData.user_id)}
									username={songData.requested_by}
								/>
							</p>
						</section>
						<section class="actions">
							<button class="delete" onclick={() => deleteSong(songData)}>
								<Trash size={24} weight="fill" />
							</button>
						</section>
					</section>
				{/each}
			{:else if songQueue.length < 1}
				<p>No media in the queue.</p>
			{/if}
		{:else if currentCategory === 1}
			<nav>
				<button
					onclick={() => loadHistoryPage(historyPage - 1)}
					class="nav"
					disabled={historyPage === 0}
				>
					<CaretLeft size={24} />
				</button>
				{#if isHistoryLoading}
					<LoadingIndicator size={18} />
				{:else}
					<p>{historyPage}</p>
				{/if}
				<button onclick={() => loadHistoryPage(historyPage + 1)} class="nav">
					<CaretRight size={24} />
				</button>
			</nav>
			{#each songHistory as songData}
				<section class="request">
					<img src={songData.thumbnail_url} alt="" />
					<section class="metadata">
						<p>{songData.title}</p>
						<p class="requested-by">
							Requested by: <UserComponent
								userId={Number(songData.user_id)}
								username={songData.requested_by}
							/>
						</p>
					</section>
					<section class="actions">
						<button class="play" onclick={() => playSongFromHistory(songData)}>
							<Play size={24} weight="fill" />
						</button>
					</section>
				</section>
			{/each}
		{/if}
	</section>
</section>

<style lang="scss">
	section.media-requests {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;

		section.player {
			width: 500px;
			display: flex;
			flex-direction: column;
			gap: 5px;

			h1 {
				text-align: center;
			}

			section.controls {
				display: flex;
				justify-content: center;

				button {
					background: none;
					border: none;
					cursor: pointer;
					color: white;

					&:hover {
						color: #1ed760;
					}
					&:disabled {
						cursor: not-allowed;
						color: #555;
					}
				}
			}
		}

		section.current-metadata {
			color: #aaa;
			text-align: center;
			p {
				margin: 0;
			}
		}

		section.categories {
			display: flex;
			gap: 10px;
			margin-bottom: 20px;

			button {
				background: none;
				border: none;
				cursor: pointer;
				color: white;

				&.active {
					color: #1ed760;
				}
			}
		}

		section.queue {
			margin: 0;
			width: 100%;
			display: flex;
			flex-direction: column;

			> p {
				text-align: center;
				margin: 0;
			}

			button {
				&.play {
					color: green;
				}

				&.nav {
					color: white;

					&:hover {
						color: #1ed760;
					}
				}

				background: none;
				color: red;
				border: none;
				cursor: pointer;

				&:disabled {
					cursor: not-allowed;
					color: #555;
				}

				&:hover {
					color: white;
				}
			}

			nav {
				display: flex;
				justify-content: center;
				align-items: center;
				gap: 10px;
				margin-bottom: 10px;

				p {
					margin: 0;
				}
			}

			section.request {
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: 10px;
				&:nth-child(odd) {
					background-color: #2a2a2a;
				}
				background-color: #1a1a1a;
				padding: 10px;

				img {
					width: 80px;
					height: 45px;
					object-fit: cover;
					border-radius: 5px;
				}

				section.metadata {
					display: flex;
					flex-direction: column;
					flex: 1;

					p {
						margin: 0;
						color: white;
					}

					p.requested-by {
						font-size: 0.8rem;
						color: #aaa;
					}
				}

				section.actions {
					display: flex;
					align-items: center;
					justify-content: center;
					margin-left: auto;
				}
			}
		}

		section.ws-info {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			gap: 10px;

			min-width: 350px;
			width: 50%;
			margin: 10px;
			padding: 5px 10px;

			border-radius: 5px;

			&.closed {
				background-color: #ff000090;
			}

			* {
				margin: 0;
			}
		}
	}

	@media (max-width: 768px) {
		section.media-requests {
			section.player {
				width: 100%;
			}
		}
	}
</style>
