<script lang="ts">
	import { MagnifyingGlass, X } from 'phosphor-svelte';
	import LoadingIndicator from './LoadingIndicator.svelte';

	export let searchTerm: string = '';
	export let placeholder: string = 'Search...';
	export let onFocusOut: () => void = () => {};
	export let autoFocus = false;
	export let isLoading = false;
</script>

<section class="search">
	<section class="search-bar">
		<section class="icon">
			{#if isLoading}
				<LoadingIndicator size={12} />
			{:else}
				<MagnifyingGlass fill="white" weight="bold" />
			{/if}
		</section>
		<!-- svelte-ignore a11y_autofocus -->
		<input
			type="text"
			{placeholder}
			bind:value={searchTerm}
			on:focusout={onFocusOut}
			bind:focused={autoFocus}
			autofocus={autoFocus}
		/>
	</section>
</section>

<style lang="scss">
	.search-bar {
		display: flex;
		align-items: center;
		gap: 5px;
		background: #0c0c0c;
		padding: 5px 10px;
		border-radius: 4px;

		.icon {
			width: 16px;
			height: 16px;
		}

		input {
			background: transparent;
			border: none;
			color: white;
			width: 200px;

			&::placeholder {
				color: #888;
			}

			&:focus {
				outline: none;
			}
		}
	}

	.search {
		position: relative;
		display: inline-block;
	}
</style>
