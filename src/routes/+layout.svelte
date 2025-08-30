<script lang="ts">
	import favicon from '$lib/assets/favicon.png';
	import ConfirmationDialog from '../components/Dialogs/ConfirmationDialog.svelte';
	import LoginDialog from '../components/Dialogs/LoginDialog.svelte';
	import Footer from '../components/Footer.svelte';
	import Header from '../components/Header.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>TurtegBot</title>
</svelte:head>

<div class="dialog-wrapper">
	<LoginDialog />
	<ConfirmationDialog />
</div>

<div class="layout-wrapper">
	<Header />

	<div class="main-content">
		{@render children?.()}
	</div>

	<Footer />
</div>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: Arial, sans-serif;
		background-color: #121212;
		color: #fff;
	}

	:global(a) {
		color: #40ff00;
	}

	.layout-wrapper {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	:global(input),
	:global(select) {
		background-color: #191919;
		color: white;
		border: none;
		outline: none;

		text-align: left;

		&:focus {
			outline: none;
			outline: 1px solid #4a90e2;
		}

		&:hover {
			background-color: #282828;
		}
	}

	:global(::-webkit-scrollbar) {
		width: 0.25rem;
	}
	:global(::-webkit-scrollbar-thumb) {
		background-color: rgba($color: #33ca00, $alpha: 1);
		border-radius: 4px;
	}
	:global(::-webkit-scrollbar-track) {
		background-color: rgba(0, 0, 0, 0.25);
	}
</style>
