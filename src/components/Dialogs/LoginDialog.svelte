<script lang="ts">
	import { loginModalVisible } from '$lib/stores/modalStore';
	import twitchLogo from '$lib/assets/glitch_flat_white.svg';
	import kickLogo from '$lib/assets/KickLogo.svg';
	import './dialogStyle.scss';
	import './dialogScript.ts';
	import { onDestroy, onMount } from 'svelte';
    import { fade } from 'svelte/transition';
	import { generatePKCE } from '$lib/API/Auth';

	onMount(() => {
		console.log('LoginDialog component mounted');
	});

	let visible = false;
	const unsubscribe = loginModalVisible.subscribe((value) => {
		visible = value;
	});
	onDestroy(unsubscribe);

	function close() {
		loginModalVisible.set(false);
	}

    function loginWithTwitch() {
        location.href = import.meta.env.VITE_AUTH_TWITCH_URL;
        close();
    }

	async function loginWithKick() {
		const { codeVerifier, codeChallenge } = await generatePKCE();
		localStorage.setItem('turteg-kick-verifier', codeVerifier);

		location.href = `${import.meta.env.VITE_AUTH_KICK_URL}&state=test&code_challenge=${codeChallenge}`;
		close();
	}
</script>

{#if visible}
	<button class="dialog-backdrop" on:click={close} aria-label="Close login dialog"></button>
	<dialog class="login-dialog" transition:fade={{ duration: 200 }} open>
		<section class="platforms">
			<button on:click={loginWithTwitch}>
				<img src={twitchLogo} alt="Twitch Logo" />
				<p>Login with Twitch</p>
			</button>
			<button on:click={loginWithKick}>
				<img src={kickLogo} alt="Kick Logo" />
				<p>Login with Kick</p>
			</button>
		</section>
	</dialog>
{/if}
