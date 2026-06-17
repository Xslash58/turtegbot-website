<script lang="ts">
	import type { AFK } from '$lib/API/Models/Users';
	import {
		Backpack,
		Bed,
		Briefcase,
		Check,
		ClockCountdown,
		ClockUser,
		DotsThree,
		Exam,
		Lightning,
		LightningSlash,
		Moon,
		NotePencil,
		Shower,
		Trash,
		User
	} from 'phosphor-svelte';
	import UserComponent from '$components/users/UserComponent.svelte';
	import { formatDate } from '$lib/Utilities';
	import VericalDivider from '$components/VericalDivider.svelte';
	import { AFKType } from '$lib/API/Models/Admin';

	const typeIcons: Record<AFKType, typeof DotsThree> = {
		[AFKType.NORMAL]: DotsThree,
		[AFKType.SLEEP]: Bed,
		[AFKType.SHOWER]: Shower,
		[AFKType.SCHOOL]: Backpack,
		[AFKType.STUDY]: Exam,
		[AFKType.WORK]: Briefcase,
		[AFKType.NAP]: Moon
	};

	let {
		data,
		adminMode = false,
		isEditing = false,
		onDelete,
		onStatusChange,
		onEditToggle,
		onEditSave
	}: {
		data: AFK;
		adminMode?: boolean;
		isEditing?: boolean;
		onDelete?: (id: number) => void;
		onStatusChange?: (id: number, isActive: boolean) => void;
		onEditToggle?: (id: number, isEditing: boolean) => void;
		onEditSave?: (id: number, newData: AFK) => void;
	} = $props();

	let TypeIcon = $state(typeIcons[data.type as AFKType]);
	let newData: AFK | null = $state(null);

	$effect(() => {
		TypeIcon = typeIcons[data.type as AFKType];
	});

	function toggleEdit() {
		isEditing = !isEditing;

		if (!isEditing) saveEdit();
		else newData = { ...data };

		onEditToggle?.(data.ID, isEditing);
	}

	function saveEdit() {
		if (newData) onEditSave?.(data.ID, newData);
	}
</script>

<section class="afk">
	<nav>
		{#if adminMode}
			<button
				style="--hoverColor: {data.isActive ? 'green' : 'red'}"
				onclick={() => onStatusChange?.(data.ID, !data.isActive)}
			>
				{#if data.isActive}
					<LightningSlash weight="fill" color="red" size={24} />
				{:else}
					<Lightning weight="fill" color="green" size={24} />
				{/if}
			</button>
			<button style="--hoverColor: {isEditing ? 'green' : 'white'}" onclick={toggleEdit}>
				{#if isEditing}
					<Check weight="fill" color="green" size={24} />
				{:else}
					<NotePencil weight="fill" color="white" size={24} />
				{/if}
			</button>
		{/if}
		<button style="--hoverColor: red" onclick={() => onDelete?.(data.ID)}>
			<Trash weight="fill" color="red" size={24} />
		</button>
	</nav>
	<section class="content">
		{#if isEditing && newData}
			<textarea bind:value={newData.reason}></textarea>
		{:else}
			<p>{data.reason}</p>
		{/if}
		<section class="metadata">
			<section class="user">
				<User weight="bold" />
				<UserComponent userId={data.userId} username={data.username} />
			</section>
			<VericalDivider />
			<section class="id">
				<p>#{data.ID}</p>
			</section>
			<VericalDivider />
			<section class="date">
				<ClockUser weight="bold" />
				{#if isEditing && newData}
					<input type="datetime-local" bind:value={newData.date} />
				{:else}
					<p>{formatDate(data.date)}</p>
				{/if}
			</section>
			<VericalDivider />
			<section class="date">
				<ClockCountdown weight="bold" />
				{#if isEditing && newData}
					<input type="datetime-local" bind:value={newData.endDate} />
				{:else}
					<p>{data.endDate ? formatDate(data.endDate) : 'N/A'}</p>
				{/if}
			</section>
		</section>
		<section class="type">
			{#if isEditing && newData}
				<select bind:value={newData.type}>
					{#each Object.entries(AFKType) as [key, value]}
						{#if !isNaN(Number(value))}
							<option {value} selected={value === data.type}>
								{key}
							</option>
						{/if}
					{/each}
				</select>
			{:else}
				<TypeIcon color="white" weight="bold" size={24} />
			{/if}
		</section>
		<section class="status">
			{#if data.isActive}
				<Lightning color="green" weight="fill" size={24} />
			{:else}
				<LightningSlash color="red" weight="fill" size={24} />
			{/if}
		</section>
	</section>
</section>

<style lang="scss">
	@use 'sass:color';
	.afk {
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
			.status {
				position: absolute;
				right: 10px;
				bottom: 10px;
			}

			textarea {
				width: 75%;
				height: 60px;
				resize: vertical;
				background-color: transparent;
				border: 1px solid #333;
				color: white;
				padding: 5px;
				box-sizing: border-box;
				font-family: inherit;
				font-size: inherit;
			}
			input[type='datetime-local'] {
				width: 100%;
				padding: 5px;
				box-sizing: border-box;
				background-color: #1a1a1a;
				border: 1px solid #333;
				color: white;
			}
			select {
				width: 100%;
				padding: 5px;
				box-sizing: border-box;
				background-color: #1a1a1a;
				border: 1px solid #333;
				color: white;
			}
		}
	}
</style>
