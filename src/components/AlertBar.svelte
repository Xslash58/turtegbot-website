<script lang="ts">
	import { browser } from '$app/environment';
	import { CaretDown, Info, Warning, X } from 'phosphor-svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let isDetailedView: boolean = $state(false);

    let alertId: string = $state(import.meta.env.VITE_ALERT_ID || '');
	let alertTitle: string = $state('');
	let alertMessage: string = $state('');
	let alertType: string = $state(import.meta.env.VITE_ALERT_TYPE || 'info'); // 'info', 'warning', 'error'


	onMount(async () => {
        if(browser && window.localStorage) {
            const dismissed = localStorage.getItem(`turteg-alert-${alertId}-dismissed`);
            if(dismissed === 'true') {
                return;
            }
        }

	    alertTitle = import.meta.env.VITE_ALERT_TITLE || '';
	    alertMessage = import.meta.env.VITE_ALERT_MESSAGE || '';

		try {
			const res = await fetch('https://status.xslash.ovh/index.json');
			if (!res.ok) return;

			const json = await res.json();

			const announcement = json?.data?.attributes?.announcement || null;
			if (announcement) {
				alertTitle = "Status Announcement";
				alertMessage = announcement;
				alertType = 'error';
			}
		} catch (error) {
			console.error('Error fetching announcement:', error);
		}
	});

	function showMore() {
		isDetailedView = !isDetailedView;
	}

    function discardAlert() {
        if(window.localStorage) {
            localStorage.setItem(`turteg-alert-${alertId}-dismissed`, 'true');
        }
        alertTitle = '';
        alertMessage = '';
    }
</script>

{#if alertTitle}
	<section class="alert alert-{alertType}" class:detailed={isDetailedView}>
		<header>
			{#if alertType === 'info'}
				<Info size={24} weight="bold" style="min-width: 24px;" />
			{:else}
				<Warning size={24} weight="bold" style="min-width: 24px;" />
			{/if}
			<p>{alertTitle}</p>
			{#if alertMessage}
				<button onclick={showMore}>
					<section class="more-icon" class:detailed={isDetailedView}>
						<CaretDown size={24} weight="bold" />
					</section>
				</button>
			{/if}

            {#if alertType === 'info'}
                <button class="discard" onclick={discardAlert}>
                    <X size={24} weight="bold" />
                </button>
            {/if}
		</header>
		{#if isDetailedView}
			<section class="details" transition:slide={{ duration: 300 }}>
				<p>{alertMessage}</p>
			</section>
		{/if}
	</section>
{/if}

<style lang="scss">
	.alert {
		text-align: center;
		font-weight: bold;
		color: white;

		&.detailed {
			animation: unset;
			background-color: var(--alert-bg-color, inherit);
		}

		header {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 10px;

			padding: 0 10px;

			button {
				background: none;
				border: none;
				cursor: pointer;
				color: inherit;
				display: flex;
				align-items: center;
				justify-content: center;

				.more-icon {
					transition: transform 0.3s ease;
					&.detailed {
						transform: rotate(180deg);
					}
				}

                &.discard {
                    
                }
			}
		}

		.details {
			padding: 10px 10px;
		}

		animation: pulse 4s infinite;

		p {
			margin: 0;
		}

		&.alert-info {
			background-color: #007bff;
			animation: unset;
		}

		&.alert-warning {
			--alert-bg-color: #ffc107;
			--alert-pulse-bg-color: #ffd700;
			color: black;
		}

		&.alert-error {
			--alert-bg-color: #dc3545;
			--alert-pulse-bg-color: #ff4d4d;
		}
	}

	@keyframes pulse {
		0% {
			background-color: var(--alert-bg-color, inherit);
		}
		12% {
			background-color: var(--alert-pulse-bg-color, inherit);
		}
		25% {
			background-color: var(--alert-bg-color, inherit);
		}
		100% {
			background-color: var(--alert-bg-color, inherit);
		}
	}
</style>
