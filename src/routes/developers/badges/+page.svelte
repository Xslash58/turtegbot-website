<script lang="ts">
	import { GetBadges } from '$lib/API/Badges';

    // only added badges bc only endpoint i know you have "public"; i can add more if needed :)
	const curlExample = `curl https://turteg-api.xslash.voh/v1/ffz/badges`;

	const jsExample = `const res = await fetch('https://turteg-api.xslash.voh/v1/ffz/badges');
const { badges } = await res.json();

for (const badge of badges) {
  console.log(badge.title, badge.users.length);
}`;

	const responseExample = `{
  "badges": [
    {
      "id": "badge:translator",
      "title": "TurtegBot Translator",
      "image": "https://i.xslash.ovh/turtegbot/badges/translator/4x.webp",
      "urls": {
        "1": ".../translator/1x.webp",
        "2": ".../translator/2x.webp",
        "3": ".../translator/3x.webp",
        "4": ".../translator/4x.webp"
      },
      "svg": false,
      "users": ["417960847", "600740549"]
    }
  ]
}`;

	const fields = [
		['id', 'string', 'Unique badge ID, for example badge:translator.'],
		['title', 'string', 'Display name of the badge.'],
		['image', 'string', 'URL of the largest (4x) image.'],
		['urls', 'object', 'Image URLs by scale: 1, 2, 3 and 4.'],
		['svg', 'boolean', 'Whether the image is an SVG.'],
		['users', 'string[]', 'IDs of the users who have this badge.']
	];

	let result = $state('');
	let loading = $state(false);

	async function tryIt() {
		loading = true;
		result = '';
		try {
			const badges = await GetBadges();
			result = badges
				? JSON.stringify({ badges }, null, 2)
				: 'Request failed. Check the console for details.';
		} catch (e) {
			result = e instanceof Error ? e.message : 'Request failed';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Badges API | TurtegBot</title>
</svelte:head>

<main>
	<article>
		<h1>Badges</h1>
		<p class="intro">Fetch TurtegBot badges from contributors, translators, etc.</p>

		<section class="endpoint">
			<span class="method">GET</span>
			<code>/v1/ffz/badges</code>
		</section>

		<h2>Example request</h2>
		<h3>cURL</h3>
		<pre><code>{curlExample}</code></pre>
		<h3>JavaScript</h3>
		<pre><code>{jsExample}</code></pre>

		<h2>Example response</h2>
		<pre><code>{responseExample}</code></pre>

		<h2>Fields</h2>
		<section class="table-wrapper">
			<table>
				<thead>
					<tr><th>Field</th><th>Type</th><th>Description</th></tr>
				</thead>
				<tbody>
					{#each fields as [name, type, description]}
						<tr><td><code>{name}</code></td><td>{type}</td><td>{description}</td></tr>
					{/each}
				</tbody>
			</table>
		</section>

		<h2>Try it</h2>
		<button class="btn" onclick={tryIt} disabled={loading}>
			{loading ? 'Sending...' : 'Send request'}
		</button>
		{#if result}
			<pre class="result"><code>{result}</code></pre>
		{/if}
	</article>
</main>

<style lang="scss">
	main {
		flex: 1;
		background-color: #101010;
		display: flex;
		justify-content: center;
		padding: 40px 24px;
	}

	article {
		width: 100%;
		max-width: 800px;
		min-width: 0;
	}

	h1 {
		font-family: 'Inter', Arial, sans-serif;
		font-weight: 800;
		font-size: 2.5rem;
		margin: 0 0 8px;
	}

	h2 {
		margin: 40px 0 12px;
		font-size: 1.4rem;
	}

	h3 {
		margin: 16px 0 8px;
		font-size: 1rem;
		color: #cfcfcf;
	}

	.intro {
		color: #e6e6e6;
		margin: 0 0 24px;
	}

	.endpoint {
		display: flex;
		align-items: center;
		gap: 12px;
		background-color: #181818;
		padding: 12px 16px;
		border-radius: 5px;

		.method {
			background-color: #33ca00;
			color: #101010;
			font-weight: 700;
			font-size: 0.85rem;
			padding: 3px 8px;
			border-radius: 4px;
		}

		code {
			font-family: monospace;
			font-size: 1rem;
		}
	}

	pre {
		background-color: #181818;
		padding: 16px;
		border-radius: 5px;
		overflow-x: auto;
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	pre.result {
		margin-top: 16px;
		max-height: 400px;
		overflow: auto;
	}

	.table-wrapper {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		background-color: #181818;
		border-radius: 5px;

		th,
		td {
			text-align: left;
			padding: 10px 14px;
			border-bottom: 1px solid #282828;
		}

		th {
			color: #cfcfcf;
			font-weight: 500;
		}

		tr:last-child td {
			border-bottom: none;
		}

		td code {
			color: #33ca00;
		}
	}

	.btn {
		background-color: #33ca00;
		color: white;
		border: none;
		padding: 8px 16px;
		border-radius: 5px;
		cursor: pointer;
		font-size: 0.95rem;

		&:hover:not(:disabled) {
			background-color: #28a300;
		}

		&:disabled {
			opacity: 0.6;
			cursor: default;
		}

		&:focus-visible {
			outline: 2px solid #fff;
			outline-offset: 3px;
		}
	}
</style>
