<script lang="ts">
	import type { User } from '$lib/API/Models/Users';
	import { loginModalVisible } from '$lib/stores/modalStore';
	import { myUser } from '$lib/stores/userStore';
	import { ArrowUUpLeft, Check, CheckCircle } from 'phosphor-svelte';

    let user: User | null = null;

    myUser.subscribe((value) => {
        if (value) {
            user = value;
        }
    });

    function login() {
        loginModalVisible.set(true);
    }
</script>

<section class="howtoadd">
	<button on:click={() => history.back()}>
		<ArrowUUpLeft size={24} color="white" weight="bold" />
	</button>
	<h1>Hi there!</h1>
	<p>If you stumbled into this subpage - it most likely means your channel is now legacy.</p>
	<p>In order to still use the bot do the following steps:</p>
	<section class="steps">
		<section class="step">
			<h2 style="color: {user ? 'lime' : 'white'};">
				Step 1: Mod <code>turtegbot</code> in your chat or <button on:click={login} class="login-button">Login</button> on this website
                {#if user}
                <CheckCircle size={20} color="lime" weight="bold" />
                {/if}
			</h2>
		</section>
		<section class="step">
			<h2>
				Step 2: Type <code>#part</code> in
				<a href="https://www.twitch.tv/turtegbot" target="_blank">turtegbot</a> Twitch chat
			</h2>
		</section>
		<section class="step">
			<h2>
				Step 3: Type <code>#join</code> in
				<a href="https://www.twitch.tv/turtegbot" target="_blank">turtegbot</a> Twitch chat
			</h2>
		</section>
		<section class="step">
			<h2>Step 3: You're all set!</h2>
		</section>
	</section>
	<br />
	<h2>Why?</h2>
	<p>
		The bot ended up being used far more than I originally anticipated, which eventually led to
		noticeable performance issues. As traffic increased, the existing command handling approach no
		longer scaled well enough.
	</p>
	<p>
		To improve reliability and reduce lag, I decided to refactor how commands are processed and
		migrate message handling to Twitch EventSub using WebHooks instead of relying solely on
		traditional IRC-based solutions.
	</p>
	<p>
		However, starting June 26, 2024, Twitch introduced new platform restrictions that require bots
		to either have moderator privileges in a channel or be explicitly authorized by the broadcaster
		using the <code>channel:bot</code> scope.
	</p>
	<p>
		More details about this change can be found in the official Twitch announcement:
		<a
            target="_blank"
			href="https://discuss.dev.twitch.com/t/giving-broadcasters-control-concurrent-join-limits-for-irc-and-eventsub"
		>
			Giving Broadcasters Control: Concurrent Join Limits for IRC and EventSub
		</a>
	</p>

    <br>
    <p>To comply with these new requirements, TurtegBot now needs to be either modded in your channel or you need to authorize it via our website.</p>

	<br />
    <p>Sorry for all the issues... and</p>
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

        .login-button {
			background-color: white;
			color: black;
			border: none;
			padding: 5px 10px;
			border-radius: 10px;
			cursor: pointer;

			font-weight: 600;

			&:hover {
				background-color: rgb(230, 230, 230);
			}
		}
	}
</style>
