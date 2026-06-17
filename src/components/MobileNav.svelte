<script lang="ts">
	import { goto } from '$app/navigation';
	import { hexToRgba } from '$lib/API/Helpers';
	import type { User } from '$lib/API/Models/Users';
	import { fade } from 'svelte/transition';
	import { Hash, House, Rewind, Wrench } from 'phosphor-svelte';

	const { user, onAction }: { user: User | null; onAction?: () => void } = $props();

	const roleBgColor = user?.role?.color ? hexToRgba(user?.role?.color, 0.4) : null;

	function handleClick() {
		onAction?.();
	}
</script>

<section class="mobile-nav" in:fade={{ duration: 100 }} out:fade={{ duration: 200 }}>
	<section class="top">
		{#if user}
			<section class="profile">
				<button
					onclick={() => {
						goto(`/users/${user?.id}`);
						handleClick();
					}}
				>
					<img src={user.profile_image_url} alt="profile" />
					<section class="metadata">
						<p>{user.display_name}</p>
						<p class="role" style="--role-color: {roleBgColor}">{user.role?.name}</p>
					</section>
				</button>
			</section>
		{/if}
	</section>
	<nav>
		<ul>
			<li>
				<a href="/" onclick={handleClick}>
					<span class="icon"><House weight="fill" /></span> Home</a
				>
			</li>
			<li>
				<a href="/commands" onclick={handleClick}>
					<span class="icon"><Hash weight="bold" /></span> Commands</a
				>
			</li>
			{#if import.meta.env.VITE_RECAPS == '1'}
				<li>
					<a href="/recap/2025" class="special-event" onclick={handleClick}>
						<span class="icon" style="color: aqua"><Rewind weight="fill" /></span> RECAP 2025</a
					>
				</li>
			{/if}
			{#if user && user.role?.power >= 5}
				<li>
					<a href="/admin" style="color: red;" onclick={handleClick}>
						<span class="icon"><Wrench weight="fill" /></span> Admin</a
					>
				</li>
			{/if}
		</ul>
	</nav>
</section>

<style lang="scss">
	.mobile-nav {
		position: fixed;
		top: 45px;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		background-color: #101010;

		nav {
			display: flex;
			justify-content: center;
			align-items: center;

			ul {
				display: flex;
				flex-direction: column;
				list-style: none;
				padding: 0;
				margin: 0;
				width: 100%;

				li {
					background-color: #121212;
					border-radius: 10px;
					margin: 2px 5px;

					&:hover {
						background-color: #18181885;
					}
					a {
						display: flex;
						align-items: center;
						gap: 5px;
						padding: 10px 0;

						color: white;
						text-decoration: none;
						font-size: 18px;
						transition: color 0.2s;

						span {
							display: flex;
							align-items: center;
							justify-content: center;

							padding: 5px 10px;
						}

						&.special-event {
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
				}
			}
		}

		.top {
			section.profile {
				button {
					width: 100%;
					display: flex;
					align-items: center;
					background: none;
					border: none;
					cursor: pointer;

					background-color: #121212;
					padding: 5px 10px;
					margin: 2px 5px;
					border-radius: 10px;

					&:hover {
						background-color: #18181885;
					}
				}
				p {
					margin: 0;
					font-weight: 600;
					font-size: large;
					color: white;

					&.role {
						font-size: small;
						padding: 2px 5px;
						border-radius: 5px;
						color: white;
						background-color: var(--role-color);
					}
				}
				img {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					margin-right: 10px;
				}
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
