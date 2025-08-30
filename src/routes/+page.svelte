<script lang="ts">
	import { goto } from '$app/navigation';
    import egLogo from '$lib/assets/eg-branding.png';
    import ghLogo from '$lib/assets/github-mark-white.png';

    function checkItOut(category: string) {
        goto(`/commands#${category}`);
    }
</script>

<main>
	<section class="block1">
		<h1>Welcome to TurtegBot</h1>
		<p>General utility and fun chatbot</p>
	</section>
	<section class="block2">
		<h1>What does it do?</h1>
		<p>
			Global Economy, 7TV Integration, AFK, Fun, Moderation...
            <br />
            These are only some of the categories:
		</p>
        <section class="modules">
            <section class="module">
                <section class="title">
                    <h2>Global Economy</h2>
                    <hr>
                </section>
                <p>
                    A global economy system where you can earn and spend points, gamble, and more.
                </p>
                <button on:click={() => checkItOut('economy')}>Check it out!</button>
            </section>
            <section class="module">
                <section class="title">
                    <h2>7TV</h2>
                    <hr>
                </section>
                <p>
                    Integration with 7TV allows you to manage your emotes, editors, cosmetics and sets without leaving platform of your choice.
                </p>
                <button on:click={() => checkItOut('7tv')}>Check it out!</button>
            </section>
            <section class="module">
                <section class="title">
                    <h2>AFK/Reminders</h2>
                    <hr>
                </section>
                <p>
                    Allow your viewers to set reminders for themselves/others and track their AFK status.
                </p>
                <button on:click={() => checkItOut('misc')}>Check it out!</button>
            </section>
            <section class="module">
                <section class="title">
                    <h2>Moderation</h2>
                    <hr>
                </section>
                <p>
                    Tools to help manage your Twitch chat and keep it safe and enjoyable for everyone.
                </p>
                <button on:click={() => checkItOut('moderation')}>Check it out!</button>
            </section>
            
            <section class="module">
                <section class="title">
                    <h2>Fun</h2>
                    <hr>
                </section>
                <p>
                    Tons of fun, engaging and data-driven commands. Making your chat more active even when offline!
                </p>
                <button on:click={() => checkItOut('fun')}>Check it out!</button>
            </section>
        </section>
	</section>
    <section class="block3">
        <h1>Other Projects</h1>
        <section class="projects">
            <a href="https://xslash.itch.io/emoteguesser">
                <section class="img-wrapper">
                    <img src={egLogo} alt="EmoteGuesser Logo" />
                </section>
                <p>EmoteGuesser</p>
            </a>
            <a href="https://github.com/Xslash58">
                <section class="img-wrapper">
                    <img src={ghLogo} alt="GitHub Logo" />
                </section>
                <p>More</p>
            </a>
        </section>
    </section>
</main>

<style lang="scss">
    main {
        > section {
            margin: 0 0 0 0;
        }
    }
	.block1 {
		background-color: #33ca00;
		height: 200px;
        
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        clip-path: polygon(0 100%, 100% 85%, 100% 0, 0 0);

        * {
            margin: 5px;
        }
	}
	.block2 {
		background-color: #101010;
        display: flex;
        align-items: center;
        flex-direction: column;

        p {
            margin: 0;
            text-align: center;
        }

        section.modules {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: stretch;
            flex-wrap: wrap;
            gap: 20px;
            margin: 10px 0 20px 0;
            width: 100%;
            min-height: 200px;

            section.module {
                background-color: #181818;
                padding: 10px;
                border-radius: 5px;
                width: 200px;
                text-align: center;

                display: flex;
                flex-direction: column;
                justify-content: space-between;

                hr {
                    width: 100%;
                }

                h2 {
                    margin: 0;
                    font-size: 1.2rem;
                }

                button {
                    background-color: #33ca00;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 5px;
                    cursor: pointer;

                    &:hover {
                        background-color: #28a300;
                    }
                }
            }
        }
	}

    .block3 {
        background-color: #101010;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        section.projects {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin: 10px 0 20px 0;
            height: 100px;
        }
        a {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            
            text-decoration: none;
            color: gray;
            
            .img-wrapper {
                flex-grow: 1;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            p {
                margin: 0;
            }
        }
        img {
            max-height: 65px;
            max-width: 256px;
            height: auto;
        }
    }
</style>
