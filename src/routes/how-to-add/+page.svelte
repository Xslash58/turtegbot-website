<script lang="ts">
	import twitchLogo from '$lib/assets/glitch_flat_white.svg';
	import kickLogo from '$lib/assets/KickLogo.svg';
	import { ArrowUUpLeft } from 'phosphor-svelte';
</script>

<svelte:head>
	<title>How To Add | TurtegBot</title>
</svelte:head>

<section class="display">
	<h1 id="page-title">
		<button on:click={() => history.back()}>
			<ArrowUUpLeft size={24} color="white" weight="bold" />
		</button>
		Add TurtegBot to your channel
	</h1>
	<small>Choose your platform and follow the steps below</small>

	<hr />

	<section id="row">
		<div class="instructions">
			<h1 class="title">
				<img src={twitchLogo} alt="Twitch Logo" width="25" />
				Twitch
			</h1>
			<ol class="steps">
				<li>Log in on this website or mod <code>turtegbot</code> in your chat</li>
				<li>
					Type <code>#join</code> in
					<a href="https://www.twitch.tv/turtegbot" target="_blank">turtegbot</a> Twitch chat
				</li>
				<li>You're all set!</li>
			</ol>
		</div>
		<div class="instructions">
			<h1 class="title">
				<img src={kickLogo} alt="Kick Logo" width="30" />
				Kick
			</h1>
			<ol class="steps">
				<li>Mod <code>turtegbot</code> in your chat</li>
				<li>
					Type <code>#join</code> in
					<a href="https://www.kick.com/turtegbot" target="_blank">turtegbot</a> Kick chat
				</li>
				<li>You're all set!</li>
			</ol>
		</div>
	</section>
	<section>
		<p id="part">
			(To remove bot from your channel type <code>#part</code> in your or <code>turtegbot</code> chat)
		</p>
		<small id="thanks">Thank you for using TurtegBot!</small>
	</section>
</section>

<style lang="scss">
	.display {
		display: flex;
		flex-direction: column;
		padding: 0.5rem;
		gap: 0.5rem;
		align-self: center;

		#page-title {
			display: flex;
			gap: 0.5rem;
			align-items: center;
		}

		code {
			color: #40ff00;
		}

		h1 {
			margin: 0;
		}

		.title {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}

		#part {
			border-left: #40ff00 0.25rem solid;
			padding: 0.5rem;
			border-radius: 0.25rem 0.5rem 0.5rem 0.25rem;
		}

		small {
			color: rgba(255, 255, 255, 0.5);
			font-size: 1rem;
		}

		#thanks {
			display: block;
			text-align: center;
		}

		#row {
			display: flex;
			align-items: stretch;
			justify-content: center;
			gap: 5rem;
		}

		button {
			background: none;
			border: none;
			cursor: pointer;
			font-size: 1.5rem;
			display: flex;
			align-items: center;
			align-self: center;
			color: white;
			gap: 0.5rem;

			&:hover {
				opacity: 0.75;
			}
		}

		.instructions {
			padding: 1.5rem;
			border: 0.15rem #1d1d1d solid;
			border-radius: 0.5rem;

			display: flex;
			flex-direction: column;

			gap: 1rem;

			width: 25dvw;

			box-sizing: border-box;
		}

		.instructions,
		#part {
			background-color: rgba(255, 255, 255, 0.015);
		}

		ol {
			font-size: 1.25rem;
			font-weight: bold;

			display: flex;
			flex-direction: column;
			gap: 0.25rem;

			padding: 0;
			margin: 0;
			list-style-position: inside;

			li::marker {
				color: #40ff00;
			}
		}

		hr {
			width: 100%;
			border-color: rgba(255, 255, 255, 0.05);
		}
	}

	@media (max-width: 768px) {
		.display {
			overflow-x: hidden;

			#page-title {
				font-size: 1.25rem;
			}

			small {
				font-size: 0.75rem;
			}

			#row {
				display: contents;
			}
			.instructions {
				width: 100%;
			}

			.title {
				font-size: 1.5rem;
			}

			ol {
				font-size: 1rem;
			}
		}
	}
</style>
