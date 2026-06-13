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
	import { ArrowsClockwise, Eye, EyeClosed, Trash } from 'phosphor-svelte';
	import { onMount } from 'svelte';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import SearchBar from '$components/SearchBar.svelte';

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
			<label
				>code: <input
					type="text"
					name="name"
					autocomplete="off"
					placeholder="Empty for random..."
					disabled={isBulk}
				/></label
			>
			<label>points: <input type="number" name="points" /></label>
			<label>uses: <input type="number" name="uses" /></label>
			<label for="mass-generate"
				><input type="checkbox" name="mass-generate" id="mass-generate" bind:checked={isBulk} />Mass
				Generate</label
			>
			{#if isBulk}
				<label
					>bulk: <input
						type="number"
						name="mass-amount"
						placeholder="Amount to generate..."
						value="1"
					/></label
				>
			{/if}

			{#if !isLoading}
				<button>Generate</button>
			{:else}
				<button disabled style="padding: 2px"> <LoadingIndicator size={24} /> </button>
			{/if}
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
						.includes(searchPhrase.toLowerCase())) as code}
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
			input {
				width: 75%;
				background-color: #303030;
				color: white;
				text-align: center;
				border: none;
				margin: 2px 2px;
				border-radius: 5px;

				&:disabled {
					background-color: #202020;
					cursor: not-allowed;
				}
			}
			input[type='checkbox'] {
				width: auto;
			}
			label[for='mass-generate'] {
				justify-content: left;
			}

			button {
				background-color: #33ca00;
				color: white;
				padding: 0.5rem 1rem;
				border: none;
				border-radius: 5px;
				margin: 5px 0;
				width: 100%;

				&:disabled {
					background-color: #202020;
					cursor: not-allowed;
				}
			}
			small {
				text-align: center;
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
