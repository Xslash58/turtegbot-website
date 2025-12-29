<script lang="ts">
	import { goto } from '$app/navigation';
	import type { User } from '$lib/API/Models/Users';
	import { GetMe } from '$lib/API/Users';
	import christmasBg from '$lib/assets/header-xmas.png';
	import turtegLogo from '$lib/assets/favicon.png';

	import { loginModalVisible } from '$lib/stores/modalStore';
	import { onMount } from 'svelte';
	import LoadingIndicator from './LoadingIndicator.svelte';
	import { page } from '$app/state';
	import { myUser } from '$lib/stores/userStore';

	let user: User | null = null;

	let isLoaded: boolean = false;

	onMount(async () => {
		console.log('Header component mounted');

		const token = localStorage.getItem('turteg-token');

		if (token) {
			user = await GetMe();
			myUser.set(user);
			console.log('User fetched:', user);
		}

		if (!page.route.id?.startsWith('/auth/')) isLoaded = true;
	});

	function openLoginModal() {
		loginModalVisible.set(true);
		console.log('Login modal opened');
	}
</script>

<header style="{import.meta.env.VITE_CHRISTMAS == '1' ? `background: url(${christmasBg});` : ''}">
	<section class="branding">
		<img
			src={turtegLogo}
			alt="logo"
			style="filter: invert(54%) sepia(98%) saturate(749%) hue-rotate(75deg) brightness(100%);"
		/>
		<h1>TurtegBot</h1>
	</section>

	<nav>
		<ul>
			<li><a href="/">Home</a></li>
			<li><a href="/commands">Commands</a></li>
			{#if user && user.role?.power >= 5}
				<li><a href="/admin" style="color: red;">Admin</a></li>
			{/if}
		</ul>
	</nav>

	{#if user && isLoaded}
		<section class="profile">
			<button on:click={() => goto(`/users/${user?.id}`)}>
				<p>{user.display_name}</p>
				<img src={user.profile_image_url} alt="profile" />
			</button>
		</section>
	{:else if !isLoaded}
		<section class="profile">
			<LoadingIndicator />
		</section>
	{:else}
		<section class="login-wrapper">
			<button class="login-button" on:click={openLoginModal}>
				<span>Login</span>
			</button>
		</section>
	{/if}

	{#if import.meta.env.VITE_CHRISTMAS == '1'}
		<section class="seasonal-xmas">
			<img
				src="https://i.xslash.ovh/SB7cK59f.avif"
				alt="christmas left corner lights"
				class="corner left"
				style="display: none;"
			/>
			<img
				src="https://i.xslash.ovh/SB7cK59f.avif"
				alt="christmas left corner lights"
				class="corner right"
			/>
		</section>
	{/if}
</header>

<style lang="scss">
	header {
		position: relative;

		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px;
		background-color: #101010;
		color: white;
		height: 45px;
	}

	.branding {
		display: flex;
		align-items: center;
		gap: 10px;
		color: #40ff00;

		img {
			display: none;
			width: 40px;
			height: 40px;
		}
	}
	nav {
		position: absolute;
		left: 50%;
		top: 0;
		transform: translateX(-50%);

		height: 100%;
		ul {
			display: flex;
			flex-direction: row;
			list-style: none;
			padding: 0;
			margin: 0;
			height: 100%;

			li {
				padding: 0 10px;
				display: flex;
				justify-content: center;
				align-items: center;
				color: white;
				text-align: center;

				a {
					height: 100%;
					display: flex;
					align-items: center;
					color: inherit;
					text-decoration: inherit;
				}

				a.special-event {
					font-weight: bold;
					letter-spacing: 1px;
					background: linear-gradient(
						90deg,
						#fc3737,
						#ffffff,
						#87ceeb,
						#fc3737,
						#ffffff,
						#87ceeb,
						#fc3737
					);
					background-size: 500% 100%;
					background-clip: text;
					-webkit-background-clip: text;
					color: transparent;
					animation: rainbow-slide 6s linear infinite;
				}
			}
			li:hover {
				background-color: #18181885;
			}
		}
	}

	section.profile {
		button {
			display: flex;
			align-items: center;
			background: none;
			border: none;
			cursor: pointer;
		}
		p {
			margin: 0;
			font-weight: 600;
			color: white;
		}
		img {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			margin-left: 10px;
		}
	}

	section.login-wrapper {
		display: flex;
		align-items: center;

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

	.seasonal-xmas {
		z-index: 7;

		position: absolute;
		top: 0;
		left: 0;
		width: 100%;

		pointer-events: none;

		.corner.left {
			position: absolute;

			top: 45px;
			left: 0;

			height: 200px;
			width: auto;
		}
		.corner.right {
			position: absolute;

			top: 45px;
			right: 0;

			height: 200px;
			width: auto;

			transform: scaleX(-1);
		}
	}

	@media (max-width: 768px) {
		header {
			padding: 0 5px;
		}

		.branding {
			h1 {
				display: none;
			}

			img {
				display: inline;
			}
		}

		section.profile {
			p {
				display: none;
			}
			img {
				margin-left: 0;
			}
		}

		.seasonal-xmas {
			.corner.right,
			.corner.left {
				display: none;
			}
		}
	}

	@keyframes rainbow-slide {
		0% {
			background-position: 0% 50%;
		}
		100% {
			background-position: 125% 50%;
		}
	}
</style>
