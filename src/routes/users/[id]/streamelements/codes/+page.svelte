<script lang="ts">
	import { page } from '$app/state';
	import type { Loyalty } from '$lib/API/Models/StreamElements';
	import type { TurtleCode } from '$lib/API/Models/Turtles';
	import type { User } from '$lib/API/Models/Users';
	import {
		DeleteStreamElementsCode,
		GetStreamElementsCodes,
		GetStreamElementsLoyalty,
		PostStreamElementsCode,
		PostStreamElementsCodesBulk,
		PutStreamElementsCode
	} from '$lib/API/StreamElements';
	import { profileUser } from '$lib/stores/userStore';
	import {
		ArrowsClockwise,
		Coins,
		Eye,
		EyeClosed,
		Gift,
		ListNumbers,
		Stack,
		Trash
	} from 'phosphor-svelte';
	import { onMount } from 'svelte';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import SearchBar from '$components/SearchBar.svelte';
	import Button from '$components/Button.svelte';
	import Input from '$components/Input.svelte';
	import Toggle from '$components/Toggle.svelte';

	let codes: (TurtleCode & { deleted?: boolean })[] = [];
	let userId: string = page.params.id + '';
	let user: User | null = $profileUser;
	let loyalty: Loyalty | null = null;
	let errorMessage: string = '';

	let searchPhrase = '';

	let isBulk: boolean = false;
	let isLoading: boolean = false;
	let isLoadingCodes: boolean = false;

	onMount(async () => {
		await fetchCodes();
		loyalty = await GetStreamElementsLoyalty(userId);
	});

	async function changeVisibility(codeId: string, isVisible: boolean) {
		let success = false;
		if (isVisible)
			success = await PutStreamElementsCode(userId, codeId, {
				codeName: `SE;${user?.twitchLogin.toLowerCase()};${loyalty?.loyalty.name};public`
			});
		else
			success = await PutStreamElementsCode(userId, codeId, {
				codeName: `SE;${user?.twitchLogin.toLowerCase()};${loyalty?.loyalty.name}`
			});

		if (success)
			codes = codes.map((c) =>
				c.ID === codeId
					? {
							...c,
							codeName: isVisible
								? `SE;${user?.twitchLogin.toLowerCase()};${loyalty?.loyalty.name};public`
								: `SE;${user?.twitchLogin.toLowerCase()};${loyalty?.loyalty.name}`
						}
					: c
			);
	}

	async function deleteCode(codeId: string) {
		const success = await DeleteStreamElementsCode(userId, codeId);
		if (success) codes = codes.map((c) => (c.ID === codeId ? { ...c, deleted: true } : c));
	}

	async function fetchCodes() {
		isLoadingCodes = true;
		codes = await GetStreamElementsCodes(userId);
		isLoadingCodes = false;
	}

	async function handleSubmit(event: Event) {
		isLoading = true;
		errorMessage = '';

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		let success = false;
		let amount = 1;

		const newCode: Partial<TurtleCode> = {
			code: (formData.get('name') as string) || '',
			turtles: Number(formData.get('points')),
			uses: Number(formData.get('uses')),
			codeName: `SE;${user?.twitchLogin.toLowerCase()};${loyalty?.loyalty.name}`
		};
		let bulkCodes: TurtleCode[] = [];

		if (isBulk) {
			const requestedAmount = Number(formData.get('mass-amount'));
			if (isNaN(requestedAmount) || requestedAmount < 1) {
				errorMessage = 'Invalid bulk amount';
				isLoading = false;
				return;
			}
			amount = requestedAmount;

			try {
				bulkCodes = await PostStreamElementsCodesBulk(userId, newCode, amount);
			} catch (err) {
				errorMessage = err instanceof Error ? err.message : String(err).replace('Error: ', '');
			}
			if (bulkCodes.length > 0) {
				success = true;
				const blob = new Blob([bulkCodes.map((c) => c.code).join('\n')], { type: 'text/plain' });
				const url = URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = 'generated_codes.txt';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);
			}
		} else {
			try {
				success = await PostStreamElementsCode(userId, newCode);
			} catch (err) {
				errorMessage = err instanceof Error ? err.message : String(err).replace('Error: ', '');
			}
		}
		if (success) {
			form.reset();
			fetchCodes();
		} else if (errorMessage == '') errorMessage = 'Failed to generate codes';

		isLoading = false;
	}
</script>

<section class="codes">
	<section class="code-creation">
		<form on:submit|preventDefault={handleSubmit}>
			<label>
				Code:
				<Input
					type="text"
					name="name"
					autocomplete="off"
					placeholder="Empty for random..."
					disabled={isBulk}
				>
					{#snippet icon()}
						<Gift weight="bold" />
					{/snippet}
				</Input>
			</label>
			<label>
				Points:
				<Input type="number" name="points" placeholder="Economy amount to grant">
					{#snippet icon()}
						<Coins weight="bold" />
					{/snippet}
				</Input>
			</label>
			<label>
				Uses:
				<Input type="number" name="uses" placeholder="Max uses for this code">
					{#snippet icon()}
						<ListNumbers weight="bold" />
					{/snippet}
				</Input>
			</label>
			<label for="mass-generate">
				Mass Generate:
				<Toggle name="mass-generate" id="mass-generate" bind:checked={isBulk} />
			</label>
			{#if isBulk}
				<label>
					Bulk:
					<Input type="number" name="mass-amount" placeholder="Amount to generate..." value="1">
						{#snippet icon()}
							<Stack weight="bold" />
						{/snippet}
					</Input>
				</label>
			{/if}

			<hr />

			<Button
				style="min-width: 100%; {isLoading && 'padding: 2px;'}"
				type="submit"
				disabled={isLoading}
				center
			>
				{#if isLoading}
					<LoadingIndicator size={24} />
				{:else}
					Generate
				{/if}
			</Button>
		</form>
		<small>{errorMessage}</small>
	</section>
	<section class="code-list">
		<h1>Codes List</h1>
		<nav>
			<SearchBar
				bind:searchTerm={searchPhrase}
				placeholder="Search codes..."
				isLoading={isLoadingCodes}
			/>
			<button on:click={() => fetchCodes()} disabled={isLoadingCodes}
				><ArrowsClockwise color="white" weight="bold" size={16} /></button
			>
		</nav>
		<table>
			<thead>
				<tr>
					<th></th>
					<th>ID</th>
					<th>Code</th>
					<th>Points</th>
					<th>Uses</th>
				</tr>
			</thead>
			<tbody>
				{#each codes.filter((x) => x.code
						.toLowerCase()
						.includes(searchPhrase.toLowerCase())) as code, i (i)}
					<tr class:deleted={code.deleted}>
						<td id="action-buttons">
							<button on:click={() => deleteCode(code.ID)} disabled={code.deleted}>
								<Trash size="16" weight="bold" fill="red" />
							</button>
							{#if code.codeName.split(';')[3] == 'public'}
								<button on:click={() => changeVisibility(code.ID, false)} disabled={code.deleted}>
									<Eye size="16" weight="bold" fill="lime" />
								</button>
							{:else}
								<button on:click={() => changeVisibility(code.ID, true)} disabled={code.deleted}>
									<EyeClosed size="16" weight="bold" fill="lime" />
								</button>
							{/if}
						</td>
						<td>{code.ID}</td>
						<td>{code.code}</td>
						<td>{code.turtles}</td>
						<td>{code.uses}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</section>

<style lang="scss">
	section.codes {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 100%;

		section.code-list,
		section.code-creation {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			background-color: rgba($color: #000000, $alpha: 0.5);
			padding: 10px;
			border-radius: 10px;
			width: 100%;
			margin-bottom: 10px;
		}

		section.code-creation {
			label {
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: 5px;
				width: 100%;
			}
			label[for='mass-generate'] {
				justify-content: left;
			}
			small {
				text-align: center;
			}

			hr {
				border: 1px solid #333;
			}
		}

		section.code-list {
			h1 {
				margin: 0.25rem;
				font-size: 1.25rem;
			}

			table {
				width: auto;
				border-collapse: collapse;

				th,
				td {
					text-align: center;
					padding: 0 0.5rem;
				}

				tr {
					&.deleted {
						opacity: 0.5;

						td:not(#action-buttons) {
							text-decoration: line-through;
						}
					}

					&:nth-child(even) {
						background-color: rgba($color: #ffffff, $alpha: 0.1);
					}
				}
			}
			button {
				background-color: transparent;
				border: none;
				cursor: pointer;
				padding: 0 4px;

				&:hover {
					transform: scale(1.15);
					transition: transform 0.1s;
				}

				&:disabled {
					cursor: not-allowed;
					opacity: 0.5;
					&:hover {
						transform: none;
						transition: none;
					}
				}
			}
			nav {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				gap: 5px;
			}
		}
	}
	@media (max-width: 768px) {
		td#action-buttons {
			display: flex;
			flex-direction: column-reverse;
			button {
				padding: 8px 0rem;
				transform: scale(1.25);
			}
		}
	}
</style>
