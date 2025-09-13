<script lang="ts">
	import twitchLogo from '$lib/assets/glitch_flat_white.svg';
	import kickLogo from '$lib/assets/KickLogo.svg';
	import { ArrowUUpLeft } from 'phosphor-svelte';
</script>

<section class="howtoadd">
	<button on:click={() => history.back()}>
		<ArrowUUpLeft size={24} color="white" weight="bold" />
	</button>
	<h1>
		<img src={twitchLogo} alt="Twitch Logo" width="32" />
		Twitch:
	</h1>
	<section class="steps">
		<section class="step">
			<h2>Step 1: Log in on this website or mod <code>turtegbot</code> in your chat</h2>
		</section>
		<section class="step">
			<h2>
				Step 2: Type <code>#join</code> in
				<a href="https://www.twitch.tv/turtegbot" target="_blank">turtegbot</a> Twitch chat
			</h2>
		</section>
		<section class="step">
			<h2>Step 3: You're all set!</h2>
		</section>
	</section>

	<h1>
		<img src={kickLogo} alt="Kick Logo" width="32" />
		Kick:
	</h1>
	<section class="steps">
		<section class="step">
			<h2>Step 1: Mod <code>turtegbot</code> in your chat</h2>
		</section>
		<section class="step">
			<h2>
				Step 2: Type <code>#join</code> in
				<a href="https://www.kick.com/turtegbot" target="_blank">turtegbot</a> Kick chat
			</h2>
		</section>
		<section class="step">
			<h2>Step 3: You're all set!</h2>
		</section>
	</section>
	<br />
	<h2>(To remove bot from your channel type <code>#part</code> in your or turtegbot chat)</h2>
	<br />
	<p>Thank you for using TurtegBot!</p>
</section>

<style lang="scss">
	.howtoadd {
		text-align: left;

		button {
			background: none;
			border: none;
			cursor: pointer;

			&:hover {
				opacity: 0.7;
			}
		}

		h1,
		> h2 {
			display: flex;
			align-items: center;
			gap: 10px;

			margin-left: 10px;
		}

		section.steps {
			section.step {
				margin-left: 20px;
			}
		}

		> p {
			margin-left: 10px;
			font-size: 1.2rem;

			font-weight: bold;
			color: #33ca00;
		}
	}
</style>
