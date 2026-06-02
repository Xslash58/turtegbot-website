<script lang="ts">
	import { feedbackDialog } from '$lib/stores/modalStore';
	import './dialogStyle.scss';
	import './dialogScript.ts';
	import { onDestroy, onMount } from 'svelte';
    import { fade } from 'svelte/transition';

	onMount(() => {
		console.log('FeedbackDialog component mounted');
	});

	let visible = false;
    let title = "";
    let content = "";
    let onClose: (() => void) | undefined;

    const unsubscribe = feedbackDialog.subscribe((value) => {
        visible = value.visible;
        title = value.title ?? "";
        content = value.content ?? "Hello, world!";
        onClose = value.onClose;
    });
    onDestroy(unsubscribe);
    
	function close() {
		feedbackDialog.set({ visible: false });
	}
</script>

{#if visible}
	<button class="dialog-backdrop" aria-label="Close feedback dialog" on:click={() => { onClose?.(); close(); }}></button>
	<dialog class="feedback-dialog" transition:fade={{ duration: 200 }} open>
		<section class="content">
            {#if title}
            <h2>{title}</h2>
            <hr>
            {/if}
            <section class="text">
                {#each content.split('\n') as line}
                    <p>{line}</p>
                {/each}
            </section>
            <section class="actions">
                <button class="confirm" on:click={() => { onClose?.(); close(); }}>OK</button>
            </section>
        </section>
	</dialog>
{/if}
