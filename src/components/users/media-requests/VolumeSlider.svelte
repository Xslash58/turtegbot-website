<script lang="ts">
	import { SpeakerHigh, SpeakerLow, SpeakerSlash, SpeakerX } from "phosphor-svelte";

    let volumeSliderRef: HTMLInputElement;

    let {
        volume = $bindable<number>(10),
        onVolumeChange = (volume: number) => {}
	} = $props();

    function handleVolumeChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const newVolume = parseInt(target.value);
        volume = newVolume;
        onVolumeChange(newVolume);
    }
</script>

<section class="volume-wrapper">
    <section class="volume-icon">
        {#if volume <= 0}
            <SpeakerX size={24} weight="fill" />
        {:else if volume < 35}
            <SpeakerLow size={24} weight="fill" />
        {:else}
            <SpeakerHigh size={24} weight="fill" />
        {/if}
    </section>
    <section class="volume-slider">
        <input type="range" name="volume" id="volume" min="0" max="100" value={volume} oninput={handleVolumeChange} bind:this={volumeSliderRef} />
    </section>
</section>

<style lang="scss">
    .volume-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;
        
        .volume-icon {
            display: flex;
            align-items: center;
        }
    }

</style>