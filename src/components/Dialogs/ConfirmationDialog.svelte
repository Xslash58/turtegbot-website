<script lang="ts">
	import { confirmationDialog } from '$lib/stores/modalStore';
	import './dialogStyle.scss';
	import './dialogScript.ts';
	import { onDestroy, onMount } from 'svelte';
    import { fade } from 'svelte/transition';

	onMount(() => {
		console.log('ConfirmationDialog component mounted');
	});

	let visible = false;
    let text = "Are you sure you want to proceed?";
    let onConfirm: (() => void) | undefined;

    const unsubscribe = confirmationDialog.subscribe((value) => {
        visible = value.visible;
        text = value.text ?? "Are you sure you want to proceed?";
        onConfirm = value.onConfirm;
    });
    onDestroy(unsubscribe);

	function close() {
		confirmationDialog.set({ visible: false });
	}
</script>

{#if visible}
	<button class="dialog-backdrop" on:click={close} aria-label="Close confirmation dialog"></button>
	<dialog class="confirmation-dialog" transition:fade={{ duration: 200 }} open>
		<section class="content">
            <section class="text">
                {#each text.split('\n') as line}
                    <p>{line}</p>
                {/each}
            </section>
            <section class="actions">
                <button class="cancel" on:click={close}>Cancel</button>
                <button class="confirm" on:click={() => { onConfirm?.(); close(); }}>Confirm</button>
            </section>
        </section>
	</dialog>
{/if}
