<!--
	Input.svelte from Fiszh/UChat: https://github.com/Fiszh/UChat/blob/d78d81c9b97e93b20b6b872fab94063470b3ab39/app/src/components/Inputs/Input.svelte
	Modified by Xslash58 for Turtegbot Website
-->

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type {
		HTMLInputAttributes,
		HTMLAnchorAttributes,
		HTMLLabelAttributes
	} from 'svelte/elements';

	import { fade } from 'svelte/transition';

	type Props = {
		icon?: Snippet;
		iconRight?: Snippet;
		children?: Snippet;
		value?: string | number;
		disabled?: boolean;
		wide?: boolean;
		readonly?: boolean;
		onChange?: (e: Event) => void;
		onPaste?: (e: ClipboardEvent) => void;
	} & HTMLInputAttributes &
		HTMLAnchorAttributes &
		HTMLLabelAttributes;

	let {
		icon,
		iconRight,
		value = $bindable(''),
		disabled = false,
		wide = false,
		readonly = false,
		onChange,
		onPaste,
		...restProps
	}: Props = $props();

	const clear = () => {
		value = '';
	};
</script>

<label class:disabled class:wide class:readonly>
	<span id="leftIcon">
		{@render icon?.()}
	</span>
	<input
		bind:value
		{disabled}
		{readonly}
		oninput={onChange}
		onpaste={onPaste}
		{...restProps}
		placeholder={disabled ? 'Disabled' : restProps.placeholder}
	/>
	{#if !disabled}
		<span id="rightIcon" transition:fade>
			{#if iconRight}
				{@render iconRight()}
			{/if}
		</span>
	{/if}
</label>

<style lang="scss">
	label {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;

		background-color: #101010;

		border-radius: 4px;
		padding: 5px 10px;
		border: 1px solid #0c0c0c;

		cursor: text;

		&:disabled {
			background-color: #151515;
			cursor: not-allowed;
		}

		&.wide {
			width: 100%;
		}

		input {
			width: 100%;
		}

		&:not(.readonly) {
			&:hover {
				background-color: #0f0f0f;
			}

			&:focus-within {
				border: 1px solid #33ca00;
			}
		}

		span {
			background-color: transparent;
			border: none;
			color: currentColor;
			cursor: pointer;
			padding: 0rem;
			display: inline-flex;
		}

		span {
			max-height: 1rem;
			aspect-ratio: 1;
			cursor: unset;
		}

		input {
			background-color: transparent;
			border: none;
			color: currentColor;

			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

			cursor: inherit;

			&:focus {
				outline: none;
			}
		}
	}
</style>
