<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import { GetMediaSettings, PostMediaSettings } from '$lib/API/Media';
	import type { MediaSettings } from '$lib/API/Models/Media';
	import type { User } from '$lib/API/Models/Users';
	import { feedbackDialog } from '$lib/stores/modalStore';
	import { profileUser } from '$lib/stores/userStore';
	import { ArrowUUpLeft } from 'phosphor-svelte';
	import { onMount } from 'svelte';

	let settings: MediaSettings = $state({
		queue_backup_playlist_id: null,
		queue_requests_allowed: false,
		queue_requests_blacklist: '',
		queue_youtube_minviews: 1000,
		queue_youtube_maxduration: 300
	});

	let isLoading: boolean = $state(true);

	let user: User | null = $profileUser;

	onMount(async () => {
		if (user == null) return;

		const loadedSettings = await GetMediaSettings(user.roomIds[Object.keys(user.roomIds)[0]]);
		if (loadedSettings) {
			settings = loadedSettings;
		}
		isLoading = false;
	});

	async function handleForm(e: any) {
		isLoading = true;
		e.preventDefault();
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData);

		const settings: MediaSettings = {
			queue_backup_playlist_id: data['queue-backup-playlist'] as string | null,
			queue_requests_allowed: data['queue-requests-allowed'] === 'on',
			queue_requests_blacklist: data['queue-requests-blacklist'] as string,
			queue_youtube_minviews: parseInt(data['queue-youtube-minviews'] as string) || 0,
			queue_youtube_maxduration: parseInt(data['queue-youtube-maxduration'] as string) || 0
		};

		if (user) {
			for (const [_, roomId] of Object.entries(user.roomIds)) {
				await PostMediaSettings(roomId, settings);
			}
		}
		isLoading = false;
	}

	function getOverlayUrl(): string {
		return `${window.location.origin}/users/${page.params.id}/mediarequests/overlay`;
	}

	function copyOverlayUrl() {
		const overlayUrl = getOverlayUrl();
		navigator.clipboard.writeText(overlayUrl).then(
			() => {
				console.log('Overlay URL copied to clipboard:', overlayUrl);
			},
			(err) => {
				console.error('Failed to copy overlay URL: ', err);
			}
		);
		feedbackDialog.set({
			title: 'Copied to Clipboard',
			content: 'The overlay URL has been copied to your clipboard.',
			visible: true
		});
	}
</script>

<section class="settings">
	<nav>
		<button onclick={() => goto('.')} id="back-button">
			<ArrowUUpLeft size={24} color="white" weight="bold" />
		</button>
		{#if isLoading}
			<LoadingIndicator size={24} />
		{/if}
	</nav>
	<form onsubmit={handleForm}>
		<fieldset class="category queue" disabled={isLoading}>
			<label>
				Backup playlist ID:
				<br />
				<input
					type="text"
					name="queue-backup-playlist"
					id="queue-backup-playlist"
					autocomplete="off"
					value={settings?.queue_backup_playlist_id ?? ''}
				/>
			</label>

			<label>
				Viewer Requests Allowed:
				<input
					type="checkbox"
					name="queue-requests-allowed"
					id="queue-requests-allowed"
					checked={settings?.queue_requests_allowed ?? false}
				/>
			</label>

			<label>
				Video IDs Blacklist (comma-separated):
				<input
					type="text"
					name="queue-requests-blacklist"
					id="queue-requests-blacklist"
					autocomplete="off"
					disabled
					value={'Not implemented yet...'}
				/>
			</label>

			<label>
				YouTube Minimum Views:
				<input
					type="number"
					name="queue-youtube-minviews"
					id="queue-youtube-minviews"
					autocomplete="off"
					value={settings?.queue_youtube_minviews ?? 0}
				/>
			</label>

			<label>
				YouTube Maximum Duration (seconds):
				<input
					type="number"
					name="queue-youtube-maxduration"
					id="queue-youtube-maxduration"
					autocomplete="off"
					value={settings?.queue_youtube_maxduration ?? 0}
				/>
			</label>
		</fieldset>
		<fieldset class="category overlay" disabled={isLoading}>
			<label>
				Browser Source (OBS) Overlay:
				<br />
				<input
					type="text"
					name="overlay-browser-source-url"
					id="overlay-browser-source-url"
					autocomplete="off"
					readonly
					value={getOverlayUrl()}
					onclick={copyOverlayUrl}
				/>
			</label>
		</fieldset>

		<button type="submit" disabled={isLoading}> Save Settings </button>
	</form>
</section>

<style lang="scss">
	section.settings {
		nav {
			display: flex;
			gap: 10px;
		}

		form {
			display: flex;
			flex-direction: column;
			gap: 10px;
		}

		button#back-button {
			background: none;
			border: none;
			cursor: pointer;
			padding: 0;
		}

		fieldset {
			border: 1px solid #333;
		}

		fieldset.category {
			background-color: #0a0a0a;
			padding: 20px 10px;
			border-radius: 5px;
			display: flex;
			flex-direction: column;
			gap: 10px;
		}

		input {
			box-sizing: border-box;
			padding: 5px 10px;
			border-radius: 5px;
			border: 1px solid #333;
			color: #fff;

			&:disabled {
				background-color: #1a1a1a;
				cursor: not-allowed;
				color: #888;
			}
		}

		fieldset.queue {
			input#queue-backup-playlist {
				margin-top: 5px;
				width: 100%;
			}
		}
		fieldset.overlay {
			input#overlay-browser-source-url {
				margin-top: 5px;
				width: 100%;
			}
		}

		button {
			background-color: #191919;
			color: white;
			border: none;
			padding: 5px 20px;
			border-radius: 5px;
			cursor: pointer;

			&:hover {
				background-color: #282828;
			}

			&:disabled {
				background-color: #1a1a1a;
				cursor: not-allowed;
				color: #888;
			}
		}
	}
</style>
