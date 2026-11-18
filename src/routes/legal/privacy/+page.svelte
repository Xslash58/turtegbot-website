<svelte:head>
	<title>Privacy Policy | TurtegBot</title>
</svelte:head>

<article class="privacy-policy">
	<h1>Privacy Policy</h1>
	<p class="updated">Last updated: November 16, 2026</p>

	<p>
		This Privacy Policy describes how TurtegBot (“we”, “us”, or “our”), operated as an independent
		software project, collects, uses, stores, and protects your information when you use the
		TurtegBot website, API (TurtegAPI), and chat bot services across supported platforms (such as
		Twitch and Kick).
	</p>

	<h2>1. Data Controller & Contact</h2>
	<p>
		TurtegBot is operated by an independent developer based in Poland. If you have any questions
		about this Privacy Policy or wish to exercise your data rights, you can contact us at:
	</p>
	<ul>
		<li>Email: support@xslash.ovh</li>
		<li>Discord: <a href="https://dc.xslash.ovh/" target="_blank">Xslash's Shellter</a></li>
	</ul>
	<p>
		(Please do not include passwords, OAuth tokens, or other sensitive credentials in your
		messages.)
	</p>

	<h2>2. Information We Collect and Process</h2>
	<h3>A. Account and profile information</h3>
	<p>
		When you sign in to the TurtegBot website via an authentication provider (such as Twitch or
		Kick), we collect and store basic account identifiers required to create and manage your
		profile, including:
	</p>
	<ul>
		<li>Platform user IDs, usernames, and display names;</li>
		<li>Profile image URLs;</li>
		<li>Assigned TurtegBot roles, permissions, and linked account associations.</li>
	</ul>

	<h3>B. Connected Accounts & OAuth Refresh Tokens</h3>
	<p>
		You may optionally link external accounts - such as Spotify or StreamElements - or grant
		elevated Twitch channel scopes (such as allowing the bot to manage VIPs, Moderators, or
		broadcast settings on your behalf).
	</p>
	<ul>
		<li>Standard website logins do not persist OAuth refresh tokens in our database.</li>
		<li>
			We only store OAuth refresh tokens in our database when you explicitly link an external
			integration or save elevated Twitch scope permissions.
		</li>
		<li>
			You can disconnect any linked account or revoke elevated scopes at any time via your TurtegBot
			account settings or directly through the respective third-party provider’s security settings.
		</li>
	</ul>

	<h3>C. Chat Processing vs. Command-Triggered Data</h3>
	<p>
		<b>Real-Time Chat Processing</b>: TurtegBot listens to and processes live chat messages in real
		time to detect bot commands and triggers. We do not log or permanently store general chat
		history.
	</p>
	<p>
		<b>Command & Feature Data</b>: When you actively invoke a bot command or use a website feature,
		we store the data necessary to fulfill that feature. Depending on what you use, this may
		include:
	</p>
	<ul>
		<li>Channel/room IDs, room settings, and webhook identifiers;</li>
		<li>Reminders, support tickets, AFK entries, and moderation actions;</li>
		<li>Media requests, queue history, and playback states;</li>
		<li>Loyalty settings, entitlements, badges, recap statistics, and store redemption codes.</li>
	</ul>
	<p>
		Please do not submit passwords, API keys, or sensitive personal data in reminders, tickets,
		media requests, or other free-text commands. Some command-generated content (such as active
		media queues, AFK statuses, or channel leaderboards) may be visible to other users or channel
		moderators.
	</p>

	<h3>D. Browser Storage (Local Storage)</h3>
	<p>
		The TurtegBot website does not use advertising or tracking cookies. Instead, it uses your
		browser’s localStorage strictly for essential functionality and user preferences:
	</p>
	<ul>
		<li>Storing your TurtegBot authentication token to keep you signed in;</li>
		<li>
			Temporarily holding OAuth/PKCE state parameters (such as return paths, requested scopes, and
			code verifiers) during login flows;
		</li>
		<li>
			Saving local UI preferences (such as dismissed alerts and media-request overlay/display
			states).
		</li>
	</ul>
	<p>Clearing your browser’s local storage will sign you out and reset these local preferences.</p>

	<h3>E. Technical & Infrastructure Logs</h3>
	<p>
		When you access our website or API, our servers and infrastructure providers automatically
		process standard technical metadata, such as your IP address, browser/user-agent string, request
		timestamps, and error logs. This data is used solely to route traffic, prevent abuse (such as
		DDoS mitigation), and diagnose technical issues.
	</p>

	<h2>3. How and Why We Use Information (Legal Basis)</h2>
	<p>
		Under the EU General Data Protection Regulation (GDPR), we process your information on the
		following legal bases:
	</p>
	<ul>
		<li>
			Performance of a Contract / Service Delivery (Art. 6(1)(b) GDPR): To authenticate your
			account, execute chat commands, manage channel settings, run media request queues, and sync
			linked integrations.
		</li>
		<li>
			Legitimate Interests (Art. 6(1)(f) GDPR): To secure our infrastructure, prevent spam and
			abuse, debug errors, and maintain aggregated/anonymized service statistics.
		</li>
		<li>
			Consent (Art. 6(1)(a) GDPR): When you voluntarily connect third-party services (Spotify,
			StreamElements) or authorize optional Twitch channel management scopes.
		</li>
	</ul>

	<h2>4. Third-Party Services & Data Sharing</h2>
	<p>
		We do not sell, rent, or trade your personal information. We only share or exchange data with
		third parties to the extent required to operate the service:
	</p>
	<ul>
		<li>
			<b>Connected Platforms & Integrations</b>: Twitch, Kick, Spotify, StreamElements and 7TV,
			strictly according to the features and scopes you authorize.
		</li>
		<li>
			<b>Embedded Media & Web Resources</b>: YouTube (when loading or playing requested videos in
			the media player/overlay) and Google Fonts (for website typography). Loading these resources
			allows those providers to receive standard browser request data (such as your IP address).
		</li>
		<li>
			<b>Infrastructure & Hosting Providers</b>: Our server hosting and network security/proxy
			providers (such as Cloudflare) that process traffic on our behalf.
		</li>
	</ul>

	<h2>5. Data Retention and Anonymization</h2>
	<p>
		<b>Active Data</b>: Account profiles, linked tokens, and channel configurations are retained for
		as long as your account or channel remains active on TurtegBot.
	</p>
	<p>
		<b>Deletion & Anonymization</b>: When you disconnect an integration or request account deletion,
		we delete your personal profile identifiers and stored OAuth refresh tokens. Certain historical
		or statistical records (such as anonymized usage metrics, recap aggregates, or non-identifying
		system logs) may be retained in anonymized form without any association to your identity.
	</p>

	<h2>6. Your Rights Under GDPR</h2>
	<p>Depending on your location (including within the EEA/UK), you have the right to:</p>
	<ul>
		<li>Access the personal data we hold about your account;</li>
		<li>Rectify inaccurate account information;</li>
		<li>Erase your personal data (“right to be forgotten”);</li>
		<li>Restrict or object to certain types of processing;</li>
		<li>Withdraw consent at any time by unlinking accounts or revoking OAuth permissions.</li>
	</ul>
	<p>
		To submit a privacy request, email support@xslash.ovh with your platform username/ID and the
		specific action you are requesting. We may ask you to verify ownership of the account before
		fulfilling the request.
	</p>

	<h2>7. Age Requirement</h2>
	<p>
		TurtegBot is not intended for individuals under the minimum age required to hold an account on
		Twitch, Kick, or other integrated platforms (typically 13 years or older, or higher depending on
		local law). We do not knowingly collect data from children below these thresholds.
	</p>

	<h2>8. Changes to This Policy</h2>
	<p>
		We may update this Privacy Policy from time to time to reflect new features or legal
		requirements. Any changes will be posted on this page with an updated “Last updated” date.
	</p>
</article>

<style lang="scss">
	.privacy-policy {
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

		h3 {
			margin-top: 1.5rem;
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
