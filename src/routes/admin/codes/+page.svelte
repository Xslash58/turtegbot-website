<script lang="ts">
	import { DeleteCode, GetCodes, PostCode } from '$lib/API/Admin';
	import type { TurtleCode } from '$lib/API/Models/Turtles';
	import { Eye, EyeClosed, Trash } from 'phosphor-svelte';
	import { onMount } from 'svelte';

	let codes: TurtleCode[] = [];
	let errorMessage: string = '';

    let showStreamElements: boolean = false;

	onMount(async () => {
		await fetchCodes();
	});

	async function changeVisibility(codeId: string, isVisible: boolean) {
        let success = false;
		if (success) fetchCodes();
	}

	async function deleteCode(codeId: string) {
		const success = await DeleteCode(codeId);
		if (success)
			fetchCodes();
	}

	async function fetchCodes() {
		codes = await GetCodes();
        
		codes = codes
			.filter(code => showStreamElements || code.codeName.split(';')[0] !== 'SE')
			.map(code => code);
	}

	async function handleSubmit(event: Event) {
		errorMessage = '';

        event.preventDefault();

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const newCode: Partial<TurtleCode> = {
			code: formData.get('code') as string,
			turtles: Number(formData.get('points')),
			uses: Number(formData.get('uses')),
			tip: formData.get('tip') as string, 
			codeName: formData.get('name') as string
		};

        if(newCode.tip == "") delete newCode.tip;
        if(newCode.codeName == "") delete newCode.codeName;

		let success = false;

		try {
			success = await PostCode(newCode);
		} catch (err) {
			errorMessage = err instanceof Error ? err.message : String(err).replace('Error: ', '');
		}

		if (success) {
			fetchCodes();
			form.reset();
		} else if (errorMessage == '') errorMessage = 'Failed to generate code';
	}
</script>

<section class="codes">
	<section class="code-creation">
		<form onsubmit={handleSubmit}>
			<label>code: <input type="text" name="code" autocomplete="off" /></label>
			<label>turtles: <input type="number" name="points" /></label>
			<label>uses: <input type="number" name="uses" /></label>
			<label>tip: <textarea name="tip"></textarea></label>
			<label>name: <input type="text" name="name" autocomplete="off" /></label>

			<button>Generate</button>
		</form>
		<small>{errorMessage}</small>
	</section>
	<section class="code-list">
		<h1>Codes List</h1>
        <label>Show StreamElements: <input type="checkbox" bind:checked={showStreamElements} onchange={() => fetchCodes()} /></label>
		<table>
			<thead>
				<tr>
					<th></th>
					<th>ID</th>
					<th>Code</th>
					<th>Turtles</th>
					<th>Uses</th>
					<th class="tip">Tip</th>
					<th class="codeName">Name</th>
				</tr>
			</thead>
			<tbody>
				{#each codes as code}
					<tr>
						<td id="action-buttons">
							<button onclick={() => deleteCode(code.ID)}>
								<Trash size="16" weight="bold" fill="red" />
							</button>
							{#if code.codeName.split(';')[0] == 'SE'}
								{#if code.codeName.split(';')[3] == 'public'}
									<button onclick={() => changeVisibility(code.ID, false)}>
										<Eye size="16" weight="bold" fill="lime" />
									</button>
								{:else}
									<button onclick={() => changeVisibility(code.ID, true)}>
										<EyeClosed size="16" weight="bold" fill="lime" />
									</button>
								{/if}
							{/if}
						</td>
						<td>{code.ID}</td>
						<td>{code.code}</td>
						<td>{code.turtles}</td>
						<td>{code.uses}</td>
						<td class="tip">{code.tip}</td>
						<td class="codeName">{code.codeName}</td>
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
	@media (max-width: 900px) {
		td#action-buttons {
			display: flex;
			flex-direction: column-reverse;
			button {
				padding: 8px 0rem;
				transform: scale(1.25);
			}
		}
        th, td {
            &.tip, &.codeName {
                display: none;
            }
        }
	}
</style>
