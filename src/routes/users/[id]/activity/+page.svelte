<script lang="ts">
	import type { ActivityLog } from '$lib/API/Models/Room';
	import type { User } from '$lib/API/Models/Users';
	import { GetRecentActivityLogs } from '$lib/API/Room';
	import { profileUser } from '$lib/stores/userStore';
	import { onMount } from 'svelte';
	import LoadingIndicator from '../../../../components/LoadingIndicator.svelte';

	let user: User | null = $profileUser;

	let logs: ActivityLog[] | null = null;

	let roomId: string = '';
	let isLoaded: boolean = false;

	onMount(async () => {
		if (user != null) roomId = Object.values(user.roomIds)[0];
		await fetchActivityLogs(roomId);
	});

	async function fetchActivityLogs(roomId: string) {
		if (!roomId) return;
		isLoaded = false;
		logs = await GetRecentActivityLogs(roomId);
		isLoaded = true;
	}

	function formatDate(dateStr: Date) {
		const date = new Date(dateStr);
		const pad = (n: number) => n.toString().padStart(2, '0');
		return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
	}

	function formatDuration(duration: string): string {
		if (!duration) return duration;
		// Matches "HH:MM:SS" or "HH:MM:SS.milliseconds"
		const match = duration.match(/^(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?$/);
		if (!match) return duration;

		const [, hh, mm, ss, ms] = match;
		const hours = parseInt(hh, 10);
		const minutes = parseInt(mm, 10);
		const seconds = parseInt(ss, 10);
		const milliseconds = ms ? ms.slice(0, 1) : '0'; // Use '0' if ms missing

		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		} else if (minutes > 0) {
			return `${minutes}m ${seconds}s`;
		} else {
			return `${seconds}.${milliseconds}s`;
		}
	}
</script>

<section class="activity">
	<section class="settings">
		<label>
			Display activity for:
			<select bind:value={roomId} on:change={() => fetchActivityLogs(roomId)}>
				{#each Object.entries(user?.roomIds ?? {}) as [platform, id]}
					<option value={id}>{platform}</option>
				{/each}
			</select>
		</label>
	</section>
	{#if logs && Object.keys(logs).length > 0 && isLoaded}
		<ul>
			{#each logs as log}
				<li>
					<section class="user">
						<p>
							{#if log.username}
								<strong>{log.username}</strong>
							{:else}
								<strong>TurtegBot</strong>
							{/if}
							<span>{formatDate(log.timestamp)}</span>
						</p>
					</section>
					{#if log.actionType == 'power_set'}
						Changed power of <strong>{JSON.parse(log.details).username}</strong> to
						<strong>{JSON.parse(log.details).power}</strong>
					{:else if log.actionType == 'power_remove'}
						Removed power of <strong>{JSON.parse(log.details).username}</strong>
					{:else if log.actionType == 'prefix_set'}
						Changed bot prefix to <strong>{JSON.parse(log.details).prefix}</strong>
					{:else if log.actionType == 'language_set'}
						Changed bot language to <strong>{JSON.parse(log.details).lang}</strong>
					{:else if log.actionType == 'cmd_add'}
						Added command <strong>{JSON.parse(log.details).commandText}</strong>
					{:else if log.actionType == 'cmd_modify'}
						Modified command <strong>{JSON.parse(log.details).commandText}</strong>
					{:else if log.actionType == 'cmd_remove'}
						Removed command <strong>{JSON.parse(log.details).commandText}</strong>
					{:else if log.actionType == 'config_set'}
						Changed <strong>{JSON.parse(log.details).key}</strong> to
						<strong>{JSON.parse(log.details).value}</strong>
					{:else if log.actionType == 'config_experiment'}
						Changed status of <strong>{JSON.parse(log.details).key}</strong> experiment to
						<strong>{JSON.parse(log.details).value}</strong>
					{:else if log.actionType == 'gcmd_disable'}
						Disabled global command <strong>{JSON.parse(log.details).cmd}</strong>
					{:else if log.actionType == 'gcmd_enable'}
						Enabled global command <strong>{JSON.parse(log.details).cmd}</strong>
					{:else if log.actionType == 'gcmd_ignore'}
						Ignored global command <strong>{JSON.parse(log.details).cmd}</strong>
					{:else if log.actionType == 'gcmd_unignore'}
						Unignored global command <strong>{JSON.parse(log.details).cmd}</strong>
					{:else if log.actionType == 'mod_add'}
						{#if JSON.parse(log.details).isTimed}
							Added <strong>{JSON.parse(log.details).username}</strong> as {log.platform} moderator for
							<strong>{formatDuration(JSON.parse(log.details).timeSpan)}</strong>
							(Expires <strong>{formatDate(JSON.parse(log.details).revokeDate)}</strong>)
						{:else}
							Added <strong>{JSON.parse(log.details).username}</strong> as {log.platform} moderator
						{/if}
					{:else if log.actionType == 'mod_remove'}
						{#if JSON.parse(log.details).isTimed}
							Removed <strong>{JSON.parse(log.details).username}</strong> from being {log.platform} moderator
							after <strong>{formatDuration(JSON.parse(log.details).lasted)}</strong>
						{:else}
							Removed <strong>{JSON.parse(log.details).username}</strong> from being {log.platform} moderator
						{/if}
					{:else if log.actionType == 'vip_add'}
						{#if JSON.parse(log.details).isTimed}
							Added <strong>{JSON.parse(log.details).username}</strong> as {log.platform} VIP for
							<strong>{formatDuration(JSON.parse(log.details).timeSpan)}</strong>
							(Expires <strong>{formatDate(JSON.parse(log.details).revokeDate)}</strong>)
						{:else}
							Added <strong>{JSON.parse(log.details).username}</strong> as {log.platform} VIP
						{/if}
					{:else if log.actionType == 'vip_remove'}
						{#if JSON.parse(log.details).isTimed}
							Removed <strong>{JSON.parse(log.details).username}</strong> from being {log.platform} VIP
							after <strong>{formatDuration(JSON.parse(log.details).lasted)}</strong>
						{:else}
							Removed <strong>{JSON.parse(log.details).username}</strong> from being {log.platform} VIP
						{/if}
					{:else if log.actionType == 'twitch_ban'}
						Banned <strong>{log.targetUsername}</strong> from {log.platform}
						{JSON.parse(log.details).ends
							? `until ${formatDate(JSON.parse(log.details).ends)}`
							: ''}
					{:else if log.actionType == 'twitch_unban'}
						Unbanned <strong>{log.targetUsername}</strong> from {log.platform}
					{:else if log.actionType == 'twitch_setgame'}
						Changed game on {log.platform} to <strong>{JSON.parse(log.details).gameName}</strong>
					{:else if log.actionType == 'twitch_settitle'}
						Changed title on {log.platform} to <strong>{JSON.parse(log.details).title}</strong>
					{:else if log.actionType == 'webhook_create'}
						Created {log.platform} chat webhook
					{:else if log.actionType == '7tv_add'}
						{#if !JSON.parse(log.details).isTimed}
							Added 7TV emote <a href={`https://7tv.app/emotes/${JSON.parse(log.details).emote.Id}`}
								target="_blank">{JSON.parse(log.details).emote.Alias}</a
							>
							to
							<a href={`https://7tv.app/emote-sets/${JSON.parse(log.details).emoteSet?.id}`}
								target="_blank">{JSON.parse(log.details).emoteSet?.name}</a
							>
						{:else}
							Added 7TV emote <a href={`https://7tv.app/emotes/${JSON.parse(log.details).emote.Id}`}
								target="_blank">{JSON.parse(log.details).emote.Alias}</a
							>
							to
							<a href={`https://7tv.app/emote-sets/${JSON.parse(log.details).emoteSet?.id}`}
								target="_blank">{JSON.parse(log.details).emoteSet?.name}</a
							>
							for
							<strong>{formatDuration(JSON.parse(log.details).timeSpan)}</strong>
							(Expires <strong>{formatDate(JSON.parse(log.details).expires)}</strong>)
						{/if}
					{:else if log.actionType == '7tv_remove'}
						Removed 7TV emote <a
							href={`https://7tv.app/emotes/${JSON.parse(log.details).emote?.id}`}
							target="_blank">{JSON.parse(log.details).emote?.name}</a
						>
						from
						<a href={`https://7tv.app/emote-sets/${JSON.parse(log.details).emoteSet?.id}`}
							target="_blank">{JSON.parse(log.details).emoteSet?.name}</a
						>
					{:else if log.actionType == '7tv_alias'}
						Aliased 7TV emote from <a
							href={`https://7tv.app/emotes/${JSON.parse(log.details).emote?.id}`}
							target="_blank">{JSON.parse(log.details).from}</a
						>
						to
						<a href={`https://7tv.app/emote-sets/${JSON.parse(log.details).emoteSet?.id}`}
							target="_blank">{JSON.parse(log.details).to}</a
						>
						in
						<a href={`https://7tv.app/emote-sets/${JSON.parse(log.details).emoteSet?.id}`}
							target="_blank">{JSON.parse(log.details).emoteSet?.name}</a
						>
					{:else if log.actionType == '7tv_yoink'}
						Yoinked 7TV emote <a
							href={`https://7tv.app/emotes/${JSON.parse(log.details).emote?.Id}`}
							target="_blank">{JSON.parse(log.details).emote?.Alias}</a
						>
						from
						<a href={`https://7tv.app/emote-sets/${JSON.parse(log.details).fromEmoteSet?.id}`}
							target="_blank">{JSON.parse(log.details).fromEmoteSet?.name}</a
						>
						to
						<a href={`https://7tv.app/emote-sets/${JSON.parse(log.details).toEmoteSet?.id}`}
							target="_blank">{JSON.parse(log.details).toEmoteSet?.name}</a
						>
					{:else if log.actionType == '7tv_replace'}
						Replaced 7TV emote
						<a href={`https://7tv.app/emotes/${JSON.parse(log.details).oldEmote?.id}`}
							target="_blank">{JSON.parse(log.details).oldEmote?.name}</a>
						to
						<a href={`https://7tv.app/emotes/${JSON.parse(log.details).newEmote?.id}`}
							target="_blank">{JSON.parse(log.details).newEmote?.name}</a>
						in
						<a href={`https://7tv.app/emote-sets/${JSON.parse(log.details).emoteSet?.id}`}
							target="_blank">{JSON.parse(log.details).emoteSet?.name}</a>
					{:else}
						{log.actionType}
					{/if}
				</li>
			{/each}
		</ul>
	{:else if !isLoaded}
		<LoadingIndicator />
	{:else}
		<p>No activity logs found.</p>
	{/if}
</section>

<style lang="scss">
	section.activity {
		section.settings {
			margin-bottom: 1rem;

			label {
				font-weight: bold;

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
			}
		}

		ul {
			list-style: none;
			padding: 0;

			li {
				.user {
					p {
						margin: 0;

						span {
							font-size: 0.8rem;
							color: #999;
						}
					}
				}
				padding: 0.5rem 1rem;
				border-bottom: 1px solid #999;

				a {
					text-decoration: dotted underline;
					font-weight: bold;
				}
			}
		}
	}
</style>
