<script lang="ts">
	import { onMount } from 'svelte';
	import UserSearch from '../../../components/users/UserSearch.svelte';
	import type { SearchUser, User } from '$lib/API/Models/Users';
	import { GetUserPage } from '$lib/API/Users';
    import KickLogo from '$lib/assets/KickLogo.svg';
    import TwitchLogo from '$lib/assets/glitch_flat_white.svg';
	import { goto } from '$app/navigation';
	import { PatchUser } from '$lib/API/Admin';

    let selectedUser: User | null = $state(null);

    let userKickId: number = $state(0);
    let userTwitchId: number = $state(0);

	onMount(() => {
		console.log('Users page mounted');
	});

    async function GetProperUser(suser: SearchUser | null) {
        if(!suser) return;

        let user = await GetUserPage(suser.ID + "");
        if(user) {
            selectedUser = user.user;
            if(selectedUser == null) return;
            userKickId = Number(selectedUser.kickId) ?? 0;
            userTwitchId = Number(selectedUser.twitchId) ?? 0;
        }
        else {
            selectedUser = null;
            userKickId = 0;
            userTwitchId = 0;
        }

    }
    async function ApplyUserChanges() {
        if(!selectedUser) return;

        const updatedUser: Partial<User> = {
            kickId: userKickId != 0 ? userKickId + "" : undefined,
            twitchId: userTwitchId != 0 ? userTwitchId + "" : undefined
        };

        const success = await PatchUser(selectedUser.id, updatedUser);
        if(success) {
            console.log('User updated successfully');
        } else {
            console.error('Failed to update user');
        }
    }
</script>

<section class="users">
    <section class="settings">
        <label>
            User: <UserSearch onSelect={user => GetProperUser(user)} />
        </label>
    </section>

    {#if selectedUser}
        <section class="panel">
            <section class="title">
                <img src={selectedUser.profile_image_url} alt="User Avatar">
                <h1>User Details for {selectedUser.display_name}</h1>
            </section>
            <section class="user-data">
                <p><strong>ID:</strong> {selectedUser.id}</p>
                <p><strong>Display Name:</strong> {selectedUser.display_name}</p>
                <p><strong>Twitch Username:</strong> {selectedUser.twitchLogin ?? 'N/A'}</p>
                <p><strong>Kick Username:</strong> {selectedUser.kickLogin ?? 'N/A'}</p>
                <p><strong>Profile Picture:</strong> <a href={selectedUser.profile_image_url ?? '#'} target="_blank">View</a></p>
                <p><strong>Rooms:</strong> {Object.values(selectedUser.roomIds).join(', ')}</p>
                <p><strong>Role:</strong> {selectedUser.role.name} (Power: {selectedUser.role.power})</p>
                <p><strong>Flags:</strong> {selectedUser.flags.join(', ')}</p>
                <p><strong>SE Points Name:</strong> {selectedUser.streamElementsData.pointsName ?? 'N/A'}</p>
            </section>

            <section class="connections">
                    <label>
                        <img src={KickLogo} alt="Kick" />
                        <input type="number" placeholder="Kick ID..." bind:value={userKickId}>
                    </label>
                    <label>
                        <img src={TwitchLogo} alt="Twitch" />
                        <input type="number" placeholder="Twitch ID..." bind:value={userTwitchId}>
                    </label>
            </section>

            <section class="actions">
                <button onclick={() => {goto(`/users/${selectedUser?.id}`)}}>Go to Profile</button>
                <button disabled>Global Ban</button>
                <button onclick={() => {ApplyUserChanges()}}>Save Changes</button>
            </section>
        </section>
    {:else}
        <section class="panel">
            <h1>Please select a user to view their details.</h1>
        </section>
    {/if}
</section>

<style lang="scss">
    .users {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .settings {
            background: #191919;
            padding: 1rem;
            border-radius: 5px;
        }

        .panel {
            background: #101010;
            padding: 1rem;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            column-gap: 10px;
            row-gap: 5px;

            section.title {
                width: 100%;

                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 5px;

                > img {
                    width: 24px;
                }
    
                h1 {
                    font-size: 1.5rem;
                    margin: 0;
                }
            }

            section.user-data {
                background-color: #202020;
                width: 350px;

                p {
                    margin: 0.5rem 0;
                }
            }

            section.connections {
                display: flex;
                flex-direction: column;
                gap: 5px;
                label {
                    display: flex;
                    align-items: center;
                    img {
                        width: 24px;
                        height: 24px;
                        margin-right: 5px;
                    }
                    input {
                        color: white;
                        padding: 0;
                        height: 24px;
                    }
                }
            }

            section.actions {
                display: flex;
                flex-direction: column;
                flex-wrap: wrap;
            }
        }
    }
</style>