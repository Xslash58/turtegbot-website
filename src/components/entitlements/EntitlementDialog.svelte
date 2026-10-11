<script lang="ts">
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import {
		GetEntitlementGraph,
		GetEntitlementsCatalog,
		GrantEntitlement,
		RevokeEntitlement
	} from '$lib/API/Entitlements';
	import type { Entitlement, EntitlementGraphResponse } from '$lib/API/Models/Entitlements';
	import type { User } from '$lib/API/Models/Users';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import EntitlementGraph from './EntitlementGraph.svelte';
	import Button from '$components/Button.svelte';
	import { Minus, Plus } from 'phosphor-svelte';
	import { can } from '$lib/stores/permissions';

	let entitlementsCatalog: Entitlement[] = $state([]);
	let entitlementKinds: string[] = $state([]);

	let availableEntitlementOptions: Entitlement[] = $state([]);
	let selectedEntitlementId: string | null = $state(null);

	let isVisible: boolean = $state(false);
	let isLoading: boolean = $state(false);

	let graphData: EntitlementGraphResponse | null = $state(null);

	const {
		user
	}: {
		user: User;
		onDelete?: (id: number) => void;
	} = $props();

	onMount(async () => {
		console.log('EntitlementDialog component mounted');

		entitlementsCatalog = await GetEntitlementsCatalog();
		entitlementKinds = [...new Set(entitlementsCatalog.map((e) => e.kind))];
		await refreshGraph();
	});

	async function refreshGraph() {
		graphData = null;
		graphData = await GetEntitlementGraph(user.id + '');
	}

	function handleKindClick(event: Event) {
		const target = event.target as HTMLInputElement;
		const selectedKind = target.value;
		console.log('Selected entitlement kind:', selectedKind);

		availableEntitlementOptions = entitlementsCatalog.filter((e) => e.kind === selectedKind);
	}

	async function addEntitlement() {
		if (selectedEntitlementId) {
			isLoading = true;
			await GrantEntitlement(user.id, selectedEntitlementId);
			await refreshGraph();
			isLoading = false;
		}
	}

	async function removeEntitlement() {
		if (selectedEntitlementId) {
			isLoading = true;
			await RevokeEntitlement(user.id, selectedEntitlementId);
			await refreshGraph();
			isLoading = false;
		}
	}

	export function toggleVisibility() {
		isVisible = !isVisible;
	}
</script>

{#if isVisible}
	<section class="dialog-entitlement">
		<button onclick={() => toggleVisibility()} class="background" aria-label="Close dialog"
		></button>
		<dialog class="dialog" transition:fade={{ duration: 200 }} open>
			<h2>Manage Entitlements for {user.display_name} ({user.id})</h2>
			<hr />
			<section class="radios">
				{#each entitlementKinds as kind}
					<label
						><input
							type="radio"
							name="entitleement-kind"
							id={kind}
							value={kind}
							onclick={handleKindClick}
						/>
						{kind}</label
					>
					<br />
				{/each}
			</section>
			{#if availableEntitlementOptions.length > 0}
				<select bind:value={selectedEntitlementId}>
					{#each availableEntitlementOptions as entitlement}
						<option value={entitlement.id}>{entitlement.name}</option>
					{/each}
				</select>
			{/if}
			<nav>
				{#if !isLoading}
					{#if $can('admin.entitlements.grant')}
						<Button
							disabled={selectedEntitlementId === null ||
								isLoading ||
								graphData?.links.some(
									(e) => e.source === `user:${user.id}` && e.target === selectedEntitlementId
								)}
							onclick={addEntitlement}
						>
							{#snippet icon()}
								<Plus weight="regular" />
							{/snippet}
							Add Entitlement
						</Button>
					{/if}
					{#if $can('admin.entitlements.revoke')}
						<Button
							disabled={selectedEntitlementId === null ||
								isLoading ||
								!graphData?.links.some(
									(e) => e.source === `user:${user.id}` && e.target === selectedEntitlementId
								)}
							onclick={removeEntitlement}
						>
							{#snippet icon()}
								<Minus weight="regular" />
							{/snippet}
							Remove Entitlement
						</Button>
					{/if}
				{:else}
					<LoadingIndicator size={12} />
				{/if}
			</nav>
			{#if graphData}
				<EntitlementGraph data={graphData} />
			{/if}
		</dialog>
	</section>
{/if}

<style lang="scss">
	section.dialog-entitlement {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;

		button.background {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.5);
			z-index: 1000;
			border: none;
		}

		dialog.dialog {
			position: fixed;
			top: 50%;
			transform: translateY(-50%);
			z-index: 1001;

			width: 75%;
			height: 75%;

			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			text-align: center;
			background-color: #0a0a0a;
			color: white;
			border: none;
			border-radius: 10px;

			padding: 10px;
			gap: 10px;

			.radios {
				text-align: left;
			}

			h2 {
				margin: 0;
				font-size: 1.5rem;
			}

			hr {
				border: none;
				border-top: 1px solid #333;
				width: 100%;
			}
		}
	}
</style>
