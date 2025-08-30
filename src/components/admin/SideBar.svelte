<script lang="ts">
	import { goto } from '$app/navigation';
	import type { User, UserPage } from '$lib/API/Models/Users';
	import { onMount } from 'svelte';

	export let me: User | null;

	onMount(async () => {
		console.log('SideBar component mounted');
	});

	function gotoCategory(category: string) {
		goto(`/admin/${category}`);
	}
</script>

<section class="sidebar">
	<nav>
        <button on:click={() => gotoCategory(``)}>Home</button>
        {#if me && me.role.power >= 5}
		    <button on:click={() => gotoCategory(`tickets`)}>Tickets</button>
		    <button on:click={() => gotoCategory(`reminders`)}>Reminders</button>
		    <button disabled on:click={() => gotoCategory(`afks`)}>AFKs</button>
			<button on:click={() => gotoCategory(`turtles`)}>Turtles</button>
        {/if}
        {#if me && me.role.power >= 10}
		    <button class="admin" on:click={() => gotoCategory(`codes`)}>Codes</button>
		    <button class="admin" on:click={() => gotoCategory(`users`)}>Users</button>
		    <button class="admin" on:click={() => gotoCategory(`maintenance`)}>Maintenance</button>
		{/if}
	</nav>
</section>

<style lang="scss">
	.sidebar {
		background-color: #101010;
		color: white;
		padding: 20px;
		width: 200px;
		min-height: 100%;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 100px;

		button {
			background-color: #33ca00;
			color: white;
			border: none;
			border-radius: 10px;
			padding: 10px 15px;
			cursor: pointer;
			margin-bottom: 10px;

            &.admin {
                background-color: #dc3545;

                &:hover {
                    background-color: #c82333;
                }
            }

			&:hover {
				background-color: #28a300;
			}

			&:disabled {
				background-color: #555;
				cursor: not-allowed;
			}
		}

		nav {
			width: 100%;
			display: flex;
			flex-direction: column;
		}
	}

	@media (max-width: 768px) {
		.sidebar {
			width: 100%;
			padding: 0;
			gap: 0;
		}
		button {
			min-width: 120px;
			padding: 5px 0 !important;

			display: flex;
			justify-content: center;
			align-items: center;
		}
		nav {
			flex-direction: row !important;
			flex-shrink: 0;
			overflow-x: scroll;
			gap: 5px;
			scrollbar-width: initial;

			&::-webkit-scrollbar {
				height: 6px;
			}
		}
	}
</style>
