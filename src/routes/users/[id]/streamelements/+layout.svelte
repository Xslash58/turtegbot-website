<script lang="ts">
	import type { User } from '$lib/API/Models/Users';
	import { onMount } from 'svelte';
	import SideBar from '../../../..//components/users/SideBar.svelte';
	import { GetMe, GetUserPage } from '$lib/API/Users';
	import { page } from '$app/state';
	import LoadingIndicator from '../../../../components/LoadingIndicator.svelte';
	import { myUser, profileUser } from '$lib/stores/userStore';
	import StreamElementsBar from '../../../../components/users/StreamElementsBar.svelte';

	let { data, children } = $props();

	let user: User | null = $state(null);
	let me: User | null = $state(null);
	
	let isLoaded: boolean = $state(false);

	myUser.subscribe((value) => {
		if (value) {
			me = value;
		}
	});
	profileUser.subscribe((value) => {
		if (value) {
			user = value;
		}
	});

	onMount(async () => {
		console.log('User layout mounted');

		//if (page.params.id !== undefined) {
		//	user = await GetUserPage(page.params.id)
		//}
		isLoaded = true;
	});

</script>

<section class="user-layout">
	<StreamElementsBar {user} />
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
    flex-direction: column;
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
</style>