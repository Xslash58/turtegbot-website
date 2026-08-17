<script lang="ts">
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import VolumeSlider from '$components/users/media-requests/VolumeSlider.svelte';
	import YoutubePlayer from '$components/YoutubePlayer.svelte';
	import { confirmationDialog, feedbackDialog } from '$lib/stores/modalStore';
	import { profileUser } from '$lib/stores/userStore';
	import { Play, SkipBack, SkipForward, Trash, X } from 'phosphor-svelte';
	import { onMount } from 'svelte';

	let user = $profileUser;

	let playerRef: YoutubePlayer;

	let songQueue: any[] = [];
	let songHistory: any[] = [];
	let currentSong: any = null;
	let isSongMissing: boolean = false;
	let currentCategory: number = 0;
	let volume: number = 10;
	let wsState: number = WebSocket.CONNECTING;

	onMount(() => {
		if (user == null) return;

		const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
		ws.onopen = () => {
			console.log('WebSocket connection established');
			wsState = WebSocket.OPEN;

			for (const [_, roomId] of Object.entries(user.roomIds)) {
				ws.send(JSON.stringify({ action: 'subscribe', room: `room:${roomId}` }));
			}
		};

		ws.onmessage = (event) => {
			const msg = JSON.parse(event.data);
			if (msg.event === 'media_request') {
				songQueue.push(msg.data);
				triggerReactivity();
				isSongMissing = false; // Reset the missing song flag
			} else if (msg.event == 'media_skip') {
				handleSongEnded();
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
			feedbackDialog.set({
				title: 'WebSocket Connection Closed',
				content:
					'The connection to the server has been closed. Please refresh the page to reconnect.',
				visible: true
			});
		};

		if (window.localStorage) {
			const storedQueue = localStorage.getItem(`turteg-mediarequests-songQueue-${user?.id}`);
			const storedHistory = localStorage.getItem(`turteg-mediarequests-songHistory-${user?.id}`);

			if (storedQueue) {
				songQueue = JSON.parse(storedQueue);
			}

			if (storedHistory) {
				songHistory = JSON.parse(storedHistory);
			}
		}

		feedbackDialog.set({
			title: 'Media Requests are in Public Beta',
			content: `Please note that the request queue and history are currently stored locally in your browser. A dedicated backend implementation is planned to make the queue persistent, allow requests while the page is closed, and enable moderators to manage it directly via the website. A stream overlay (browser source) is also planned for future updates.
			If you encounter any issues or have feedback, please let us know!`,
			visible: true
		});
	});

	function handlePlayerReady(event: any) {
		console.log('Player is ready:', event);
		playerRef.setVolume(10);
		handleSongEnded();
	}

	function handleSongEnded() {
		if (currentSong) {
			songHistory.push(currentSong);
			currentSong = null;
		}

		if (songQueue.length > 0) {
			const nextSong = songQueue.shift();
			if (nextSong) {
				playerRef.setVideoById(nextSong.video_id);
				currentSong = nextSong;
			}
			triggerReactivity();
		} else isSongMissing = true; // No more songs in the queue
	}

	function handleSongError(errorCode: number) {
		console.error('Error playing song:', errorCode);
		handleSongEnded();
	}

	function handleVolumeChange(newVolume: number) {
		playerRef.setVolume(newVolume);
	}

	function handlePrevSong() {
		if (songHistory.length > 0) {
			songQueue.unshift(currentSong);
			const prevSong = songHistory.pop();
			if (prevSong) {
				playerRef.setVideoById(prevSong.video_id);
				currentSong = prevSong;
			}
			triggerReactivity();
		}
	}

	function playSongFromHistory(index: number) {
		console.log('Playing song from history at index:', index);
		console.log('Current song history:', songHistory);
		if (index >= 0 && index < songHistory.length) {
			const selectedSong = songHistory[index];
			console.log('Selected song from history:', selectedSong);
			if (currentSong) {
				songQueue.unshift(currentSong);
			}
			if (selectedSong) {
				console.log('Selected song:', selectedSong);
				songQueue.unshift(selectedSong);
				if (!isSongMissing) handleSongEnded();
				isSongMissing = false;
			}
			triggerReactivity();
		}
	}

	function handleClearAll(confirmed: boolean = false) {
		if (!confirmed) {
			confirmationDialog.set({
				text: `Are you sure you want to clear all media from the queue and history?
				This action is irreversible.`,
				onConfirm: () => handleClearAll(true),
				visible: true
			});
			return;
		}

		songQueue = [];
		songHistory = [];
		currentSong = null;
		isSongMissing = true;
		triggerReactivity();
		updateLocalStorage();
	}

	function deleteSong(index: number) {
		songQueue.splice(index, 1);
		triggerReactivity();
	}

	function triggerReactivity() {
		songQueue = [...songQueue];
		songHistory = [...songHistory];
		updateLocalStorage();
	}
	function updateLocalStorage() {
		if (currentSong) {
			localStorage.setItem(
				`turteg-mediarequests-songQueue-${user?.id}`,
				JSON.stringify([currentSong, ...songQueue])
			);
		} else {
			localStorage.setItem(`turteg-mediarequests-songQueue-${user?.id}`, JSON.stringify(songQueue));
		}
		
		localStorage.setItem(
			`turteg-mediarequests-songHistory-${user?.id}`,
			JSON.stringify(songHistory)
		);
	}
</script>

<section class="media-requests">
	<section class="player">
		{#if !isSongMissing}
			<YoutubePlayer
				bind:this={playerRef}
				onPlayerReady={handlePlayerReady}
				onSongEnded={handleSongEnded}
				onSongError={handleSongError}
			/>
			<section class="controls">
				<button class="prev" on:click={handlePrevSong}>
					<SkipBack size={24} />
				</button>
				<button class="skip" on:click={handleSongEnded}>
					<SkipForward size={24} />
				</button>
				<VolumeSlider onVolumeChange={handleVolumeChange} bind:volume />
				<button class="clear-all" on:click={() => handleClearAll(false)}>
					<Trash size={24} />
				</button>
			</section>
		{:else}
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
		<button class:active={currentCategory === 0} on:click={() => (currentCategory = 0)}>
			Queue
		</button>
		<button class:active={currentCategory === 1} on:click={() => (currentCategory = 1)}>
			History
		</button>
	</section>

	<section class="queue">
		{#if currentCategory === 0}
			{#each songQueue as songData, index}
				<section class="request">
					<img src={songData.thumbnail_url} alt="" />
					<section class="metadata">
						<p>{songData.title}</p>
						<p class="requested-by">Requested by: {songData.requested_by}</p>
					</section>
					<section class="actions">
						<button class="delete" on:click={() => deleteSong(index)}>
							<Trash size={24} weight="fill" />
						</button>
					</section>
				</section>
			{/each}
		{:else if currentCategory === 1}
			{#each songHistory.toReversed() as songData, index}
				{@const actualIndex = songHistory.length - 1 - index}
				<section class="request">
					<img src={songData.thumbnail_url} alt="" />
					<section class="metadata">
						<p>{songData.title}</p>
						<p class="requested-by">Requested by: {songData.requested_by}</p>
					</section>
					<section class="actions">
						<button class="play" on:click={() => playSongFromHistory(actualIndex)}>
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
				}
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

					button {
						&.play {
							color: green;
						}
						background: none;
						color: red;
						border: none;
						cursor: pointer;

						&:hover {
							color: white;
						}
					}
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
