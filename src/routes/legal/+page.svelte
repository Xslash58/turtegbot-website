<script lang="ts">
	import Button from '$components/Button.svelte';
	import { Gavel, Keyhole } from 'phosphor-svelte';
</script>

<section class="legal">
	<Button href="/legal/privacy">
		{#snippet icon()}
			<Keyhole />
		{/snippet}
		Privacy Policy
	</Button>
	<Button href="/legal/tos">
		{#snippet icon()}
			<Gavel />
		{/snippet}
		Terms of Service
	</Button>
</section>

<style lang="scss">
    .legal {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        margin-top: 2rem;
    }
</style>