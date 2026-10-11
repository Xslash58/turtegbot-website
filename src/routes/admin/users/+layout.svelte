<script lang="ts">
	import { goto } from '$app/navigation';
	import UserSearch from '$components/users/UserSearch.svelte';

	let { data, children } = $props();

    let userSearch: UserSearch | null = $state(null);

	function gotoUser(userId: number | undefined) {
		if (userId) {
			goto(`/admin/users/${userId}`);
		} else {
			goto(`/admin/users`);
		}
	}
</script>

<section class="admin-users-layout">
	<section class="settings">
		<UserSearch onSelect={(user) => gotoUser(user?.ID)} selectionMode={true} bind:this={userSearch} />
	</section>
	<section class="admin-users-content">
		{@render children?.()}
	</section>
</section>

<style lang="scss">
	.settings {
		background: #191919;
		padding: 1rem;
		border-radius: 5px;
	}
</style>
