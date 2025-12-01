<script lang="ts">
	import type { User } from '$lib/API/Models/Users';
	import { onMount } from 'svelte';
	import { myUser } from '$lib/stores/userStore';
	import SideBar from '../../components/admin/SideBar.svelte';
	import { error } from '@sveltejs/kit';

	let { data, children } = $props();

	let me: User | null = $state(null);

	myUser.subscribe((value) => {
		if (value) {
			me = value;
		}

		if (!me || !me.role || me.role.power < 5) {
			console.log('Access denied: insufficient permissions');
			error(404, 'fake_notfound');
		}
	});

	onMount(async () => {
		console.log('Admin layout mounted');
	});
</script>

<section class="user-layout">
	<SideBar {me} />
	<section class="user-content">
		{@render children?.()}
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
	}

	@media (max-width: 768px) {
		.user-layout {
			flex-direction: column;
			flex: 0;
		}
	}
</style>
