<script lang="ts">
	import { goto } from '$app/navigation';
	import type { MediaSettings } from '$lib/API/Models/Media';
	import { ArrowUUpLeft } from 'phosphor-svelte';
	import { onMount } from 'svelte';

	let settings: MediaSettings;

	onMount(() => {
		const loadedSettings = loadSettings();
		if (loadedSettings) {
			settings = loadedSettings;
		}
	});

	async function handleForm(e: any) {
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData);

		const settings: MediaSettings = {
			queue_backup_playlist_url: data['queue-backup-playlist'] as string | null
		};

		saveSettings(settings);
	}

	function saveSettings(settings: MediaSettings) {
		if (window.localStorage) {
			window.localStorage.setItem('turteg-mediarequests-settings', JSON.stringify(settings));
		}
	}

	function loadSettings(): MediaSettings | null {
		if (window.localStorage) {
			const settingsString = window.localStorage.getItem('turteg-mediarequests-settings');
			if (settingsString) {
				return JSON.parse(settingsString) as MediaSettings;
			}
		}
		return null;
	}
</script>

<section class="settings">
	<button on:click={() => goto('.')} id="back-button">
		<ArrowUUpLeft size={24} color="white" weight="bold" />
	</button>
	<form on:submit|preventDefault={handleForm}>
		<section class="category queue">
			<label>
				Backup playlist ID:
				<br />
				<input
					type="text"
					name="queue-backup-playlist"
					id="queue-backup-playlist"
					autocomplete="off"
					value={settings?.queue_backup_playlist_url ?? ''}
				/>
			</label>
		</section>

		<button type="submit">Save</button>
	</form>
</section>

<style lang="scss">
	section.settings {
		button#back-button {
			background: none;
			border: none;
			cursor: pointer;
			padding: 0;
		}

		section.category {
			background-color: #0a0a0a;
			padding: 20px 10px;
			border-radius: 5px;
		}

		section.queue {
			input#queue-backup-playlist {
				margin-top: 5px;
				box-sizing: border-box;
				padding: 5px 10px;
				width: 100%;
				border-radius: 5px;
				border: 1px solid #333;
				color: #fff;
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
		}
	}
</style>
