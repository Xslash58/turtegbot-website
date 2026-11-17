<script lang="ts">
	import { hexToRgba } from '$lib/API/Helpers';
	import type { UserRole } from '$lib/API/Models/Users';

	let {
		role
	}: {
		role: UserRole;
	} = $props();
</script>

<section class="role" style="background-color: {hexToRgba(role.color, 0.2)}">
	<p style="color: {hexToRgba(role.color, 1)}">{role.name}</p>
</section>

<style lang="scss">
	.role {
		background-color: rgba($color: #fff, $alpha: 0.4);
		border-radius: 10px;
		min-width: 70px;
		width: auto;
		padding: 0 10px;
		margin: 1px;
		p {
			font-size: 0.8rem;
			padding: 0.1rem;
			font-weight: 500;
			font-family: 'Inter';
			margin: 0;
		}
	}
</style>
