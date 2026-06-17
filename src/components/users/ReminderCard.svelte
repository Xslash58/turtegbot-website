<script lang="ts">
	import type { Reminder } from '$lib/API/Models/Users';
	import {
		Clock,
		ClockUser,
		Dresser,
		Eye,
		EyeSlash,
		Lightning,
		Target,
		Trash,
		User
	} from 'phosphor-svelte';
	import UserComponent from './UserComponent.svelte';
	import { formatDate } from '$lib/Utilities';
	import VericalDivider from '$components/VericalDivider.svelte';
	import kickLogo from '$lib/assets/KickLogo.svg';
	import twitchLogo from '$lib/assets/glitch_flat_white.svg';

	const {
		data,
		adminMode = false,
		onDelete,
		onStatusChange
	}: {
		data: Reminder;
		adminMode?: boolean;
		onDelete?: (id: number) => void;
		onStatusChange?: (id: number, isViewed: boolean) => void;
	} = $props();
</script>

<section class="reminder">
	<nav>
		{#if adminMode}
			<button style="--hoverColor: green" onclick={() => onStatusChange?.(data.id, !data.isViewed)}>
				{#if data.isViewed}
					<Eye weight="fill" color="green" size={24} />
				{:else}
					<EyeSlash weight="fill" color="green" size={24} />
				{/if}
			</button>
		{/if}
		<button style="--hoverColor: red" onclick={() => onDelete?.(data.id)}>
			<Trash weight="fill" color="red" size={24} />
		</button>
	</nav>
	<section class="content">
		<p>{data.content}</p>
		<section class="metadata">
			{#if adminMode}
				<section class="user">
					<User weight="bold" />
					<UserComponent userId={data.authorId} username={data.author} />
				</section>
				<VericalDivider />
			{/if}
			<section class="target">
				<Target weight="bold" />
				<UserComponent userId={data.userId} username={data.username} />
			</section>
			<VericalDivider />
			<section class="room">
				<Dresser weight="bold" />
				<p>{data.channel}</p>
			</section>
			<VericalDivider />
			{#if adminMode}
				<section class="id">
					<p>#{data.id}</p>
				</section>
				<VericalDivider />
			{/if}
			<section class="date">
				<ClockUser weight="bold" />
				<p>{formatDate(data.date)}</p>
			</section>
		</section>
		<section class="type">
			{#if data.isInstant}
				<Lightning color="white" weight="fill" size={24} />
			{:else}
				<Clock color="white" weight="fill" size={24} />
			{/if}
		</section>
		<section class="platform">
			{#if data.platform === 'KICK'}
				<img src={kickLogo} alt="Kick Logo" width="24" />
			{:else if data.platform === 'TWITCH'}
				<img src={twitchLogo} alt="Twitch Logo" width="24" />
			{:else}
				{data.platform}
			{/if}
		</section>
	</section>
</section>

<style lang="scss">
	@use 'sass:color';
	.reminder {
		width: 100%;
		background-color: #101010;
		border-radius: 8px;

		outline: 1px solid green;

		margin: 5px 0px;

		display: flex;
		flex-direction: row;
		min-height: 100px;

		nav {
			display: flex;
			flex-direction: column;
			background-color: #141414;

			button {
				flex-grow: 1;

				background: none;
				border: none;
				color: white;
				width: 75px;

				cursor: pointer;

				&:hover {
					background: color-mix(in srgb, var(--hoverColor), #000 70%);
				}
			}
		}

		section.content {
			position: relative;

			display: flex;
			flex-direction: column;
			justify-content: space-around;

			width: 100%;
			padding: 10px 15px;

			& > p {
				width: 75%;
				margin: 0;
				margin-bottom: 5px;
			}
			section.metadata {
				width: 90%;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				align-items: center;
				column-gap: 7px;

				color: gray;

				& > section {
					display: flex;
					flex-direction: row;
					align-items: center;
					& > p {
						margin: 0;
						text-wrap: nowrap;
					}
				}
			}
			.type {
				position: absolute;
				right: 10px;
				top: 10px;
			}
			.platform {
				position: absolute;
				right: 10px;
				bottom: 10px;
			}
		}
	}
</style>
