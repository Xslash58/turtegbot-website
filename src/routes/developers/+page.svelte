<script lang="ts">
</script>

<svelte:head>
	<title>Developers | TurtegBot</title>
</svelte:head>

<main>
	<section class="options">
		<section class="option">
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path
					d="M4 5h9M8.5 3v2M6 5c.5 3 2.5 5.5 5.5 7M12 5c-.5 3-3 6-7.5 8M13 20l4-9 4 9M14.5 17h5"
				/>
			</svg>
			<h1>Translate</h1>
			<p>
				Help bring the bot to more people. Join our community on Crowdin and translate it into your
				language.
			</p>
			<a
				class="btn"
				href={'https://crowdin.com/project/turtegbot'}
				target="_blank"
				rel="noopener noreferrer">Start translating</a
			>
		</section>

		<section class="option">
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
			</svg>
			<h1>API Docs</h1>
			<p>Reference documentation for developers to integrate with our API.</p>
			<a class="btn" href={'/developers/badges'}>Read the docs</a>
		</section>
	</section>
</main>

<style lang="scss">
	main {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #101010;
		padding: 48px 24px;
	}

	.options {
		width: 100%;
		max-width: 1100px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 48px;
	}

	.option {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		svg {
			width: 40px;
			height: 40px;
			fill: none;
			stroke: #fff;
			stroke-width: 2;
			stroke-linecap: round;
			stroke-linejoin: round;
		}

		h1 {
			font-family: 'Inter', Arial, sans-serif;
			font-weight: 800;
			font-size: clamp(2rem, 4.4vw, 3.1rem);
			letter-spacing: -0.02em;
			line-height: 1.1;
			margin: 20px 0 22px;
		}

		p {
			max-width: 30em;
			margin: 0 0 28px;
			line-height: 1.6;
			color: #e6e6e6;
		}
	}

	.btn {
		background-color: #33ca00;
		color: white;
		text-decoration: none;
		padding: 8px 16px;
		border-radius: 5px;
		transition: background-color 0.15s ease;

		&:hover {
			background-color: #28a300;
		}

		&:focus-visible {
			outline: 2px solid #fff;
			outline-offset: 3px;
		}
	}

	@media (max-width: 760px) {
		.options {
			grid-template-columns: 1fr;
			gap: 64px;
		}
	}
</style>
