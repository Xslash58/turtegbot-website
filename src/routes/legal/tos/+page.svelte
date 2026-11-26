<svelte:head>
	<title>Terms of Service | TurtegBot</title>
</svelte:head>

<article class="terms-of-service">
	<h1>Terms of Service</h1>
	<p class="updated">Last updated: November 18, 2026</p>

	<p>
		These Terms of Service (“Terms”) govern your access to and use of the TurtegBot website, API
		(TurtegAPI), and chat bot services across supported platforms such as Twitch and Kick
		(collectively, the “Service”). By signing in to the website, adding TurtegBot to your channel,
		or interacting with the bot in chat, you agree to be bound by these Terms.
	</p>

	<h2>1. Description of the Service</h2>
	<p>
		TurtegBot is a free, independent, hobbyist software project providing chat utilities, channel
		management tools, media request queues, incoming webhooks, loyalty/recap features, and
		third-party integrations for streamers and viewers. The Service is provided free of charge with
		no paid tiers or monetization.
	</p>

	<h2>2. Eligibility & Platform Compliance</h2>
	<p>
		You must meet the minimum age requirement to hold an account on Twitch, Kick, or any other
		platform you connect to the Service.
	</p>
	<p>
		Your use of TurtegBot must comply with the Terms of Service and Community Guidelines of Twitch,
		Kick, YouTube, Spotify, StreamElements, 7TV, and any other integrated third-party platform.
	</p>

	<h2>3. Channel Permissions & Integrations</h2>
	<p>
		<b>Elevated Scopes:</b> If you grant TurtegBot optional elevated permissions (such as managing Twitch
		VIPs, Moderators, or broadcast settings) or connect third-party accounts (such as Spotify or StreamElements),
		you authorize the Service to perform actions on your behalf strictly within the features you configure.
	</p>
	<p>
		<b>Custom Webhooks:</b> You are responsible for keeping your custom incoming webhook identifiers confidential.
		Any messages or triggers sent using your webhook identifier are treated as authorized by you.
	</p>

	<h2>4. User Content, Media Requests & Responsibility</h2>
	<p>
		<b>User Responsibility:</b> Broadcasters, channel moderators, and end users are solely responsible
		for all text, commands, webhook payloads, links, and media (including YouTube videos) submitted, queued,
		or displayed through TurtegBot.
	</p>
	<p>
		<b>Copyright & DMCA:</b> TurtegBot acts solely as a technical pass-through tool for media request
		queues and overlays. We do not host, monitor, or pre-screen requested media. Channel owners are responsible
		for ensuring that queued audio and video content complies with applicable copyright laws (such as
		DMCA) and streaming platform rules. TurtegBot is not liable for channel strikes, takedowns, or account
		suspensions resulting from user-submitted content or media requests.
	</p>

	<h2>5. Acceptable Use & Restrictions</h2>
	<p>When using the Service, you agree not to:</p>
	<ul>
		<li>
			Spam commands, flood chat, or attempt to bypass rate limits, cooldowns, or channel/global
			blocks;
		</li>
		<li>
			Exploit bugs, vulnerabilities, or unintended behavior in the bot, website, or TurtegAPI;
		</li>
		<li>
			Abuse incoming webhooks, media queues, or free-text features (such as reminders or tickets) to
			send malicious payloads, harassment, or illegal content;
		</li>
		<li>
			Scrape, reverse-engineer, disrupt, or place an unreasonable load on our servers or
			infrastructure;
		</li>
		<li>
			Sell, resell, rent, lease, sublicense, or commercially exploit any portion of the Service,
			access to the bot, custom webhooks, or in-bot entitlements/redemption codes.
		</li>
	</ul>

	<h2>6. Suspension and Termination of Access</h2>
	<p>
		We reserve the right, in our sole discretion, to restrict, suspend, or permanently terminate
		your access to TurtegBot (including applying channel-level or global blocks, revoking webhook
		identifiers, or removing the bot from your channel) at any time, for any reason or no reason,
		with or without prior notice.
	</p>
	<p>
		You may stop using the Service at any time by removing TurtegBot from your channel,
		disconnecting linked accounts in your dashboard, and revoking OAuth access through your Twitch,
		Kick, or other third-party account settings.
	</p>

	<h2>7. Disclaimer of Warranties (“As Is”)</h2>
	<p>
		Because TurtegBot is an independent hobbyist project, the Service is provided on an “AS IS” and
		“AS AVAILABLE” basis without warranties of any kind, whether express or implied. We do not
		guarantee uninterrupted uptime, error-free operation, permanent retention of channel
		settings/statistics, or compatibility with future third-party API changes.
	</p>

	<h2>8. Limitation of Liability</h2>
	<p>
		To the fullest extent permitted by applicable law, the operator of TurtegBot shall not be liable
		for any indirect, incidental, consequential, or special damages, loss of data, loss of stream
		revenue, or platform account penalties arising out of or related to your use of - or inability
		to use - the Service.
	</p>

	<h2>9. Changes to These Terms</h2>
	<p>
		We may modify these Terms at any time to reflect changes in the Service or legal requirements.
		Updated Terms will be posted on this page with a revised “Last updated” date. Continued use of
		TurtegBot after changes are posted constitutes acceptance of the updated Terms.
	</p>

	<h2>10. Governing Law & Contact</h2>
	<p>
		These Terms are governed by and construed in accordance with the laws of Poland, without regard
		to conflict-of-law principles.
	</p>
	<p>If you have questions regarding these Terms, you can reach us at:</p>
	<ul>
		<li>Email: <a href="mailto:support@xslash.ovh">support@xslash.ovh</a></li>
		<li>Discord: <a href="https://dc.xslash.ovh/" target="_blank">Xslash's Shellter</a></li>
	</ul>
</article>

<style lang="scss">
	.terms-of-service {
		width: min(900px, calc(100% - 32px));
		margin: 2rem auto 3rem;
		line-height: 1.6;
		color: #f2f2f2;

		h1 {
			margin-bottom: 0.25rem;
		}

		h2 {
			margin-top: 2rem;
			color: #40ff00;
		}

		.updated {
			color: #bdbdbd;
			margin-top: 0;
		}

		li {
			margin: 0.4rem 0;
		}
	}
</style>
