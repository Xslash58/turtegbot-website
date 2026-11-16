<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'class' | 'checked' | 'onchange'> {
		checked?: boolean;
		class?: string;
		children?: Snippet;
		onchange?: (event: Event) => void;
	}

	let {
		checked = $bindable(false),
		class: className = '',
		children,
		disabled = false,
		onchange,
		...restProps
	}: Props = $props();
</script>

<label class="toggle {className}" class:disabled>
	<input type="checkbox" bind:checked {disabled} {onchange} {...restProps} />
	<span class="track" aria-hidden="true">
		<span class="thumb"></span>
	</span>
	{#if children}
		<span class="label">{@render children()}</span>
	{/if}
</label>

<style lang="scss">
	.toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: white;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		user-select: none;

		input {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip: rect(0 0 0 0);
			white-space: nowrap;
		}

		.track {
			position: relative;
			display: inline-flex;
			align-items: center;
			width: 2.25rem;
			height: 1.25rem;
			padding: 2px;
			box-sizing: border-box;
			border: 1px solid #444;
			border-radius: 999px;
			background-color: #0c0c0c;
			transition:
				background-color 0.15s ease,
				border-color 0.15s ease;
		}

		.thumb {
			width: 0.875rem;
			height: 0.875rem;
			border-radius: 50%;
			background-color: #888;
			transition:
				transform 0.15s ease,
				background-color 0.15s ease;
		}

		input:checked + .track {
			border-color: #168000;
			background-color: #1d9900;

			.thumb {
				background-color: #ffffff;
				transform: translateX(1rem);
			}
		}

		input:focus-visible + .track {
			outline: 1px solid #888;
			outline-offset: 2px;
		}

		&.disabled {
			cursor: not-allowed;
			opacity: 0.6;
		}

		&:has(input:disabled) {
			pointer-events: none;
		}
	}
</style>
