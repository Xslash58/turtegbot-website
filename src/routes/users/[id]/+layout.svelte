<script lang="ts">
	import type { User, UserPage } from '$lib/API/Models/Users';
	import { onMount } from 'svelte';
	import SideBar from '../../../components/users/SideBar.svelte';
	import { GetMe, GetUserPage } from '$lib/API/Users';
	import { page } from '$app/state';
	import LoadingIndicator from '../../../components/LoadingIndicator.svelte';
	import { myUser, profileUser } from '$lib/stores/userStore';

	let { data, children } = $props();

	let userPage: UserPage | null = $state(null);
	let user: User | null = $state(null);
	let me: User | null = $state(null);

	let isLoaded: boolean = $state(false);

	let prevUserId: string | undefined;

	myUser.subscribe((value) => {
		if (value) {
			me = value;
		}
	});

	onMount(async () => {
		console.log('User layout mounted');
	});
	$effect(() => {
		const currentId = page.params.id ?? '';
		if (currentId !== prevUserId) {
			prevUserId = currentId;
			(async () => {
				userPage = await GetUserPage(currentId);
				if (userPage == null) {
					user = null;
					isLoaded = true;
					return;
				}

				user = userPage.user;
				profileUser.set(user);
				isLoaded = true;
			})();
		}
	});
</script>

<section class="user-layout">
	<SideBar {userPage} {user} {me} />
	<section class="user-content">
		{#if user}
			{@render children?.()}
		{:else if !isLoaded}
			<section class="loading">
				<h1>Loading user data...</h1>
				<LoadingIndicator />
			</section>
		{:else}
			<section class="loading">
				<h1>User not found.</h1>
			</section>
		{/if}
	</section>
</section>

<style lang="scss">
	.user-layout {
		display: flex;
		flex-direction: row;
		flex: 1;
	}

	.user-content {
		flex: 1;
		padding: 20px;

		section.loading {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;
			font-size: 1.25rem;
			h1 {
				text-align: center;
			}
		}
	}

	@media (max-width: 768px) {
		.user-layout {
			flex-direction: column;
			flex: 0;
		}
	}
</style>
