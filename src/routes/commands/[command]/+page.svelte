<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { GetCommands } from '$lib/API/Bot';
	import { onMount } from 'svelte';
	import LoadingIndicator from '../../../components/LoadingIndicator.svelte';

	let commandName = page.params.command;
	let command: Command | undefined = undefined;

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
		<h1 class="command-name">{command.name}</h1>
		{#each command.description as x}
			<p class="command-description">{x}</p>
		{/each}
        <h2>Usage Examples</h2>
        {#each command.usage_examples as example}
            <p class="command-usage-example">{example}</p>
        {/each}
		<div class="command-details">
			<h2>Details</h2>
			<ul>
				<li><strong>Usage:</strong> {command.usage}</li>
				<li><strong>Category:</strong> {command.category}</li>
				<li><strong>Cooldown:</strong> {command.user_cooldown} seconds</li>
				<li><strong>Aliases:</strong> {command.aliases.join(', ') || 'None'}</li>
                <li><strong>Required Channel Power:</strong> {command.required_channel_power ?? 'None'}</li>
                <li><strong>Required Global Power:</strong> {command.required_global_power ?? 'None'}</li>
			</ul>
		</div>
	{:else}
		<p>Loading command details...</p>
		<LoadingIndicator />
	{/if}
</section>