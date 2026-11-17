<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href?: string;
		active?: boolean;
		disabled?: boolean;
		center?: boolean;
		variant?: 'normal' | 'dark' | 'danger' | 'warning' | 'transparent';
		onclick?: (e: MouseEvent) => void;
		icon?: Snippet<[{ active: boolean }]>;
		children?: Snippet;
		class?: string;
		[key: string]: any;
	}

	let {
		href,
		active = false,
		disabled = false,
		center = false,
		variant = 'normal',
		onclick,
		icon,
		children,
		class: className = '',
		...restProps
	}: Props = $props();

	function handleClick(e: MouseEvent) {
		if (disabled) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}
		onclick?.(e);
	}
</script>

{#if href && !disabled}
	<a
		{href}
		onclick={handleClick}
		class="btn btn-{variant} {className}"
		class:active
		aria-current={active ? 'page' : undefined}
		style={center ? 'text-align: center;' : 'text-align: left;'}
		{...restProps}
	>
		{#if icon}
			<span class="icon">{@render icon({ active })}</span>
		{/if}
		{#if children}
			<span class="label">{@render children()}</span>
		{/if}
	</a>
{:else if href && disabled}
	<a
		role="link"
		aria-disabled="true"
		tabindex="-1"
		onclick={handleClick}
		class="btn btn-{variant} {className} disabled"
		style={center ? 'text-align: center;' : 'text-align: left;'}
		{...restProps}
	>
		{#if icon}
			<span class="icon">{@render icon({ active })}</span>
		{/if}
		{#if children}
			<span class="label">{@render children()}</span>
		{/if}
	</a>
{:else}
	<button
		type="button"
		{disabled}
		onclick={handleClick}
		class="btn btn-{variant} {className}"
		class:active
		class:disabled
		style={center ? 'text-align: center;' : 'text-align: left;'}
		{...restProps}
	>
		{#if icon}
			<span class="icon">{@render icon({ active })}</span>
		{/if}
		{#if children}
			<span class="label">{@render children()}</span>
		{/if}
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		border: 1px solid #168000;
		background-color: #1d9900;
		color: #ffffff;
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		user-select: none;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease,
			color 0.15s ease,
			opacity 0.15s ease;
	}

	/* --- Normal (Default / Green) --- */
	.btn-normal {
		background-color: #198a00;
		border-color: #168000;
		color: #ffffff;

		&:not(.disabled, :disabled) {
			@media (hover: hover) and (pointer: fine) {
				&:hover {
					background-color: #147300;
				}
			}

			&.active {
				background-color: #28ad00;
				border-color: #168000;
			}
			&:active {
				background-color: #0f5400;
				border-color: #0b3d00;
			}
		}
	}

	/* --- Dark --- */
	.btn-dark {
		background-color: #151515;
		border-color: transparent;
		color: #ffffff;

		&:not(.disabled, :disabled) {
			@media (hover: hover) and (pointer: fine) {
				&:hover {
					background-color: #222222;
					border-color: transparent;
				}
			}

			&.active {
				background-color: #2a2a2a;
				border-color: transparent;
				color: #ffffff;
			}
			&:active {
				background-color: #444444;
				border-color: transparent;
			}
		}
	}

	/* --- Danger (Red) --- */
	.btn-danger {
		background-color: #dc2626;
		border-color: #b91c1c;
		color: #ffffff;

		&:not(.disabled, :disabled) {
			@media (hover: hover) and (pointer: fine) {
				&:hover {
					background-color: #b91c1c;
				}
			}

			&.active {
				background-color: #ef4444;
				border-color: #b91c1c;
			}
			&:active {
				background-color: #991b1b;
				border-color: #7f1d1d;
			}
		}
	}

	/* --- Warning (Yellow / Dark Text for Contrast) --- */
	.btn-warning {
		background-color: #eab308;
		border-color: #ca8a04;
		color: #1c1917;

		&:not(.disabled, :disabled) {
			@media (hover: hover) and (pointer: fine) {
				&:hover {
					background-color: #ca8a04;
					color: #ffffff;
				}
			}

			&.active {
				background-color: #facc15;
				border-color: #ca8a04;
				color: #1c1917;
			}
			&:active {
				background-color: #a16207;
				border-color: #854d0e;
				color: #ffffff;
			}
		}
	}

	/* --- Transparent (Ghost / Action Icons) --- */
	.btn-transparent {
		background-color: transparent;
		border-color: transparent;
		color: inherit;

		&:not(.disabled, :disabled) {
			@media (hover: hover) and (pointer: fine) {
				&:hover {
					background-color: rgba(255, 255, 255, 0.08);
				}
			}

			&.active {
				background-color: rgba(255, 255, 255, 0.14);
			}
			&:active {
				background-color: rgba(255, 255, 255, 0.22);
			}
		}
	}

	/* --- Disabled State (Shared) --- */
	.btn:disabled,
	.btn.disabled {
		cursor: not-allowed;
		opacity: 0.6;
		background-color: #e5e7eb !important;
		border-color: #d1d5db !important;
		color: #9ca3af !important;
		pointer-events: none;
	}

	.icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
	}

	.icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	span.label {
		width: 100%;
	}
</style>
