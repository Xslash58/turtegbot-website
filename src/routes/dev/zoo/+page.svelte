<script lang="ts">
	import Button from '$components/Button.svelte';
	import EntitlementDialog from '$components/entitlements/EntitlementDialog.svelte';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import Radio from '$components/Radio.svelte';
	import SearchBar from '$components/SearchBar.svelte';
	import Select from '$components/Select.svelte';
	import Toggle from '$components/Toggle.svelte';
	import UserComponent from '$components/users/UserComponent.svelte';
	import UserSearch from '$components/users/UserSearch.svelte';
	import type { SearchUser } from '$lib/API/Models/Users';
	import { confirmationDialog, feedbackDialog, loginModalVisible } from '$lib/stores/modalStore';
	import { User } from 'phosphor-svelte';

	let isButtonActive = $state(true);
	let selectedOption = $state('');
	let selectedRadio = $state('2');
	let selectedUser: SearchUser | null = $state(null);
	let entitilementDialog: EntitlementDialog | null = $state(null);
	let confirmationDialogAccepted: boolean = $state(false);
</script>

{#if selectedUser}
	<EntitlementDialog bind:this={entitilementDialog} user={selectedUser.profile} mode="user" />
{/if}
<section class="zoo">
	<!-- Buttons -->
	<section class="panel">
		<h1>Buttons</h1>
		<Button></Button>
		<Button>Just Text</Button>
		<Button>
			{#snippet icon()}
				<User weight="regular" />
			{/snippet}
		</Button>
		<Button>
			{#snippet icon()}
				<User weight="regular" />
			{/snippet}
			Icon Button
		</Button>

		<Button active={isButtonActive} onclick={() => (isButtonActive = !isButtonActive)}>
			{#snippet icon({ active })}
				<User weight={active ? 'fill' : 'regular'} />
			{/snippet}
			Active Button Icon
		</Button>
		<Button active={isButtonActive} onclick={() => (isButtonActive = !isButtonActive)}>
			Active Button
		</Button>
	</section>

	<!-- Buttons Dark -->
	<section class="panel">
		<h1>Buttons (Dark)</h1>
		<Button variant="dark"></Button>
		<Button variant="dark">Just Text</Button>
		<Button variant="dark">
			{#snippet icon()}
				<User weight="regular" />
			{/snippet}
		</Button>
		<Button variant="dark">
			{#snippet icon()}
				<User weight="regular" />
			{/snippet}
			Icon Button
		</Button>

		<Button
			variant="dark"
			active={isButtonActive}
			onclick={() => (isButtonActive = !isButtonActive)}
		>
			{#snippet icon({ active })}
				<User weight={active ? 'fill' : 'regular'} />
			{/snippet}
			Active Button Icon
		</Button>
		<Button
			variant="dark"
			active={isButtonActive}
			onclick={() => (isButtonActive = !isButtonActive)}
		>
			Active Button
		</Button>
	</section>

	<!-- Buttons Danger -->
	<section class="panel">
		<h1>Buttons (Danger)</h1>
		<Button variant="danger"></Button>
		<Button variant="danger">Just Text</Button>
		<Button variant="danger">
			{#snippet icon()}
				<User weight="regular" />
			{/snippet}
		</Button>
		<Button variant="danger">
			{#snippet icon()}
				<User weight="regular" />
			{/snippet}
			Icon Button
		</Button>

		<Button
			variant="danger"
			active={isButtonActive}
			onclick={() => (isButtonActive = !isButtonActive)}
		>
			{#snippet icon({ active })}
				<User weight={active ? 'fill' : 'regular'} />
			{/snippet}
			Active Button Icon
		</Button>
		<Button
			variant="danger"
			active={isButtonActive}
			onclick={() => (isButtonActive = !isButtonActive)}
		>
			Active Button
		</Button>
	</section>

	<!-- Buttons Warning -->
	<section class="panel">
		<h1>Buttons (Warning)</h1>
		<Button variant="warning"></Button>
		<Button variant="warning">Just Text</Button>
		<Button variant="warning">
			{#snippet icon()}
				<User weight="regular" />
			{/snippet}
		</Button>
		<Button variant="warning">
			{#snippet icon()}
				<User weight="regular" />
			{/snippet}
			Icon Button
		</Button>

		<Button
			variant="warning"
			active={isButtonActive}
			onclick={() => (isButtonActive = !isButtonActive)}
		>
			{#snippet icon({ active })}
				<User weight={active ? 'fill' : 'regular'} />
			{/snippet}
			Active Button Icon
		</Button>
		<Button
			variant="warning"
			active={isButtonActive}
			onclick={() => (isButtonActive = !isButtonActive)}
		>
			Active Button
		</Button>
	</section>

	<!-- Buttons Transparent -->
	<section class="panel">
		<h1>Buttons (Transparent)</h1>
		<Button variant="transparent"></Button>
		<Button variant="transparent">Just Text</Button>
		<Button variant="transparent">
			{#snippet icon()}
				<User weight="regular" />
			{/snippet}
		</Button>
		<Button variant="transparent">
			{#snippet icon()}
				<User weight="regular" />
			{/snippet}
			Icon Button
		</Button>

		<Button
			variant="transparent"
			active={isButtonActive}
			onclick={() => (isButtonActive = !isButtonActive)}
		>
			{#snippet icon({ active })}
				<User weight={active ? 'fill' : 'regular'} />
			{/snippet}
			Active Button Icon
		</Button>
		<Button
			variant="transparent"
			active={isButtonActive}
			onclick={() => (isButtonActive = !isButtonActive)}
		>
			Active Button
		</Button>
	</section>

	<!-- Select -->
	<section class="panel">
		<h1>Select</h1>
		<p>Selected: {selectedOption}</p>
		<Select
			options={[
				{ label: 'Option 1', value: '1' },
				{ label: 'Option 2', value: '2' },
				{ label: 'Option 3', value: '3' }
			]}
			bind:value={selectedOption}
			placeholder="Select test value..."
			searchPlaceholder="Search test values..."
		/>
		<Select
			options={[
				{ label: 'Option 1', value: '1' },
				{ label: 'Option 2', value: '2' },
				{ label: 'Option 3', value: '3' }
			]}
			bind:value={selectedOption}
		/>
		<Select options={[]} />
	</section>

	<section class="panel">
		<h1>Search</h1>

		<SearchBar />
		<SearchBar isLoading={true} />
		<SearchBar placeholder="Custom placeholder..." />
		<SearchBar searchTerm="Prefilled search term" />
	</section>

	<section class="panel">
		<h1>User Search</h1>
		<p>Selected user: {selectedUser?.profile.display_name || 'None'}</p>
		<UserSearch onSelect={(user) => (selectedUser = user)} />
		<UserSearch onSelect={(user) => (selectedUser = user)} selectionMode />
		<UserSearch searchTerm="Xsla" onSelect={(user) => (selectedUser = user)} />
	</section>

	<section class="panel">
		<h1>Loading Indicator</h1>
		<p>128:</p>
		<LoadingIndicator size={128} />
		<p>Default:</p>
		<LoadingIndicator />
		<p>24:</p>
		<LoadingIndicator size={24} />
		<p>12:</p>
		<LoadingIndicator size={12} />
	</section>

	<section class="panel">
		<h1>Toggle</h1>
		<Toggle>Default Toggle</Toggle>
		<Toggle disabled>Disabled Toggle</Toggle>
		<Toggle checked>Checked Toggle</Toggle>
		<Toggle></Toggle>
	</section>

	<section class="panel">
		<h1>Radio</h1>
		<p>Selected: {selectedRadio}</p>
		<Radio
			options={[
				{ label: 'Option 1', value: '1' },
				{ label: 'Option 2', value: '2' },
				{ label: 'Option 3', value: '3' },
				{ label: 'Disabled option', value: 'disabled', disabled: true },
				{ label: '', value: '4' }
			]}
			bind:value={selectedRadio}
		/>
		<Radio
			options={[
				{ label: 'Option 1', value: '1' },
				{ label: 'Option 2', value: '2' },
				{ label: 'Option 3', value: '3' },
				{ label: 'Disabled option', value: 'disabled', disabled: true },
				{ label: '', value: '4' }
			]}
			name="example-radio-2"
			bind:value={selectedRadio}
		>
			Choose example option
		</Radio>
	</section>

	<section class="panel">
		<h1>Dialogs</h1>
		<p>Select a user to test the entitlement dialog:</p>
		<UserSearch
			searchTerm="Xslash58"
			onSelect={(user) => {
				selectedUser = user;
			}}
			selectionMode
		/>
		<Button
			onclick={() => {
				entitilementDialog?.toggleVisibility();
			}}
			disabled={!selectedUser}>Entitlement Dialog</Button
		>
		<p>Confirmation dialog accepted: {confirmationDialogAccepted}</p>
		<Button
			onclick={() => {
				confirmationDialog.set({
					text: 'Are you sure you want to example text?',
					visible: true,
					onConfirm: () => {
						confirmationDialogAccepted = true;
					}
				});
			}}>Confirmation Dialog</Button
		>
		<Button
			onclick={() => {
				feedbackDialog.set({
					title: 'Example Title',
					content: 'This is an example feedback message.',
					visible: true
				});
			}}>Feedback Dialog</Button
		>
		<Button
			onclick={() => {
				loginModalVisible.set(true);
			}}>Login Dialog</Button
		>
	</section>

	<section class="panel">
		<h1>User Component</h1>
		<UserComponent userId={1} username="Xslash58" />
		<UserComponent
			userId={selectedUser?.ID || 0}
			username={selectedUser?.profile.display_name || 'Unknown'}
		/>
	</section>
</section>

<style lang="scss">
	section.zoo {
		display: flex;
		flex-wrap: wrap;
		section.panel {
			> h1 {
				font-size: 24px;
				margin: 0;
				text-align: center;
				width: 100%;
			}
			p {
				margin: 0;
			}
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 5px;

			padding: 10px;
		}
	}
</style>
