<script lang="ts">
	export let userId: number | null;
	export let username: string | null;
</script>

<span class="user">
	<a href="/users/{userId}">{username}</a>
</span>

<style lang="scss">
	span.user {
		margin: 0;
		a {
			text-decoration: none;
			color: inherit;
		}
	}
</style>
