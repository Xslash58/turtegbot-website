<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    href?: string;
    active?: boolean;
    disabled?: boolean;
    center?: boolean;
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
    class="btn {className}"
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
    class="btn {className} disabled"
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
    class="btn {className}"
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
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
  }

  .btn:hover:not(.disabled):not(:disabled) {
    background-color: #147300;
  }

  /* Active / Highlight State */
  .btn.active:not(.disabled):not(:disabled) {
    background-color: #28ad00;
    border-color: #168000;
    color: #ffffff;
  }

  /* Disabled State */
  .btn:disabled,
  .btn.disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background-color: #e5e7eb;
    border-color: #d1d5db;
    color: #9ca3af;
    pointer-events: none; /* Prevents clicks on <a> */
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