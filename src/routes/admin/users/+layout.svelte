<script lang="ts">
	import { goto } from '$app/navigation';
	import UserSearch from '$components/users/UserSearch.svelte';

	let { children } = $props();

	const gotoUser = (userId: number | undefined) =>
		userId ? goto(`/admin/users/${userId}`) : goto(`/admin/users`);
</script>

<section class="admin-users-layout">
	<section class="settings">
		<UserSearch onSelect={(user) => gotoUser(user?.ID)} selectionMode={true} />
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
