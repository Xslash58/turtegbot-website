<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import LoadingIndicator from './LoadingIndicator.svelte';

	interface Song {
		id: string;
		sourceId: string;
		title: string;
	}

	let playerContainer: HTMLElement;
	let player: any = $state(null);
	let isApiReady: boolean = $state(false);
	let isPlaying: boolean = $state(false);
	let volume: number = $state(50);

	let {
		currentSong = $bindable<Song | null>(null),
		onPlayerReady = () => {},
		onSongEnded = () => {},
		onSongError = (errorCode: number) => {}
	} = $props();

	onMount(async () => {
		if (!window.YT) {
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';
			const firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

			window.onYouTubeIframeAPIReady = () => {
				initPlayer();
			};
		} else {
			initPlayer();
		}
	});

	function initPlayer() {
		isApiReady = true;
		player = new window.YT.Player(playerContainer, {
			height: '100%',
			width: '100%',
			videoId: 'oxzEdm29JLw',
			playerVars: {
				autoplay: 1,
				controls: 1,
				disablekb: 1,
				fs: 0,
				rel: 0,
				origin: window.location.origin
			},
			events: {
				onReady: (event: any) => {
					event.target.setVolume(volume);
					if (currentSong?.sourceId) {
						event.target.loadVideoById(currentSong.sourceId);
					}
					onPlayerReady(event);
				},
				onStateChange: handleStateChange,
				onError: handleError
			}
		});
	}

	function handleStateChange(event: any) {
		if (event.data === window.YT.PlayerState.ENDED) {
			isPlaying = false;
			onSongEnded();
		} else if (event.data === window.YT.PlayerState.PLAYING) {
			isPlaying = true;
		} else if (event.data === window.YT.PlayerState.PAUSED) {
			isPlaying = false;
		}
	}

	function handleError(event: any) {
		console.error('YouTube Player Error:', event.data);
		onSongError(event.data);
	}

	$effect(() => {
		if (player && currentSong?.sourceId) {
			player.loadVideoById(currentSong.sourceId);
		}
	});

	export function play() {
		if (player) {
			player.playVideo();
		}
	}
	export function pause() {
		if (player) {
			player.pauseVideo();
		}
	}
	export function setVolume(newVolume: number) {
		if (player) {
			volume = newVolume;
			player.setVolume(volume);
		}
	}
	export function setVideoById(videoId: string) {
		if (player) {
			player.loadVideoById(videoId);
		}
	}
	export function loadPlaylist(playlistId: string) {
		if (player) {
			player.loadPlaylist({
				list: playlistId,
				listType: 'playlist',
				index: 0,
				startSeconds: 0
			});
			setTimeout(() => {
				player.setShuffle({ shufflePlaylist: true });
				player.playVideoAt(0);
			}, 500);
		}
	}

	onDestroy(() => {
		player?.destroy();
	});
</script>

<section class="player-wrapper">
	<section class="player-container" bind:this={playerContainer}></section>
	{#if !isApiReady}
		<LoadingIndicator />
		<p>Loading YouTube Player...</p>
	{/if}
</section>

<style lang="scss">
	.player-wrapper {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		background: #000;
		border-radius: 12px;
		overflow: hidden;

		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.loading-overlay {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		color: #fff;
		background: rgba(0, 0, 0, 0.8);
		font-weight: 500;
	}
</style>
