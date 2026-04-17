<script lang="ts">
	import { GetCommands } from '$lib/API/Bot';
	import type { User } from '$lib/API/Models/Users';
	import { myUser } from '$lib/stores/userStore';
	import { onMount } from 'svelte';
	import {
		DankFixEmote,
		StvLogo,
		BroadcasterIcon,
		ModeratorIcon,
		PepegaReadingEmote,
		TurtegEmote
	} from '$lib/assets';
	import { Empty, MagnifyingGlass, Warning, X } from 'phosphor-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	interface CommandCategory {
		name: string;
		description: string;
		commands: Command[];
	}

	let search = $state('');
	let selectedCategory = $state('All Commands');
	let commandCategories: CommandCategory[] = $state([]);
	let isLoading = $state(true);
	let error = $state('');

	let currentHash = $page.url.hash;

	let me: User | null = $state(null);

	myUser.subscribe((value) => {
		if (value) me = value;
	});

	const categoryMeta: Record<
		string,
		{ description: string; icon: { type: 'emoji' | 'img'; value: string } }
	> = {
		'All Commands': {
			description: 'All available TurtegBot commands, grouped by category',
			icon: { type: 'emoji', value: '♾️' }
		},
		Staff: {
			description: 'Bot staff and admin commands',
			icon: { type: 'img', value: DankFixEmote }
		},
		Broadcaster: {
			description: 'Broadcaster-level management commands',
			icon: { type: 'img', value: BroadcasterIcon }
		},
		Moderation: {
			description: 'Channel moderation and configuration',
			icon: { type: 'img', value: ModeratorIcon }
		},
		Turtles: {
			description: 'Turtle economy commands',
			icon: { type: 'img', value: TurtegEmote }
		},
		'7TV': {
			description: '7TV emote management commands',
			icon: { type: 'img', value: StvLogo }
		},
		Support: {
			description: 'Support and help commands',
			icon: { type: 'emoji', value: '❓' }
		},
		Spotify: {
			description: 'Spotify integration commands',
			icon: { type: 'img', value: 'https://cdn.brandfetch.io/spotify.com/symbol' }
		},
		Miscellaneous: {
			description: 'General purpose commands',
			icon: { type: 'img', value: PepegaReadingEmote }
		},
	};

	async function loadCommands() {
		error = '';
		isLoading = true;
		try {
			let commands = await GetCommands();
			if (commands) commandCategories = transformCommands(commands);
			else error = 'No commands found';
		} catch (e: any) {
			error = e?.message ?? 'Failed to load commands';
		} finally {
			isLoading = false;
		}
	}

	function transformCommands(raw: Command[]): CommandCategory[] {
		const categories: CommandCategory[] = [];

		for (const cmd of raw) {
			if (cmd.category === 'Special') continue;
			if(cmd.required_channel_power == null && cmd.required_global_power != null && (!me?.role.power || 
				cmd.required_global_power > me?.role.power)) continue;
			const catName = cmd.category || 'Miscellaneous';
			const existingCategory = categories.find((c) => c.name === catName);
			if (!existingCategory) {
				const meta = categoryMeta[catName];
				categories.push({
					name: catName,
					description: meta?.description ?? '',
					commands: []
				});
			}
			categories.find((c) => c.name === catName)!.commands.push(cmd);
		}

		return categories;
	}

	function getIcon(name: string) {
		return categoryMeta[name]?.icon ?? { type: 'img', value: PepegaReadingEmote };
	}

	let activeCategory = $derived(commandCategories.find((c) => c.name === selectedCategory));

	let filteredCommands = $derived(
		selectedCategory === 'All Commands'
			? search
				? commandCategories.flatMap((cat) =>
						cat.commands.filter(
							(cmd) =>
								cmd.name.toLowerCase().includes(search.toLowerCase()) ||
								cmd.description.some((x) => x.includes(search.toLowerCase()))
						)
					)
				: null
			: (activeCategory?.commands ?? []).filter(
					(cmd) =>
						cmd.name.toLowerCase().includes(search.toLowerCase()) ||
						cmd.description.some((x) => x.includes(search.toLowerCase()))
				)
	);

	let totalCount = $derived(commandCategories.reduce((sum, cat) => sum + cat.commands.length, 0));

	onMount(async () => {
		await loadCommands();

		if(currentHash) {
			const categoryName = currentHash.substring(1);
			const key = Object.keys(categoryMeta).find(
				x => x.toLowerCase() === categoryName.toLowerCase()
			);
			if(key) selectedCategory = key;
		}
	});
</script>

<div class="page">
	<div class="search-wrapper">
		<div class="search-row">
			<div class="search-icon">
				<MagnifyingGlass />
			</div>
			<input
				type="text"
				placeholder="Search commands..."
				bind:value={search}
				autocomplete="off"
				spellcheck="false"
				disabled={isLoading}
			/>
			{#if search}
				<button class="clear" onclick={() => (search = '')} aria-label="Clear"><X weight="bold" /></button>
			{/if}
		</div>
	</div>

	<div class="layout">
		<nav class="sidebar">
			<!-- All Commands button -->
			<button
				class="cat-btn"
				class:active={selectedCategory === 'All Commands'}
				onclick={() => {
					selectedCategory = 'All Commands';
					search = '';
				}}
			>
				<span class="cat-icon">
					{#if getIcon('All Commands')?.type === 'emoji'}{getIcon('All Commands')
							.value}{:else if getIcon('All Commands')?.type === 'img'}<img
							src={getIcon('All Commands').value}
							alt=""
						/>{/if}
				</span>
				<span class="cat-label">All Commands</span>
				<span class="cat-count">{totalCount}</span>
			</button>

			{#each commandCategories as category}
				{@const icon = getIcon(category.name)}
				<button
					class="cat-btn"
					class:active={selectedCategory === category.name}
					onclick={() => {
						selectedCategory = category.name;
						search = '';
					}}
				>
					<span class="cat-icon">
						{#if icon?.type === 'emoji'}{icon.value}{:else if icon?.type === 'img'}<img
								src={icon.value}
								alt=""
							/>{/if}
					</span>
					<span class="cat-label">{category.name}</span>
					<span class="cat-count">{category.commands.length}</span>
				</button>
			{/each}
		</nav>

		<main>
			{#if isLoading}
				<div class="state-msg">
					<span class="spinner"></span>
					<p>Loading commands…</p>
				</div>
			{:else if error}
				<div class="state-msg error">
					<span class="state-icon"><Warning /></span>
					<p>Could not load commands: <strong>{error}</strong></p>
					<button class="retry-btn" onclick={loadCommands}>Retry</button>
				</div>
			{:else}
				<div class="main-header">
					<div class="main-title-row">
						{#if getIcon(selectedCategory)}
							<span class="main-icon">
								{#if getIcon(selectedCategory).type === 'emoji'}{getIcon(selectedCategory)
										.value}{:else}<img src={getIcon(selectedCategory).value} alt="" />{/if}
							</span>
						{/if}
						<div>
							<h2>{selectedCategory}</h2>
							<p class="cat-desc">
								{selectedCategory === 'All Commands'
									? 'All available TurtegBot commands, grouped by category'
									: (activeCategory?.description ?? '')}
							</p>
						</div>
					</div>
					<span class="result-count">
						{activeCategory?.commands.length ?? totalCount} command{(activeCategory?.commands
							.length ?? totalCount !== 1)
							? 's'
							: ''}
					</span>
				</div>

				{#if selectedCategory === 'All Commands' && !search}
					{#each commandCategories as category, i}
						{@const icon = getIcon(category.name)}
						<div class="category-section" style="--i: {i}">
							<div class="category-heading">
								{#if icon?.type === 'emoji'}
									<span class="cat-heading-icon">{icon.value}</span>
								{:else if icon?.type === 'img'}
									<img class="cat-heading-icon-img" src={icon.value} alt="" />
								{/if}
								<span class="category-heading-name">{category.name}</span>
								<span class="category-heading-desc">{category.description}</span>
								<span class="category-heading-count">{category.commands.length}</span>
							</div>
							<div class="commands-grid">
								{#each category.commands as command, j}
									<button class="command" style="--j: {j}" onclick={() => goto(`/commands/${command.name}`)}>
										<div class="cmd-top">
											<span class="hash">#</span>
											<span class="cmd-name">{command.name}</span>
										</div>
										{#if command.description.length > 0}
											<p class="cmd-desc">{command.description[0]}</p>
										{/if}
										{#if command.usage}
											<code class="cmd-usage">{command.usage}</code>
										{/if}
									</button>
								{/each}
							</div>
						</div>
					{/each}
				{:else if (filteredCommands as any[])?.length === 0}
					<div class="empty">
						<span class="empty-icon"><Empty /></span>
						<p>No commands match "<strong>{search}</strong>"</p>
					</div>
				{:else}
					<div class="commands-grid">
						{#each filteredCommands as any[] as command, j}
							<button class="command" style="--j: {j}" onclick={() => goto(`/commands/${command.name}`)}>
								<div class="cmd-top">
									<span class="hash">#</span>
									<span class="cmd-name">{command.name}</span>
								</div>
								{#if command.description.length > 0}
									<p class="cmd-desc">{command.description[0]}</p>
								{/if}
								{#if command.usage}
									<code class="cmd-usage">{command.usage}</code>
								{/if}
							</button>
						{/each}
					</div>
				{/if}	
			{/if}
		</main>
	</div>
</div>

<style lang="scss">
	* {
		box-sizing: border-box;
	}

	.page {
		font-family: 'Inter', sans-serif;
	}

	.layout {
		display: flex;
		max-width: 1100px;
		margin: 0 auto;
		padding: 32px 24px 80px;
		gap: 28px;
		align-items: flex-start;
	}

	.search-wrapper {
		max-width: 1100px;
		margin: 0 auto;
		padding: 24px 24px 0;
	}

	.sidebar {
		width: 210px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
		position: sticky;
		top: 24px;
	}

	.cat-btn {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 8px 10px;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 6px;
		cursor: pointer;
		text-align: left;
		transition: background 0.15s;
		gap: 8px;
	}

	.cat-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		font-size: 14px;
		line-height: 1;
		img {
			width: 20px;
			height: 20px;
			object-fit: contain;
			border-radius: 3px;
		}
	}

	.cat-label {
		font-size: 0.85rem;
		color: #888;
		transition: color 0.15s;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
	}

	.cat-count {
		font-size: 0.72rem;
		color: #444;
		flex-shrink: 0;
	}

	.cat-btn:hover {
		background: #181818;
		.cat-label {
			color: #ccc;
		}
	}
	.cat-btn.active {
		background: rgba(51, 202, 0, 0.08);
		border-color: rgba(51, 202, 0, 0.2);
		.cat-label {
			color: #33ca00;
			font-weight: 500;
		}
		.cat-count {
			color: #33ca00;
		}
	}

	main {
		flex: 1;
		min-width: 0;
	}

	.main-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 20px;
		padding-bottom: 16px;
		border-bottom: 1px solid #1e1e1e;
	}

	.main-title-row {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.main-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		font-size: 22px;
		flex-shrink: 0;
		img {
			width: 36px;
			height: 36px;
			object-fit: contain;
			border-radius: 4px;
		}
	}

	.main-header h2 {
		margin: 0 0 4px;
		font-size: 1.3rem;
		font-weight: 600;
		color: #f0f0f0;
	}
	.cat-desc {
		margin: 0;
		font-size: 0.82rem;
		color: #555;
	}
	.result-count {
		font-size: 0.78rem;
		color: #444;
		white-space: nowrap;
		padding-top: 4px;
	}

	/* Loading / error states */
	.state-msg {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 14px;
		padding: 80px 20px;
		color: #555;
		font-size: 0.9rem;
		p {
			margin: 0;
		}
	}
	.state-msg.error {
		color: #888;
	}
	.state-icon {
		font-size: 2rem;
	}

	.spinner {
		width: 28px;
		height: 28px;
		border: 2px solid #222;
		border-top-color: #33ca00;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.retry-btn {
		margin-top: 4px;
		padding: 6px 16px;
		background: rgba(51, 202, 0, 0.1);
		border: 1px solid rgba(51, 202, 0, 0.25);
		border-radius: 6px;
		color: #33ca00;
		font-size: 0.82rem;
		cursor: pointer;
		transition: background 0.15s;
		&:hover {
			background: rgba(51, 202, 0, 0.18);
		}
	}

	.category-section {
		margin-bottom: 36px;
		animation: fadeIn 0.25s ease both;
		animation-delay: calc(var(--i) * 40ms);
	}

	.category-heading {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 12px;
		padding-bottom: 8px;
		border-bottom: 1px solid #1e1e1e;
	}

	.cat-heading-icon {
		font-size: 16px;
		line-height: 1;
		flex-shrink: 0;
	}
	.cat-heading-icon-img {
		width: 18px;
		height: 18px;
		object-fit: contain;
		border-radius: 3px;
		flex-shrink: 0;
	}
	.category-heading-name {
		font-size: 1rem;
		font-weight: 600;
		color: #33ca00;
		white-space: nowrap;
	}
	.category-heading-desc {
		font-size: 0.78rem;
		color: #484848;
		flex: 1;
	}
	.category-heading-count {
		font-size: 0.72rem;
		color: #444;
		flex-shrink: 0;
	}

	.search-row {
		display: flex;
		align-items: center;
		gap: 10px;
		background: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.25);
		border-radius: 8px;
		padding: 0 14px;
		width: 210px;
		backdrop-filter: blur(4px);
		transition:
			background 0.15s,
			border-color 0.15s;

		&:focus-within {
			background: rgba(0, 0, 0, 0.3);
			border-color: rgba(255, 255, 255, 0.5);
		}

		.search-icon {
			width: 16px;
			height: 16px;
			color: rgba(255, 255, 255, 0.6);
			flex-shrink: 0;
		}
		input {
			flex: 1;
			background: transparent;
			border: none;
			outline: none;
			font-size: 0.9rem;
			color: white;
			padding: 13px 0;
			&::placeholder {
				color: rgba(255, 255, 255, 0.5);
			}
			&:disabled {
				opacity: 0.4;
				cursor: not-allowed;
			}
		}
		.clear {
			background: none;
			border: none;
			color: rgba(255, 255, 255, 0.5);
			cursor: pointer;
			font-size: 0.75rem;
			padding: 4px;
			line-height: 1;
			transition: color 0.15s;
			flex-shrink: 0;
			&:hover {
				color: white;
			}
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.commands-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 10px;
	}

	.command {
		background: #181818;
		border: 1px solid #222;
		border-radius: 8px;
		padding: 14px 16px;
		display: flex;
		flex-direction: column;
		transition:
			border-color 0.15s,
			background 0.15s;
		animation: cmdIn 0.2s ease both;
		animation-delay: calc(var(--j) * 15ms);

		min-width: 0;
		text-align: left;

		&:hover {
			border-color: #33ca00;
			background: #1a1a1a;
			cursor: pointer;
			.cmd-name {
				color: #33ca00;
			}
			.hash {
				opacity: 1;
			}
		}
	}

	@keyframes cmdIn {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.cmd-top {
		display: flex;
		align-items: baseline;
		gap: 1px;
		margin-bottom: 6px;
	}
	.hash {
		font-family: monospace;
		font-size: 0.9rem;
		color: #33ca00;
		opacity: 0.4;
		transition: opacity 0.15s;
		flex-shrink: 0;
	}
	.cmd-name {
		font-family: monospace;
		font-size: 0.88rem;
		font-weight: 600;
		color: #c0c0c0;
		transition: color 0.15s;
	}
	.cmd-desc {
		margin: 0 0 10px;
		font-size: 0.8rem;
		color: #555;
		line-height: 1.5;
	}
	.cmd-usage {
		display: block;
		margin-top: auto;
		font-family: monospace;
		font-size: 0.78rem;
		color: #33ca00;
		background: rgba(51, 202, 0, 0.06);
		border: 1px solid rgba(51, 202, 0, 0.12);
		border-radius: 4px;
		padding: 4px 8px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.empty {
		text-align: center;
		padding: 60px 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		color: #444;
		.empty-icon {
			font-size: 2rem;
		}
		p {
			margin: 0;
			font-size: 0.9rem;
		}
		strong {
			color: #666;
		}
	}

	@media (max-width: 640px) {
		.search-wrapper {
			padding: 16px 16px 0;
		}
		.search-row {
			width: 100%;
		}
		.layout {
			flex-direction: column;
			align-items: stretch;
			padding: 20px 16px 60px;
		}
		.sidebar {
			width: 100%;
			position: static;
			flex-direction: row;
			gap: 6px;

			overflow-x: scroll;
			scrollbar-width: initial;

			&::-webkit-scrollbar {
				height: 6px;
			}
		}
		.cat-btn {
			width: auto;
			padding: 6px 10px;
			.cat-count {
				display: none;
			}
		}
		.commands-grid {
			grid-template-columns: 1fr;
		}
		.category-heading-desc {
			display: none;
		}
	}
</style>
