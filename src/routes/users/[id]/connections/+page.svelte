<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import LoadingIndicator from '../../../../components/LoadingIndicator.svelte';
	import kickLogo from '$lib/assets/KickLogo.svg';
	import twitchLogo from '$lib/assets/glitch_flat_white.svg';
	import { DeleteUserConnection, GetUserConnections } from '$lib/API/Users';
	import { goto } from '$app/navigation';
	import { profileUser } from '$lib/stores/userStore';
	import type { User } from '$lib/API/Models/Users';
	import { confirmationDialog } from '$lib/stores/modalStore';

	let userId: string = $state(page.params.id || '');
	let user: User | null = $profileUser;
	let isLoaded: boolean = $state(false);

    let connections: string[] | undefined = $state(undefined);

    let availableConnections: [string, string][] = $state([
        ['StreamElements', 'https://cdn.brandfetch.io/idj4DI2QBL/w/400/h/400/theme/dark/icon.png'],
        ['Spotify', 'https://cdn.brandfetch.io/spotify.com/symbol'],
		['Twitch', twitchLogo],
		['Kick', kickLogo],
    ]);

	onMount(async () => {
		console.log('Connections page mounted for user:', userId);
        connections = (await GetUserConnections(userId))?.connections;
		isLoaded = true;
	});

    function handleLinkClick(connection: string, forced: boolean = false) {
		if((connection == 'Twitch' || connection == 'Kick') && !forced)
		{
			confirmationDialog.set({
				visible: true,
				text: `Are you sure you want to link your ${connection} account?
				If you’ve previously used the bot on ${connection}, all data linked to that account (turtles, reminders, etc.)
				will be replaced with your current user data.`,
				onConfirm: () => {
					handleLinkClick(connection, true);
				}
			});
			return;
		}
        console.log(`Linking ${connection}...`);
        
        goto(`/auth/${connection.toLowerCase()}/link`, {
            replaceState: true
        });
    }

    function handleUnlinkClick(connection: string) {
        console.log(`Unlinking ${connection}...`);
        
        DeleteUserConnection(userId, connection.toLowerCase())
            .then(() => {
                console.log(`${connection} unlinked successfully.`);
                connections = connections?.filter(conn => conn !== connection.toLowerCase());
            })
            .catch(error => {
                console.error(`Failed to unlink ${connection}:`, error);
            });
    }
</script>

<section class="connections">
	{#if isLoaded}
    {#each availableConnections as [name, icon]}
        <section class="connection">
            <section class="branding">
                <img src={icon} alt="{name} logo" />
                <p>{name}</p>
            </section>
            <nav>
                {#if connections && connections.includes(name.toLowerCase())
				|| (name == 'Twitch' && user?.twitchId != "0")
				|| (name == 'Kick' && user?.kickId != "0")}
                    <button class="danger" onclick={() => handleUnlinkClick(name)} disabled={name == 'Twitch' || name == 'Kick'}>Unlink</button>
                    <button class="warning" onclick={() => handleLinkClick(name)} disabled={name == 'Twitch' || name == 'Kick'}>Re-link</button>
					{#if name == 'Twitch'}
					<button class="nointeract">{user?.twitchLogin}</button>
					{:else if name == 'Kick'}
					<button class="nointeract">{user?.kickLogin}</button>
					{/if}	
                {:else}
                    <button onclick={() => handleLinkClick(name)}>Link</button>
                {/if}
            </nav>
        </section>
    {/each}
	{:else}
		<LoadingIndicator />
	{/if}
</section>

<style lang="scss">
	section.connections {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		gap: 10px;

		background-color: #101010;
		padding: 10px;
		border-radius: 10px;

		section.connection {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			flex-wrap: wrap;

			background-color: #191919;
			padding: 5px 20px 5px 20px;
			border-radius: 10px;

			width: 40%;

			p {
				color: white;
				font-size: 1.2em;
				margin-bottom: 10px;
			}

			.branding {
				display: flex;
				align-items: center;
				gap: 10px;

				img {
					width: 40px;
					height: 40px;
					border-radius: 5px;
				}
			}

			nav {
				display: flex;
				column-gap: 5px;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				
				button {
					background-color: #4caf50;
					color: white;
					padding: 10px 20px;
					border: none;
					border-radius: 5px;
					cursor: pointer;

					&:hover {
						background-color: #45a049;
					}

					&.danger {
						background-color: #f44336;

						&:hover {
							background-color: #d32f2f;
						}
					}
					&.warning {
						background-color: #ff9800;

						&:hover {
							background-color: #f57c00;
						}
					}

					&:disabled {
						display: none;
						background-color: #9e9e9e;
						cursor: not-allowed;

						&:hover {
							background-color: #9e9e9e;
						}
					}
					&.nointeract {
						background-color: #303030;
						color: white;
						cursor: default;
						min-width: 165px;
					}
				}
			}
		}
		@media (max-width: 768px) {
			section.connection {
				width: 100%;

				justify-content: center;
				flex-direction: column;

				.branding {
					flex-direction: column;
					align-items: center;
					gap: 0;
					* {
						margin: 0;
					}
				}
				p {
					font-size: 1rem;
				}
			}
		}
	}
</style>
