<script lang="ts">
	import type { Language, RoomSettings } from '$lib/API/Models/Room';
	import type { Webhook } from '$lib/API/Models/Users';
	import {
	DeleteWebhook,
		GetAvailableLanguages,
		GetRoomPowers,
		GetRoomSettings,
		UpdateRoomSettings
	} from '$lib/API/Room';
	import { GetWebhooks } from '$lib/API/Room';
	import { confirmationDialog } from '$lib/stores/modalStore';
	import { profileUser } from '$lib/stores/userStore';
	import { copyToClipboard, formatDate } from '$lib/Utilities';
	import { Trash } from 'phosphor-svelte';
	import { onMount } from 'svelte';

	let user = $profileUser;
	let languages: Language[] = [];
	let settings: RoomSettings | null = null;
	let userPowers: Record<string, number> | null = null;
	let webhooks: Webhook[] | null = null;

	let selectedPlatform = '';

	let feedbackMessage = '';
	let roomPrefix = '';

	onMount(async () => {
		selectedPlatform = Object.keys(user?.roomIds ?? {})[0];

		const langResponse = await GetAvailableLanguages();
		if (langResponse) languages = langResponse;

		await fetchData(selectedPlatform);
	});

	async function fetchData(platform: string) {
		settings = null;
		userPowers = null;
		webhooks = null;
		feedbackMessage = '';
		if (user == null) return;

		const settingsResponse = await GetRoomSettings(user.roomIds[platform]);
		if (settingsResponse) settings = settingsResponse;

		roomPrefix = settings?.prefix ?? '#';

		const powersResponse = await GetRoomPowers(user.roomIds[platform]);
		if (powersResponse) userPowers = powersResponse;

		const webhookResponse = await GetWebhooks(user.roomIds[platform]);
		if (webhookResponse) webhooks = webhookResponse;
	}

	async function removeWebhook(webhookId: string, force: boolean = false) {
		if(user == null) return;
		
		if(!force) {
			confirmationDialog.set({
				visible: true,
				text: `Are you sure you want to delete this webhook?
				This action is irreversible.`,
				onConfirm: async () => {
					await removeWebhook(webhookId, true);
				}
			});
			return;
		}

		const success = await DeleteWebhook(user.roomIds[selectedPlatform], webhookId);
		webhooks = webhooks?.filter(w => w.webhookId !== webhookId) ?? null;
	}

	async function handleForm(e: any) {
		feedbackMessage = '';
		if (user == null) return;

		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData);

		const settings: RoomSettings = {
			prefix: data.prefix as string,
			language: data.language as string
		};

		const success = await UpdateRoomSettings(user.roomIds[selectedPlatform], settings);
		if (success) {
			feedbackMessage = 'Settings updated successfully';
		} else {
			feedbackMessage = 'Failed to update settings';
		}
	}
	async function handleScopesForm(e: any) {
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData.entries());

		let redirectUri = import.meta.env.VITE_AUTH_TWITCH_URL_SCOPES + '&scope=';

		let scopes = ["channel:bot"];
		for (const key in data) {
			scopes.push(key);
		}

		redirectUri += scopes.join('+');

		window.localStorage.setItem('turteg-scopes', scopes.join('+'));

		window.location.href = redirectUri;
	}
</script>

<section class="settings">
	<form class="room-select">
		<label
			>Editing settings for:
			<select
				id="room"
				name="room"
				bind:value={selectedPlatform}
				on:change={() => fetchData(selectedPlatform)}
			>
				{#each Object.keys(user?.roomIds ?? {}) as roomPlatform}
					<option value={roomPlatform}>{roomPlatform}</option>
				{/each}
			</select>
		</label>
		<p>{feedbackMessage}</p>
	</form>

	<br />

	{#if selectedPlatform}
		<form on:submit|preventDefault={handleForm}>
			<section class="global-settings">
				<h1>Platform Settings</h1>
				<section class="form-group">
					<label
						>Language:
						<select id="language" name="language">
							{#each languages as language}
								<option value={language.locale} selected={settings?.language == language.locale}>
									{language.name}
								</option>
							{/each}
						</select>
					</label>

					<label
						>Prefix:
						<input
							type="text"
							id="prefix"
							name="prefix"
							size="1"
							maxlength="1"
							bind:value={roomPrefix}
						/>
					</label>
				</section>
			</section>
			<input type="submit" value="Save Settings" />
		</form>

		{#if selectedPlatform == 'TWITCH'}
			<br />

			<form on:submit|preventDefault={handleScopesForm}>
				<section class="scopes-settings">
					<h1>Twitch Scopes</h1>
					<section class="form-group">
						<label
							><input type="checkbox" name="channel:manage:vips" /> Allow bot to grant VIPs on your behalf
						</label>
						<label
							><input type="checkbox" name="channel:manage:moderators" /> Allow bot to grant Moderators
							on your behalf
						</label>
						<label
							><input type="checkbox" name="channel:manage:broadcast" /> Allow bot to manage broadcast
						</label>
					</section>
				</section>
				<input type="submit" value="Save Settings" />
			</form>
		{/if}

		{#if userPowers && Object.keys(userPowers).length > 0}
			<br />

			<section class="panel">
				<section class="user-powers">
					<h1>Users Data</h1>
					<table>
						<thead>
							<tr>
								<th>User</th>
								<th>Power</th>
							</tr>
						</thead>
						<tbody>
							{#each Object.entries(userPowers) as [username, power]}
								<tr>
									<td class="username"><b>{username}</b></td>
									<td>{power}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</section>
			</section>
		{/if}

		{#if webhooks && webhooks.length > 0}
			<br />

			<section class="panel">
				<section class="webhooks">
					<h1>Webhooks</h1>
					<table>
						<thead>
							<tr>
								<th></th>
								<th>Created At</th>
								<th>Webhook</th>
							</tr>
						</thead>
						<tbody>
							{#each webhooks as webhook}
								<tr>
									<td class="actions">
										<button on:click={() => removeWebhook(webhook.webhookId)}>
											<Trash fill="red" size={20} />
										</button>
									</td>
									<td>{formatDate(webhook.createdAt)}</td>
									<td class="webhook-id">
										<button on:click={() => copyToClipboard(`https://turteghook.xslash.ovh/webhooks/${webhook.webhookId}`)}>
											{webhook.webhookId}
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</section>
			</section>
		{/if}
	{/if}
</section>

<style lang="scss">
	section.form-group {
		display: flex;
		flex-direction: column;
	}

	h1 {
		font-size: 1.25rem;
		margin: 0.5rem 0;
	}
	label {
		display: flex;
		align-items: center;
		gap: 5px;
		margin-bottom: 0.5rem;
	}

	form.room-select {
		padding: 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		label {
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0;
		}
		p {
			font-weight: bold;
			margin: 0;
		}
	}

	section.panel,
	form {
		background-color: #0a0a0a;
		padding: 5px 10px 10px 10px;
		border-radius: 10px;
	}

	input,
	select {
		background-color: #191919;
		color: white;
		border: none;
		outline: none;

		text-align: center;

		&:focus {
			outline: none;
			outline: 1px solid #4a90e2;
		}

		&:hover {
			background-color: #282828;
		}
	}

	input[type='text'],
	select {
		border-radius: 4px;
	}

	section.user-powers {
		td {
			text-align: center;
			button {
				background: none;
				border: none;
				cursor: pointer;
				transition: 0.1s transform;

				&:hover {
					transform: scale(1.1);
				}
			}
			&.username {
				text-align: left;
			}
		}
	}

	section.webhooks {
		td {
			text-align: center;
			padding: 2px 5px;
			&.webhook-id {
				button {
					font-family: monospace;
					text-align: left;
					word-break: break-all;
					font-size: 1rem;
					font-weight: bold;
				}

				filter: blur(4px);
				transition: filter 0.3s;
			}
			&.webhook-id:hover {
				filter: none;
			}

			button {
				background: none;
				border: none;
				vertical-align: middle;
				color: white;
			}

			&.actions button {
				transition: 0.1s transform;
				&:hover {
					transform: scale(1.1);

					cursor: pointer;
				}
			}
		}
	}
</style>
