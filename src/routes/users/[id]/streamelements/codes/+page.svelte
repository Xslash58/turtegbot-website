<script lang="ts">
	import { page } from '$app/state';
	import type { Loyalty } from '$lib/API/Models/StreamElements';
	import type { TurtleCode } from '$lib/API/Models/Turtles';
	import type { User } from '$lib/API/Models/Users';
	import { DeleteStreamElementsCode, GetStreamElementsCodes, GetStreamElementsLoyalty, PostStreamElementsCode, PutStreamElementsCode } from '$lib/API/StreamElements';
	import { profileUser } from '$lib/stores/userStore';
	import { Eye, EyeClosed, Trash } from 'phosphor-svelte';
	import { onMount } from 'svelte';

	let codes: TurtleCode[] = [];
	let userId: string = page.params.id + "";
	let user: User | null = $profileUser;
	let loyalty: Loyalty | null = null;
	let errorMessage: string = "";

	onMount(async () => {
		await fetchCodes();
		loyalty = await GetStreamElementsLoyalty(userId);
	});

	async function changeVisibility(codeId: string, isVisible: boolean) {
		let success = false;
		if (isVisible)
			success = await PutStreamElementsCode(userId, codeId, { codeName: `SE;${user?.twitchLogin.toLowerCase()};${loyalty?.loyalty.name};public` });
		else
			success = await PutStreamElementsCode(userId, codeId, { codeName: `SE;${user?.twitchLogin.toLowerCase()};${loyalty?.loyalty.name}` });

		if (success)
			fetchCodes();
	}

	async function deleteCode(codeId: string) {
		const success = await DeleteStreamElementsCode(userId, codeId);
		if (success)
			fetchCodes();
	}

	async function fetchCodes() {
		codes = await GetStreamElementsCodes(userId);
	}

	async function handleSubmit(event: Event) {
		errorMessage = "";

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const newCode: Partial<TurtleCode> = {
			code: formData.get('name') as string,
			turtles: Number(formData.get('points')),
			uses: Number(formData.get('uses')),
			codeName: `SE;${user?.twitchLogin.toLowerCase()};${loyalty?.loyalty.name}`,
		};

		let success = false;

		try {
			success = await PostStreamElementsCode(userId, newCode);
		} catch(err) {
			errorMessage = err instanceof Error ? err.message : String(err).replace("Error: ", "");
		}
		
		if (success) {
			fetchCodes();
			form.reset();
		}
		else if (errorMessage == "")
			errorMessage = "Failed to generate code";
	}

</script>

<section class="codes">
	<section class="code-creation">
		<form on:submit|preventDefault={handleSubmit}>
			<label>name: <input type="text" name="name" autocomplete="off" /></label>
			<label>points: <input type="number" name="points" /></label>
			<label>uses: <input type="number" name="uses" /></label>

			<button>Generate</button>
		</form>
		<small>{errorMessage}</small>
	</section>
	<section class="code-list">
		<h1>Codes List</h1>
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
				{#each codes as code}
					<tr>
						<td id="action-buttons">
						<button on:click={() => deleteCode(code.ID)}>
							<Trash size="16" weight="bold" fill="red" />
						</button>
						{#if code.codeName.split(';')[3] == 'public'}
							<button on:click={() => changeVisibility(code.ID, false)}>
								<Eye size="16" weight="bold" fill="lime" />
							</button>
						{:else}
							<button on:click={() => changeVisibility(code.ID, true)}>
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
			}

			button {
				background-color: #33ca00;
				color: white;
				padding: 0.5rem 1rem;
				border: none;
				border-radius: 5px;
				margin: 5px 0;
                width: 100%;
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

				th,
				td {
					text-align: center;
					padding: 0 0.5rem;
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
				}
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
