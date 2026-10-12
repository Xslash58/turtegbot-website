<script lang="ts">
	import { CaretDown } from 'phosphor-svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	export interface SelectOption {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props extends Omit<HTMLSelectAttributes, 'class' | 'value' | 'onchange'> {
		options: SelectOption[];
		value?: string;
		placeholder?: string;
		searchPlaceholder?: string;
		class?: string;
		onchange?: (event: Event) => void;
	}

	let {
		options,
		value = $bindable<string>(''),
		placeholder = 'Select an option...',
		searchPlaceholder = 'Search...',
		class: className = '',
		onchange,
		disabled = false,
		...restProps
	}: Props = $props();

	let searchTerm = $state('');
	let isOpen = $state(false);
	let selectElement: HTMLSelectElement;

	let selectedOption = $derived(options.find((option) => option.value === value));
	let filteredOptions = $derived(
		options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	function selectOption(option: SelectOption) {
		if (option.disabled || disabled) return;

		value = option.value;
		searchTerm = '';
		isOpen = false;
		selectElement.value = option.value;
		selectElement.dispatchEvent(new Event('change', { bubbles: true }));
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isOpen = false;
		} else if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			isOpen = true;
		}
	}
</script>

<section class="select-wrapper {className}">
	<select
		bind:this={selectElement}
		{value}
		{disabled}
		class="native-select"
		{...restProps}
		{onchange}
	>
		{#each options as option}
			<option value={option.value} disabled={option.disabled}>{option.label}</option>
		{/each}
	</select>

	<button
		type="button"
		class="select-trigger"
		class:open={isOpen}
		{disabled}
		aria-haspopup="listbox"
		aria-expanded={isOpen}
		onclick={() => (isOpen = !isOpen)}
		onkeydown={handleKeydown}
	>
		<span class:placeholder={!selectedOption}>
			{selectedOption?.label ?? placeholder}
		</span>
		<span class="arrow" aria-hidden="true"><CaretDown weight="regular" /></span>
	</button>

	{#if isOpen}
		<section class="dropdown">
			<!-- svelte-ignore a11y_autofocus -->
			<input
				class="search-input"
				type="search"
				placeholder={searchPlaceholder}
				aria-label={searchPlaceholder}
				bind:value={searchTerm}
				autofocus
			/>
			<ul role="listbox">
				{#each filteredOptions as option}
					<li>
						<button
							type="button"
							role="option"
							aria-selected={option.value === value}
							disabled={option.disabled}
							onclick={() => selectOption(option)}
						>
							{option.label}
						</button>
					</li>
				{:else}
					<li class="no-results">No results found.</li>
				{/each}
			</ul>
		</section>
	{/if}
</section>

<style lang="scss">
	.select-wrapper {
		position: relative;
		display: inline-block;
		min-width: 200px;
		color: white;
	}

	.native-select {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
		pointer-events: none;
	}

	.select-trigger,
	.search-input {
		box-sizing: border-box;
		width: 100%;
		border: none;
		border-radius: 4px;
		background: #0c0c0c;
		color: white;
		font: inherit;
	}

	.select-trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 5px 10px;
		cursor: pointer;
		text-align: left;

		&:focus {
			outline: 1px solid #888;
			outline-offset: 1px;
		}

		&.open {
			border-radius: 4px 4px 0 0;
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.6;
		}
	}

	.placeholder {
		color: #888;
	}

	.arrow {
		font-size: 0.8rem;
	}

	.dropdown {
		position: absolute;
		z-index: 10;
		top: 100%;
		left: 0;
		width: 100%;
		padding: 5px;
		box-sizing: border-box;
		border-radius: 0 0 4px 4px;
		background: #0c0c0c;
		box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
	}

	.search-input {
		padding: 5px;
		outline: none;

		&::placeholder {
			color: #888;
		}
	}

	ul {
		max-height: 200px;
		margin: 5px 0 0;
		padding: 0;
		overflow-y: auto;
		list-style: none;
	}

	li button {
		width: 100%;
		padding: 7px 5px;
		border: none;
		background: transparent;
		color: white;
		cursor: pointer;
		text-align: left;

		&:hover,
		&[aria-selected='true'] {
			background: #222;
		}

		&:disabled {
			cursor: not-allowed;
			opacity: 0.5;
		}
	}

	.no-results {
		padding: 7px 5px;
		color: #888;
	}
</style>
