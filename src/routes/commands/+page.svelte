<script lang="ts">
	import { onMount } from 'svelte';

    const isWip = true;

	onMount(() => {
		console.log('Commands page mounted');
	});
</script>

<section class="commands">
    {#if !isWip}
	<section class="category">
		<details>
			<summary>
                <section class="name">
                    <img
                        src="https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3"
                        alt="Broadcaster Twitch Badge"
                    />
                    <h1>Broadcaster</h1>
                </section>
                <p>Commands available to channel broadcasters or high-powered users</p>
			</summary>
			
            <section class="command">
                <h2>setgame</h2>
                <p>Description of the command.</p>
            </section>
            <section class="command">
                <h2>settitle</h2>
                <p>Description of the command.</p>
            </section>
            <section class="command">
                <h2>othercommand</h2>
                <p>Description of the command.</p>
            </section>

		</details>
	</section>
    {:else}
    <section class="wip">
        <h1>This page is a Work In Progress.</h1>
        <p>You can check all available commands at:</p>
        <a href="https://github.com/Xslash58/TurtegBot/wiki" target="_blank">https://github.com/Xslash58/TurtegBot/wiki</a>
    </section>
    {/if}
</section>

<style lang="scss">
	section.commands {
		details {
			summary {
                position: relative;

                section.name {
                    display: flex;
                    align-items: center;
                    margin-left: 2.5em;
                    img {
                        margin-right: 0.5rem;
                        height: 32px;
                    }
                    h1 {
                        font-size: 1.5rem;
                        font-weight: bold;
                    }
                }

                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 15px;
                background-color: #272727;

                p {
                    margin-right: 2.5em;
                }

				&::before {
					content: '';
                    position: absolute;
					display: inline-block;
					width: 0.6em;
					height: 0.6em;
					margin-right: 1em;
					margin-left: 0.5em;
					border-right: 3px solid #fff;
					border-bottom: 3px solid #fff;
					transform: rotate(-45deg);
					transition: transform 0.2s;
				}
			}

            display: flex;
            flex-direction: column;

            section.command {
                display: flex;
                flex-direction: column;
                margin: 10px auto;

                background-color: #333;

                width: 99%;

                p, h2 {
                    margin: 0;
                }
            }
		}
		details[open] summary::before {
			transform: rotate(45deg) translateX(0.2em);
		}
	}

    section.wip {
        text-align: center;
        h1 {
            font-size: 1.75rem;
        }
        p {
            margin: 5px;
        }
        a {
            text-decoration: none;
        }
    }
</style>
