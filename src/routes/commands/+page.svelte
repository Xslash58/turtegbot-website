<script lang="ts">
	import { onMount } from 'svelte';

	interface Command {
		name: string;
		category: string;
		description: string | string[];
		aliases: string[];
		usage: string;
		usage_examples: string[];
		channel_cooldown: number;
		user_cooldown: number;
		required_global_power: number | null;
		required_channel_power: number | null;
	}

	interface CommandCategory {
		name: string;
		description: string;
		commands: {
			name: string;
			description: string;
			usage: string;
		}[];
	}

	const API_URL = 'https://turteg-api.xslash.ovh/v1/bot/commands';

	let search = '';
	let selectedCategory = 'All Commands';
	let commandCategories: CommandCategory[] = [];
	let loading = true;
	let error = '';

	const categoryMeta: Record<
		string,
		{ description: string; icon: { type: 'emoji' | 'img'; value: string } }
	> = {
		'All Commands': {
			description: 'All available TurtegBot commands, grouped by category',
			icon: {
				type: 'img',
				value:
					'https://camo.githubusercontent.com/f5a24856b4a54064f17fdaa9889af670a097a3eaa6f9f480bfb5ad7a25a4d837/68747470733a2f2f63646e2e3774762e6170702f656d6f74652f3630623031666335616563633131653836633432353032612f34782e77656270'
			}
		},
		Economy: {
			description: 'Turtle economy commands',
			icon: { type: 'img', value: 'https://cdn.7tv.app/emote/01FFZ7NS600004BM088TM6XC8Y/4x.avif' }
		},
		Turtles: {
			description: 'Turtle economy commands',
			icon: { type: 'img', value: 'https://cdn.7tv.app/emote/01FFZ7NS600004BM088TM6XC8Y/4x.avif' }
		},
		Broadcaster: {
			description: 'Broadcaster-level management commands',
			icon: {
				type: 'img',
				value:
					'https://camo.githubusercontent.com/4a329fe4b76dc574e162cc479a545b967372237f6b95661608cb6c97785dc8ba/68747470733a2f2f7374617469632d63646e2e6a74766e772e6e65742f6261646765732f76312f35353237633538632d666237642d343232642d623731622d6633303964636238356363312f33'
			}
		},
		Moderation: {
			description: 'Channel moderation and configuration',
			icon: {
				type: 'img',
				value:
					'https://camo.githubusercontent.com/3949f5e722c86524c3752765157e99227f32f3ccd35d87c41ec6d6deabf921d5/68747470733a2f2f7374617469632d63646e2e6a74766e772e6e65742f6261646765732f76312f33323637363436642d333366302d346231372d623364662d6639323361343164623164302f33'
			}
		},
		'7TV': {
			description: '7TV emote management commands',
			icon: {
				type: 'img',
				value:
					'https://camo.githubusercontent.com/581fb8db60005b468924c8e03d0d25981136747bc63171f81219d6a1fc87b8f7/68747470733a2f2f63646e2e3774762e6170702f656d6f74652f30314a545452314a3448544b33355330384832373256435756332f34782e77656270'
			}
		},
		Support: {
			description: 'Support and help commands',
			icon: { type: 'emoji', value: '❓' }
		},
		Spotify: {
			description: 'Spotify integration commands',
			icon: { type: 'emoji', value: '🎵' }
		},
		Special: {
			description: 'Special feature commands',
			icon: { type: 'emoji', value: '⭐' }
		},
		'Data Commands': {
			description: 'User and channel data lookup',
			icon: {
				type: 'img',
				value:
					'https://camo.githubusercontent.com/9efbf571fac99d494bbc7b00ee15de42c10abf9f830c97deb4dcbc70d540b61f/68747470733a2f2f63646e2e6672616e6b6572666163657a2e636f6d2f656d6f74652f3231383533302f34'
			}
		},
		'Bot Staff': {
			description: 'Bot staff and admin commands',
			icon: {
				type: 'img',
				value:
					'https://camo.githubusercontent.com/d7c868da31b592fcffc11345805e3c6cf6f839f799b89cb29abf3f83e41016c3/68747470733a2f2f63646e2e3774762e6170702f656d6f74652f3633663238643737663239313562343432636138306434322f34782e77656270'
			}
		},
		Staff: {
			description: 'Bot staff and admin commands',
			icon: {
				type: 'img',
				value:
					'https://camo.githubusercontent.com/d7c868da31b592fcffc11345805e3c6cf6f839f799b89cb29abf3f83e41016c3/68747470733a2f2f63646e2e3774762e6170702f656d6f74652f3633663238643737663239313562343432636138306434322f34782e77656270'
			}
		}
	};

	const UNCATEGORIZED_NAME = 'General';

	function transformCommands(raw: Command[]): CommandCategory[] {
		const map = new Map<string, CommandCategory>();

		for (const cmd of raw) {
			const catName = cmd.category?.trim() || UNCATEGORIZED_NAME;
			if (!map.has(catName)) {
				const meta = categoryMeta[catName];
				map.set(catName, {
					name: catName,
					description: meta?.description ?? '',
					commands: []
				});
			}
			const descArr = Array.isArray(cmd.description) ? cmd.description : [cmd.description];
			const descStr = descArr.filter(Boolean).join(' ') || '—';
			const usageStr = cmd.usage || `!${cmd.name}`;
			map.get(catName)!.commands.push({
				name: cmd.name,
				description: descStr,
				usage: usageStr
			});
		}

		const knownOrder = [
			'Turtles',
			'Economy',
			'7TV',
			'Spotify',
			'Broadcaster',
			'Moderation',
			'Special',
			'General',
			'Staff',
			'Bot Staff',
			'Data Commands',
			'Support'
		];
		return [...map.entries()]
			.sort(([a], [b]) => {
				const ai = knownOrder.indexOf(a);
				const bi = knownOrder.indexOf(b);
				if (ai === -1 && bi === -1) return a.localeCompare(b);
				if (ai === -1) return 1;
				if (bi === -1) return -1;
				return ai - bi;
			})
			.map(([, v]) => v);
	}

	onMount(async () => {
		try {
			const res = await fetch(API_URL);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			const raw: Command[] = Array.isArray(data) ? data : (data.commands ?? []);
			commandCategories = transformCommands(raw);
		} catch (e: any) {
			error = e?.message ?? 'Failed to load commands';
		} finally {
			loading = false;
		}
	});

	function getIcon(name: string) {
		return (categoryMeta[name] ?? categoryMeta['Support'])?.icon;
	}

	$: activeCategory = commandCategories.find((c) => c.name === selectedCategory);

	$: filteredCommands =
		selectedCategory === 'All Commands'
			? search
				? commandCategories.flatMap((cat) =>
						cat.commands.filter(
							(cmd) =>
								cmd.name.toLowerCase().includes(search.toLowerCase()) ||
								cmd.description.toLowerCase().includes(search.toLowerCase())
						)
					)
				: null
			: (activeCategory?.commands ?? []).filter(
					(cmd) =>
						cmd.name.toLowerCase().includes(search.toLowerCase()) ||
						cmd.description.toLowerCase().includes(search.toLowerCase())
				);

	$: totalCount = commandCategories.reduce((sum, cat) => sum + cat.commands.length, 0);

	$: filteredCount =
		selectedCategory === 'All Commands'
			? search
				? ((filteredCommands as any[])?.length ?? 0)
				: totalCount
			: ((filteredCommands as any[])?.length ?? 0);
</script>

<div class="page">
	<div class="search-wrapper">
		<div class="search-row">
			<svg class="search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
				<circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.5" />
				<path d="M13 13l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
			</svg>
			<input
				type="text"
				placeholder="Search commands..."
				bind:value={search}
				autocomplete="off"
				spellcheck="false"
				disabled={loading}
			/>
			{#if search}
				<button class="clear" on:click={() => (search = '')} aria-label="Clear">✕</button>
			{/if}
		</div>
	</div>

	<div class="layout">
		<nav class="sidebar">
			<!-- All Commands button -->
			<button
				class="cat-btn"
				class:active={selectedCategory === 'All Commands'}
				on:click={() => {
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
					on:click={() => {
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
			{#if loading}
				<div class="state-msg">
					<span class="spinner"></span>
					<p>Loading commands…</p>
				</div>
			{:else if error}
				<div class="state-msg error">
					<span class="state-icon">⚠</span>
					<p>Could not load commands: <strong>{error}</strong></p>
					<button
						class="retry-btn"
						on:click={() => {
							loading = true;
							error = '';
							fetch(API_URL)
								.then((r) => (r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`)))
								.then((data) => {
									const raw: any[] = Array.isArray(data) ? data : (data.commands ?? []);
									commandCategories = transformCommands(raw);
								})
								.catch((e) => {
									error = String(e);
								})
								.finally(() => {
									loading = false;
								});
						}}>Retry</button
					>
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
						{filteredCount} command{filteredCount !== 1 ? 's' : ''}
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
									<div class="command" style="--j: {j}">
										<div class="cmd-top">
											<span class="hash">#</span>
											<span class="cmd-name">{command.name}</span>
										</div>
										<code class="cmd-usage">{command.usage}</code>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				{:else if (filteredCommands as any[])?.length === 0}
					<div class="empty">
						<span class="empty-icon">⊘</span>
						<p>No commands match "<strong>{search}</strong>"</p>
					</div>
				{:else}
					<div class="commands-grid">
						{#each filteredCommands as any[] as command, j}
							<div class="command" style="--j: {j}">
								<div class="cmd-top">
									<span class="hash">#</span>
									<span class="cmd-name">{command.name}</span>
								</div>
								<code class="cmd-usage">{command.usage}</code>
							</div>
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
		min-height: 100vh;
		background: #101010;
		color: #e0e0e0;
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
		transition:
			border-color 0.15s,
			background 0.15s;
		animation: cmdIn 0.2s ease both;
		animation-delay: calc(var(--j) * 15ms);

		&:hover {
			border-color: #33ca00;
			background: #1a1a1a;
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
	.cmd-usage {
		display: block;
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
			padding: 20px 16px 60px;
		}
		.sidebar {
			width: 100%;
			position: static;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 6px;
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
