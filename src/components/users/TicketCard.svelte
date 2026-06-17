<script lang="ts">
	import type { Ticket } from '$lib/API/Models/Users';
	import {
		ArrowCounterClockwise,
		Check,
		ClockUser,
		Lightbulb,
		Trash,
		User,
		Warning,
		X
	} from 'phosphor-svelte';
	import UserComponent from './UserComponent.svelte';
	import { formatDate } from '$lib/Utilities';
	import VericalDivider from '$components/VericalDivider.svelte';

	const {
		data,
		adminMode = false,
		onApprove,
		onDeny,
		onRevert,
		onDelete
	}: {
		data: Ticket;
		adminMode?: boolean;
		onApprove?: (id: number) => void;
		onDeny?: (id: number) => void;
		onRevert?: (id: number) => void;
		onDelete?: (id: number) => void;
	} = $props();
</script>

<section class="ticket" class:handled={(data.approved || data.denied) && adminMode}>
	<nav>
		{#if (!data.denied && !data.approved) || !adminMode}
			{#if adminMode}
				<button style="--hoverColor: green" onclick={() => onApprove?.(data.ID)}>
					<Check weight="fill" color="green" size={24} />
				</button>
				<button style="--hoverColor: orange" onclick={() => onDeny?.(data.ID)}>
					<X weight="fill" color="orange" size={24} />
				</button>
			{/if}
			<button
				style="--hoverColor: red"
				onclick={() => onDelete?.(data.ID)}
				disabled={(data.approved || data.denied) && !adminMode}
			>
				<Trash weight="fill" color="red" size={24} />
			</button>
		{:else}
			<button style="--hoverColor: aqua" onclick={() => onRevert?.(data.ID)}>
				<ArrowCounterClockwise weight="fill" color="aqua" size={24} />
			</button>
		{/if}
	</nav>
	<section class="content">
		<p>{data.message}</p>
		<section class="metadata">
			{#if adminMode}
				<section class="user">
					<User weight="bold" />
					<UserComponent userId={data.userId} username={data.username} />
				</section>
				<VericalDivider />
			{/if}
			<section class="id">
				<p>#{data.ID}</p>
			</section>
			<VericalDivider />
			<section class="date">
				<ClockUser weight="bold" />
				<p>{formatDate(data.date)}</p>
			</section>
		</section>
		<section class="type">
			{#if data.type == 1}
				<Lightbulb color="white" weight="fill" size={24} />
			{:else}
				<Warning color="white" weight="fill" size={24} />
			{/if}
		</section>
		<section class="status">
			{#if data.approved}
				<Check color="green" weight="bold" size={24} />
			{:else if data.denied}
				<X color="red" weight="bold" size={24} />
			{/if}
		</section>
	</section>
</section>

<style lang="scss">
	@use 'sass:color';
	.ticket {
		width: 100%;
		background-color: #101010;
		border-radius: 8px;

		outline: 1px solid green;

		margin: 5px 0px;

		display: flex;
		flex-direction: row;
		min-height: 100px;

		&.handled {
			opacity: 0.5;
		}

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
				&:disabled {
					cursor: not-allowed;
					opacity: 0.5;
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
			.status {
				position: absolute;
				right: 10px;
				bottom: 10px;
			}
		}
	}
</style>
