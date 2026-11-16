<script lang="ts">
	import Button from '$components/Button.svelte';
	import EntitlementDialog from '$components/entitlements/EntitlementDialog.svelte';
	import Input from '$components/Input.svelte';
	import Select from '$components/Select.svelte';
	import { CreateEntitlement, DeleteEntitlement, GetEntitlementsCatalog } from '$lib/API/Entitlements';
	import type { Entitlement, EntitlementKind } from '$lib/API/Models/Entitlements';
	import { confirmationDialog, feedbackDialog } from '$lib/stores/modalStore';
	import {
		Book,
		BookOpen,
		BracketsCurly,
		Hash,
		NumberOne,
		PencilSimple,
		Plus,
		Trash
	} from 'phosphor-svelte';
	import { onMount } from 'svelte';

	let entitlementDialog: EntitlementDialog | null = $state(null);

	let selectedEntitlementId: string | undefined = $state(undefined);
	let entitlementsCatalog: Entitlement[] = $state([]);
	let entitlementData: Entitlement | null = $state(null);
	let isCreateMode: boolean = $state(false);

	onMount(async () => {
		entitlementsCatalog = await GetEntitlementsCatalog();
	});

	async function changeEntitlement(entitlementId: string | undefined) {
		isCreateMode = false;
		selectedEntitlementId = entitlementId;
		entitlementData = entitlementId ? entitlementsCatalog.find((e) => e.id === entitlementId) || null : null;
		entitlementDialog?.refreshGraph();
	}

	function enterCreateMode() {
		isCreateMode = true;
		selectedEntitlementId = undefined;
	}

	async function handleCreateForm(e: any) {
		e.preventDefault();
		const formData = new FormData(e.target);
		const data = Object.fromEntries(formData);

		let newEntitlement: Entitlement;
		try {
			if ((data.metadata as string) == '') data.metadata = '{}';

			newEntitlement = {
				id: data.id as string,
				kind: data.kind as EntitlementKind,
				name: data.name as string,
				description: data.description as string,
				priority: parseInt(data.priority as string, 10),
				metadata: JSON.parse(data.metadata as string)
			};

			if (Number.isNaN(newEntitlement.priority)) newEntitlement.priority = 0;

			// ID validation
			if (newEntitlement.id.split(':').length !== 2)
				newEntitlement.id = `${newEntitlement.kind.toLowerCase()}:${newEntitlement.id}`;
			else newEntitlement.kind = newEntitlement.id.split(':')[0].toUpperCase() as EntitlementKind;
			newEntitlement.id = newEntitlement.id.toLowerCase();
		} catch (error) {
			feedbackDialog.set({
				title: 'Error',
				content: `Failed to parse entitlement metadata. Please check the format. Error: ${error}`,
				visible: true
			});
			return;
		}

		let success = false;

		try {
			success = await CreateEntitlement(
				newEntitlement.id,
				newEntitlement.kind,
				newEntitlement.name,
				newEntitlement.description,
				newEntitlement.priority ?? 0,
				newEntitlement.metadata ?? JSON.parse('{}')
			);
		} catch (error) {
			feedbackDialog.set({
				title: 'Error',
				content: `${error}`,
				visible: true
			});
			return;
		}

		if (success) {
			entitlementsCatalog = await GetEntitlementsCatalog();
			changeEntitlement(newEntitlement.id);
			feedbackDialog.set({
				title: 'Success',
				content: 'Entitlement created successfully.',
				visible: true
			});
		} else {
			feedbackDialog.set({
				title: 'Error',
				content: 'Failed to create entitlement. Please try again.',
				visible: true
			});
		}
	}

	async function deleteSelectedEntitlement(confirm: boolean = false) {
		if(!selectedEntitlementId) return;

		if(!confirm) {
			confirmationDialog.set({
				visible: true,
				text: `Are you sure you want to delete the entitlement "${selectedEntitlementId}"?
				This action is irreversible.`,
				onConfirm: async () => {
					await deleteSelectedEntitlement(true);
				}
			});
			return;
		}

		const success = await DeleteEntitlement(selectedEntitlementId);
		if (success) {
			entitlementsCatalog = await GetEntitlementsCatalog();
			changeEntitlement(undefined);
			feedbackDialog.set({
				title: 'Success',
				content: 'Entitlement deleted successfully.',
				visible: true
			});
		} else {
			feedbackDialog.set({
				title: 'Error',
				content: 'Failed to delete entitlement.',
				visible: true
			});
		}
	}
</script>

<EntitlementDialog
	bind:this={entitlementDialog}
	entitlementId={selectedEntitlementId}
	mode="entitlement"
/>

<section class="entitlements">
	<nav>
		<Select
			options={entitlementsCatalog.map((entitlement) => ({
				value: entitlement.id,
				label: entitlement.id
			}))}
			class="entitlement-select"
			onchange={async (event) =>
				await changeEntitlement((event.currentTarget as HTMLSelectElement).value)}
			name="entitlement"
			placeholder="Select an entitlement..."
			searchPlaceholder="Search entitlements..."
		/>
		<Button onclick={() => enterCreateMode()}>
			{#snippet icon()}
				<Plus weight="bold" />
			{/snippet}
			New
		</Button>
	</nav>
	{#if !selectedEntitlementId && !isCreateMode}
		<p>Please select an entitlement to edit.</p>
	{:else if isCreateMode}
		<form onsubmit={handleCreateForm}>
			<label
				>ID:
				<Input
					type="text"
					name="id"
					autocomplete="off"
					placeholder="Enter entitlement ID..."
					required
				>
					{#snippet icon()}
						<Hash weight="bold" />
					{/snippet}
				</Input>
			</label>
			<label
				>Kind:
				<Select
					options={[
						{ value: 'ROLE', label: 'Role' },
						{ value: 'PERMISSION', label: 'Permission' },
						{ value: 'BADGE', label: 'Badge' },
						{ value: 'BUNDLE', label: 'Bundle' }
					]}
					name="kind"
					placeholder="Select kind..."
					required
				/>
			</label>
			<label
				>Name:
				<Input
					type="text"
					name="name"
					autocomplete="off"
					placeholder="Enter entitlement name..."
					required
				>
					{#snippet icon()}
						<Book weight="bold" />
					{/snippet}
				</Input>
			</label>
			<label
				>Description:
				<Input
					type="text"
					name="description"
					autocomplete="off"
					placeholder="Enter description..."
					required
				>
					{#snippet icon()}
						<BookOpen weight="bold" />
					{/snippet}
				</Input>
			</label>
			<label
				>Priority:
				<Input type="number" name="priority" autocomplete="off" placeholder="Enter priority...">
					{#snippet icon()}
						<NumberOne weight="bold" />
					{/snippet}
				</Input>
			</label>
			<label
				>Metadata:
				<Input type="text" name="metadata" autocomplete="off" placeholder="Enter metadata...">
					{#snippet icon()}
						<BracketsCurly weight="bold" />
					{/snippet}
				</Input>
			</label>
			<Button type="submit">
				{#snippet icon()}
					<Plus weight="bold" />
				{/snippet}
				Create Entitlement
			</Button>
		</form>
	{:else}
		{#if entitlementData}
			<p>Name: {entitlementData.name}</p>
			<p>Description: {entitlementData.description}</p>
			<p>Kind: {entitlementData.kind}</p>
			<p>Priority: {entitlementData.priority}</p>
			<p>Metadata: <code>{entitlementData.metadata}</code></p>
		{/if}
		<section class="manage-panel">
			<Button onclick={() => entitlementDialog?.toggleVisibility()}>
				{#snippet icon()}
					<PencilSimple weight="bold" />
				{/snippet}
				Manage Entitlement
			</Button>
			<Button onclick={() => deleteSelectedEntitlement()}>
				{#snippet icon()}
					<Trash weight="bold" />
				{/snippet}
				Delete Entitlement
			</Button>
		</section>
	{/if}
</section>

<style lang="scss">
	.entitlements {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-height: 0;

		nav {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;

			:global(.entitlement-select) {
				width: 100%;
			}
		}

		p {
			margin: 0;
		}

		form {
			display: flex;
			flex-direction: column;
			width: 500px;
			label {
				display: flex;
				justify-content: space-between;
			}
		}
	}
</style>
