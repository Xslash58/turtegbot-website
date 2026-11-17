<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	export interface RadioOption {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props extends Omit<HTMLInputAttributes, 'class' | 'checked' | 'value' | 'onchange'> {
		options: RadioOption[];
		value?: string;
		class?: string;
		direction?: 'row' | 'column';
		children?: Snippet;
		onchange?: (event: Event) => void;
	}

	let {
		options,
		value = $bindable(''),
		class: className = '',
		direction = 'column',
		children,
		disabled = false,
		name = 'radio-group',
		onchange,
		...restProps
	}: Props = $props();

	function selectOption(option: RadioOption, event: Event) {
		if (disabled || option.disabled) return;
		value = option.value;
		onchange?.(event);
	}
</script>

<fieldset class="radio-group {className}" class:row={direction === 'row'} {disabled}>
	{#if children}
		<legend>{@render children()}</legend>
	{/if}
	{#each options as option}
		<label class:disabled={disabled || option.disabled}>
			<input
				type="radio"
				{name}
				value={option.value}
				checked={option.value === value}
				disabled={disabled || option.disabled}
				onchange={(event) => selectOption(option, event)}
				{...restProps}
			/>
			<span class="indicator" aria-hidden="true"></span>
			<span>{option.label}</span>
		</label>
	{/each}
</fieldset>

<style lang="scss">
	.radio-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		border: 0;
		color: white;
		font-size: 0.875rem;
		font-weight: 500;

		&.row {
			flex-direction: row;
			flex-wrap: wrap;
		}

		legend {
			padding: 0;
			margin-bottom: 0.125rem;
			font-weight: 600;
		}

		label {
			display: inline-flex;
			align-items: center;
			gap: 0.5rem;
			cursor: pointer;
			user-select: none;

			&.disabled {
				cursor: not-allowed;
				opacity: 0.6;
			}
		}

		input {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}

		.indicator {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 1rem;
			height: 1rem;
			box-sizing: border-box;
			border: 1px solid #444;
			border-radius: 50%;
			background-color: #0c0c0c;
			transition:
				background-color 0.15s ease,
				border-color 0.15s ease;

			&::after {
				width: 0.5rem;
				height: 0.5rem;
				border-radius: 50%;
				background-color: #ffffff;
				content: '';
				opacity: 0;
				transform: scale(0.5);
				transition:
					opacity 0.15s ease,
					transform 0.15s ease;
			}
		}

		input:checked + .indicator {
			border-color: #168000;
			background-color: #1d9900;

			&::after {
				opacity: 1;
				transform: scale(1);
			}
		}

		input:focus-visible + .indicator {
			outline: 1px solid #888;
			outline-offset: 2px;
		}
	}
</style>
