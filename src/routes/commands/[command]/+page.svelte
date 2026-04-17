<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { GetCommands } from '$lib/API/Bot';
	import { onMount } from 'svelte';
	import LoadingIndicator from '../../../components/LoadingIndicator.svelte';
	import { X } from 'phosphor-svelte';
	import type { User } from '$lib/API/Models/Users';
	import { myUser } from '$lib/stores/userStore';

	let commandName = page.params.command;
	let command: Command | undefined = $state(undefined);

	let me: User | null = $state(null);

	myUser.subscribe((value) => {
		if (value) me = value;
	});

	onMount(async () => {
		let commands = await GetCommands();

		command = commands?.find((c) => c.name === commandName);
		if (!command) {
			console.log(`Command "${commandName}" not found, redirecting...`);
			goto('/commands');
			return;
		}

		console.log(`Command page for "${commandName}" mounted`);
	});
</script>

<section class="command">
	{#if command}
		<button onclick={() => history.back()}>
			<X size={24} color="#33ca00" weight="bold" />
		</button>
		<h1 class="command-name"><span class="hash">#</span>{command.name}</h1>
		<hr />
		{#if command.description.length > 0}
			<section class="description">
				{#each command.description as x}
					<p>{x}</p>
				{/each}
			</section>
		{/if}

		{#if command.usage}
			<h2>Usage</h2>
			<section class="usage-examples">
				<p>{command.usage}</p>
			</section>
		{/if}

		{#if command.usage_examples.length > 0}
			<h2>Usage Examples</h2>
			<section class="usage-examples">
				{#each command.usage_examples as example}
					<p>{example}</p>
				{/each}
			</section>
		{/if}

		<div class="command-details">
			<h2>Details</h2>
			<ul>
				{#if command.category}
					<li><strong>Category:</strong> {command.category}</li>
				{/if}
				{#if command.aliases.length > 0}
					<li><strong>Aliases:</strong> {command.aliases.join(', ') || 'None'}</li>
				{/if}
				{#if command.user_cooldown > 0}
					<li><strong>User Cooldown:</strong> {command.user_cooldown} seconds</li>
				{/if}
				{#if command.channel_cooldown > 0}
					<li><strong>Channel Cooldown:</strong> {command.channel_cooldown} seconds</li>
				{/if}
				{#if command.required_channel_power != null}
					{#if command.required_channel_power > 0}
						<li><strong>Required Channel Power:</strong> {command.required_channel_power}</li>
					{:else}
						<li><strong>Required Channel Power:</strong> None</li>
					{/if}
				{/if}
				{#if (me?.role?.power ?? 0) > 0}
					<li><strong>Required Global Power:</strong> {command.required_global_power ?? 'None'}</li>
				{:else if command.required_global_power == null && (command.required_channel_power ?? 0) > 0}
					<li><strong>This command can't be bypassed by bot staff</strong></li>
				{/if}
			</ul>
		</div>
	{:else}
		<section class="loader">
			<p>Loading command details...</p>
			<LoadingIndicator />
		</section>
	{/if}
</section>

<style lang="scss">
	.command {
		background-color: #101010;
		padding: 10px;
		margin: 10px 0;

		h1 {
			font-family: monospace;
			font-size: 2rem;
			margin: 0;
		}

		h2 {
			font-family: monospace;
			font-size: 1.75rem;
			margin: 10px 0;
		}

		.description {
			p {
				margin: 4px 0;
			}
		}

		.usage-examples {
			p {
				font-family: monospace;
				color: #33ca00;
				background: rgba(51, 202, 0, 0.06);
				border: 1px solid rgba(51, 202, 0, 0.12);
				border-radius: 4px;
				padding: 8px;
			}
		}

		button {
			background: none;
			border: none;
			cursor: pointer;

			position: absolute;
			right: 20px;
			padding: 5px 0 0 0;
		}

		span.hash {
			font-family: monospace;
			color: #33ca00;
		}

		.loader {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 10px;

			p {
				font-weight: bold;
				margin: 0 0 10px 0;
			}
		}
	}
</style>
