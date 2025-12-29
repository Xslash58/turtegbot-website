<script lang="ts">
	import type { Recap, RoomRecap } from '$lib/API/Models/Recap';
	import type { User } from '$lib/API/Models/Users';
	import { GetRoomRecap, GetUserRecap } from '$lib/API/Recap';
	import { myUser } from '$lib/stores/userStore';
	import { onMount } from 'svelte';
	import LoadingIndicator from '../../../components/LoadingIndicator.svelte';
	import { goto } from '$app/navigation';

	let user: User | null = null;
	let userRecap: Recap | null = null;
	let roomRecap: RoomRecap | null = null;

	let isLoading = true;

	let category = -1;

	myUser.subscribe((value) => {
		if (value) user = value;
		if (value && window) {
			GetUserRecap(value.id).then((recap) => {
				userRecap = recap;
				console.log('User Recap:', userRecap);

				isLoading = false;
			});
			if (Object.keys(value.roomIds).length > 0 && Object.keys(value.roomIds).includes('TWITCH')) {
				const roomId = value.roomIds['TWITCH'];
				GetRoomRecap(roomId).then((recap) => {
					roomRecap = recap;
					console.log('Room Recap:', roomRecap);
				});
			}
		}
	});

	onMount(() => {
		console.log('Recap page mounted');

		if (!import.meta.env.VITE_RECAPS || import.meta.env.VITE_RECAPS == '0') {
			goto('/');
			return;
		}

		isLoading = false;
	});
</script>

<section class="recap">
	<section class="fake-background"></section>

	<section class="wall-of-text welcome">
		{#if user}
			<h2>Welcome back, <span style="color:{user?.role.color}">{user?.display_name}</span></h2>
		{/if}
		<h1>TurtegBot Recap 2025</h1>
		<p>Let's dive into your year with TurtegBot</p>
	</section>
	<section class="categories">
		<button
			on:click={() => (category = 0)}
			style="background-color: {category === 0 ? 'red' : ''}"
			disabled={!roomRecap}>Channel</button
		>
		<button
			on:click={() => (category = 1)}
			style="background-color: {category === 1 ? 'red' : ''}"
			disabled={!user}>User</button
		>
		<button on:click={() => (category = 2)} style="background-color: {category === 2 ? 'red' : ''}"
			>Community</button
		>
	</section>

	{#if isLoading}
		<LoadingIndicator />
	{:else if !userRecap && category === 1}
		<section class="wall-of-text">
			<h1>No Recap Available</h1>
			<h2>It seems like you don't have any Recap data for 2025.</h2>
			<p>
				You had to use TurtegBot in 2025 in order to have a Recap. But don't worry, keep using the
				bot and you'll get one next year!
			</p>
		</section>
	{:else if category === -1}
		{#if (userRecap || roomRecap) && user}
			<section class="wall-of-text">
				<h1>Select a Recap Category</h1>
				<h2>Please choose a category above to view your 2025 Recap.</h2>
			</section>
		{/if}

		{#if !userRecap && !roomRecap && user}
			<section class="wall-of-text">
				<h1>No Recap Available</h1>
				<h2>It seems like you don't have any Recap data for 2025.</h2>
				<p>
					You had to use TurtegBot in 2025 at least once in order to have a Recap. But don't worry,
					keep using the bot and you'll get one next year!
				</p>
				<p>For now, feel free to explore the community Recap.</p>
			</section>
		{/if}

		{#if !user}
			<section class="wall-of-text">
				<h1>Please Log In</h1>
				<h2>You need to be logged in to view your personal Recaps.</h2>
			</section>
		{/if}
	{:else if category === 0 && roomRecap}
		<section class="recap-creator">
			<section class="users-spotlight">
				<h2>Top Users</h2>
				<section class="users-list">
					{#each roomRecap?.top_users as user}
						<section class="user">
							<p>{user.username}</p>
							<p class="bottom">Uses: {user.uses}</p>
						</section>
					{/each}
				</section>
			</section>

			<section class="achievements">
				<section class="achievement">
					<p id="title">Commands Executed</p>
					<p>{roomRecap?.commands_executed}</p>
				</section>
				<section class="achievement">
					<p id="title">Unique Users</p>
					<p>{roomRecap?.unique_users}</p>
				</section>
			</section>

			<section class="tier-commands">
				<h2>Most Used Commands:</h2>
				{#each roomRecap?.top_commands as cmd}
					<section class="command">
						<p>{cmd.command}</p>
						<p>{cmd.uses}</p>
					</section>
				{/each}
			</section>

			<section class="seventv">
				<section class="text">
					<h2>7TV</h2>
					<p>One of the most used feature in the entire bot!</p>
				</section>
				<section class="achievement">
					<p id="title">Total actions</p>
					<p>{roomRecap?.total_7tv_actions}</p>
				</section>
				<section class="achievement">
					<p id="title">Emotes Actions</p>
					<p>{roomRecap?.emote_actions}</p>
				</section>
				<section class="achievement">
					<p id="title">Presence Updates</p>
					<p>{roomRecap?.presence_updates}</p>
				</section>
				<section class="achievement">
					<p id="title">Cosmetics Changed</p>
					<p>{roomRecap?.cosmetic_changes}</p>
				</section>
			</section>

			<section class="reminders">
				<section class="text">
					<h2>Reminders</h2>
					<p>A year of staying on top of things!</p>
				</section>
				<section class="achievements">
					<section class="achievement">
						<p id="title">Total</p>
						<p>{roomRecap?.reminders_total}</p>
					</section>
				</section>
				<section class="user-stats">
					<section class="remind-user">
						<h2>Most Reminders Sent by</h2>
						<section class="achievement">
							<p>{roomRecap?.reminders_top_sender?.username}</p>
						</section>
						<p>Count: {roomRecap?.reminders_top_sender?.count}</p>
					</section>
					<section class="remind-user">
						<h2>Most Reminders Received by</h2>
						<section class="achievement">
							<p>{roomRecap?.reminders_top_receiver?.username}</p>
						</section>
						<p>Count: {roomRecap?.reminders_top_receiver?.count}</p>
					</section>
				</section>
			</section>

			<section class="monthly-usage">
				<section class="text">
					<h2>Monthly Usage</h2>
					<p>Here's how the usage was distributed throughout the year.</p>

					<svg viewBox="0 0 600 300" style="width:100%;max-width:800px;height:auto;">
						{#each Array(9) as _, monthIndex}
							{@const monthNames = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
							{@const key = String(monthIndex + 4).padStart(2, '0')}
							{@const value = roomRecap?.monthly_usage?.[key] ?? 0}
							{@const maxValue = Math.max(...Object.values(roomRecap?.monthly_usage ?? {}), 1)}
							{@const height = (value / maxValue) * 200}
							{@const x = 50 + monthIndex * 60}
							{@const isBest = value === maxValue && value > 0}

							<rect
								{x}
								y={250 - height}
								width="40"
								{height}
								fill={isBest ? '#00eaff' : '#beff00'}
								rx="5"
							/>
							<text x={x + 20} y="270" text-anchor="middle" font-size="12" fill="white">
								{monthNames[monthIndex]}
							</text>
							{#if value > 0}
								<text x={x + 20} y={240 - height} text-anchor="middle" font-size="11" fill="white">
									{value}
								</text>
							{/if}
						{/each}
					</svg>
				</section>
			</section>

			<section class="thankyou">
				<section class="wall-of-text">
					<h1>Thank You!</h1>
					<h2>We appreciate you being part of the TurtegBot Community in 2025.</h2>
					<p>Hope to see you and your chat next year!</p>
				</section>
			</section>
		</section>
		<p>Generated: {roomRecap?.generated_at.toLocaleString()}</p>
	{:else if category === 1 && userRecap}
		<section class="recap-user">
			<section class="achievements">
				<section class="achievement">
					<p id="title">Commands Executed</p>
					<p>{userRecap?.total_commands}</p>
				</section>
				<section class="achievement">
					<p id="title">Days using bot</p>
					<p>{userRecap?.active_days}</p>
				</section>
				<section class="achievement">
					<p id="title">Used in channels</p>
					<p>{userRecap?.used_channels}</p>
				</section>
			</section>

			<section class="best-room">
				<h2>Your Top Channel</h2>
				<section class="achievement">
					<p>{userRecap?.top_channel}</p>
				</section>
				<p>Commands Used: {userRecap?.top_channel_commands}</p>
			</section>

			<section class="tier-commands">
				<h2>Your most used commands:</h2>
				{#each userRecap.top_commands as command}
					<section class="command">
						<p>{command.name}</p>
						<p>{command.count}</p>
					</section>
				{/each}
			</section>

			<section class="turtles">
				<section class="text">
					<h2>🐢 Turtles 🐢</h2>
					<p>Let's take a moment to appreciate the core bot feature!</p>
				</section>
				<section class="achievement">
					<p id="title">Turtles Collected</p>
					<p>{userRecap?.turtles_collected}</p>
				</section>
				<section class="achievement">
					<p id="title">Duels</p>
					<p>{userRecap?.duels}</p>
				</section>
				<section class="achievement">
					<p id="title">Turtles Lost</p>
					<p>{userRecap?.turtles_lost}</p>
				</section>
			</section>

			<section class="seventv">
				<section class="text">
					<h2>7TV</h2>
					<p>One of the most used feature in the entire bot!</p>
				</section>
				<section class="achievement">
					<p id="title">Total actions</p>
					<p>{userRecap?.total_7tv_actions}</p>
				</section>
				<section class="achievement">
					<p id="title">Emotes Actions</p>
					<p>
						{Object.values(userRecap?.emote_actions || {}).reduce((a: any, b: any) => a + b, 0)}
					</p>
				</section>
				<section class="achievement">
					<p id="title">Presence Updates</p>
					<p>{userRecap?.presence_updates}</p>
				</section>
				<section class="achievement">
					<p id="title">Cosmetics Changed</p>
					<p>{userRecap?.cosmetic_changes}</p>
				</section>
			</section>

			<section class="reminders">
				<section class="text">
					<h2>Reminders</h2>
					<p>A year of staying on top of things!</p>
				</section>
				<section class="achievements">
					<section class="achievement">
						<p id="title">Received</p>
						<p>{userRecap?.received_reminders}</p>
					</section>
					<section class="achievement">
						<p id="title">Sent</p>
						<p>{userRecap?.sent_reminders}</p>
					</section>
				</section>
				<section class="user-stats">
					<section class="remind-user">
						<h2>Most Reminded by</h2>
						<section class="achievement">
							<p>{userRecap?.top_reminder_sender?.username}</p>
						</section>
						<p>Count: {userRecap?.top_reminder_sender?.count}</p>
					</section>
					<section class="remind-user">
						<h2>Most Reminders Sent to</h2>
						<section class="achievement">
							<p>{userRecap?.top_reminder_target?.username}</p>
						</section>
						<p>Count: {userRecap?.top_reminder_target?.count}</p>
					</section>
				</section>
			</section>

			<section class="monthly-usage">
				<section class="text">
					<h2>Monthly Usage</h2>
					<p>Here's how your usage was distributed throughout the year.</p>

					<svg viewBox="0 0 600 300" style="width:100%;max-width:800px;height:auto;">
						{#each Array(9) as _, monthIndex}
							{@const monthNames = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
							{@const key = String(monthIndex + 4).padStart(2, '0')}
							{@const value = userRecap?.monthly_command_usage?.[key] ?? 0}
							{@const maxValue = Math.max(
								...Object.values(userRecap?.monthly_command_usage ?? {}),
								1
							)}
							{@const height = (value / maxValue) * 200}
							{@const x = 50 + monthIndex * 60}
							{@const isBest = value === maxValue && value > 0}

							<rect
								{x}
								y={250 - height}
								width="40"
								{height}
								fill={isBest ? '#00eaff' : '#beff00'}
								rx="5"
							/>
							<text x={x + 20} y="270" text-anchor="middle" font-size="12" fill="white">
								{monthNames[monthIndex]}
							</text>
							{#if value > 0}
								<text x={x + 20} y={240 - height} text-anchor="middle" font-size="11" fill="white">
									{value}
								</text>
							{/if}
						{/each}
					</svg>
				</section>
			</section>

			<section class="thankyou">
				<section class="wall-of-text">
					<h1>Thank You!</h1>
					<h2>We appreciate you being part of the TurtegBot Community in 2025.</h2>
					<p>Hope to see you next year!</p>
				</section>
			</section>
		</section>
		<p>Generated: {userRecap?.generated_at.toLocaleString()}</p>
	{:else if category === 2}
		<section class="recap-community">
			<section class="achievements main-achievements">
				<section class="achievement">
					<p id="title">Commands Executed</p>
					<p>230,724</p>
				</section>
				<section class="achievement">
					<p id="title">Most Days Using Bot</p>
					<p>265</p>
				</section>
				<section class="achievement">
					<p id="title">Used In Channels</p>
					<p>206</p>
				</section>
			</section>

			<section class="best-room">
				<h2>Community Top Channel</h2>
				<section class="achievement">
					<p>EWROON</p>
				</section>
				<p>Commands Used: 73,580</p>
			</section>

			<section class="best-room">
				<h2>Most Days Using Bot</h2>
				<section class="achievement">
					<p>j0ann_a</p>
				</section>
				<p>Days: 265</p>
			</section>

			<section class="best-room">
				<h2>Most Used By</h2>
				<section class="achievement">
					<p>j0ann_a</p>
				</section>
				<p>Commands Executed: 25,774</p>
			</section>

			<section class="tier-commands">
				<h2>Community Most Used Commands:</h2>
				<section class="command">
					<p>turtle</p>
					<p>46,243</p>
				</section>
				<section class="command">
					<p>resumeafk</p>
					<p>31,507</p>
				</section>
				<section class="command">
					<p>redeem</p>
					<p>23,604</p>
				</section>
				<section class="command">
					<p>randomline</p>
					<p>20,458</p>
				</section>
				<section class="command">
					<p>cooldownreset</p>
					<p>17,354</p>
				</section>
				<section class="command">
					<p>fuckmarrykill</p>
					<p>14,943</p>
				</section>
				<section class="command">
					<p>remind</p>
					<p>12,772</p>
				</section>
				<section class="command">
					<p>afk</p>
					<p>10,701</p>
				</section>
				<section class="command">
					<p>gpt</p>
					<p>8,157</p>
				</section>
				<section class="command">
					<p>yoink</p>
					<p>4,861</p>
				</section>
			</section>

			<section class="turtles">
				<section class="text">
					<h2>🐢 Turtles 🐢</h2>
					<p>Let's take a moment to appreciate the core bot feature!</p>
				</section>

				<section class="achievements">
					<section class="achievement">
						<p id="title">Turtles Collected</p>
						<p>189,590</p>
					</section>
					<section class="achievement">
						<p id="title">Duels</p>
						<p>533</p>
					</section>
					<section class="achievement">
						<p id="title">Turtles Lost</p>
						<p>138,297</p>
					</section>
				</section>

				<section class="user-stats">
					<section class="turtle-user">
						<h2>Best User</h2>
						<section class="achievement">
							<p>j0ann_a</p>
						</section>
						<p>Gained: 7,036</p>
					</section>

					<section class="turtle-user">
						<h2>Worst User</h2>
						<section class="achievement">
							<p>wrrrnika5</p>
						</section>
						<p>Lost: 9,756</p>
					</section>
				</section>
			</section>

			<section class="seventv">
				<section class="text">
					<h2>7TV</h2>
					<p>One of the most used feature in the entire bot!</p>
				</section>

				<section class="achievements">
					<section class="achievement">
						<p id="title">Total actions</p>
						<p>18,261</p>
					</section>
					<section class="achievement">
						<p id="title">Emotes Actions</p>
						<p>17,223</p>
					</section>
					<section class="achievement">
						<p id="title">Presence Updates</p>
						<p>811</p>
					</section>
					<section class="achievement">
						<p id="title">Cosmetics Changed</p>
						<p>111</p>
					</section>
				</section>

				<section class="user-stats">
					<section class="seventv-user">
						<h2>Best Editor</h2>
						<section class="achievement">
							<p>j0ann_a</p>
						</section>
						<p>Actions: 2,273</p>
					</section>

					<section class="seventv-user">
						<h2>Most Presences</h2>
						<section class="achievement">
							<p>j0ann_a</p>
						</section>
						<p>Updates: 133</p>
					</section>
				</section>
			</section>

			<section class="reminders">
				<section class="text">
					<h2>Reminders</h2>
					<p>A year of staying on top of things!</p>
				</section>
				<section class="achievements">
					<section class="achievement">
						<p id="title">Total</p>
						<p>13,587</p>
					</section>
				</section>
				<section class="user-stats">
					<section class="remind-user">
						<h2>Most Reminders Sent by</h2>
						<section class="achievement">
							<p>j0ann_a</p>
						</section>
						<p>Count: 1,326</p>
					</section>
					<section class="remind-user">
						<h2>Most Reminders Received by</h2>
						<section class="achievement">
							<p>wrrrnika5</p>
						</section>
						<p>Count: 838</p>
					</section>
				</section>
			</section>

			<section class="monthly-usage">
				<section class="text">
					<h2>Monthly Usage</h2>
					<p>Here's the usage distributed throughout the year.</p>

					<svg viewBox="0 0 600 300" style="width: 100%; max-width: 800px; height: auto;">
						{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as month}
							{@const monthNames = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
							{@const data = [13748, 24941, 29994, 30420, 37780, 25257, 26579, 23862, 16005]}
							{@const value = data[month - 1]}
							{@const height = (value / 37780) * 200}
							{@const x = 50 + (month - 1) * 60}

							<rect {x} y={250 - height} width="40" {height} fill="#beff00" rx="5" />
							<text {x} y="270" text-anchor="middle" font-size="12" fill="white">
								{monthNames[month - 1]}
							</text>
							<text x={x + 20} y={240 - height} text-anchor="middle" font-size="11" fill="white">
								{value}
							</text>
						{/each}
					</svg>
				</section>
			</section>

			<section class="thankyou">
				<section class="wall-of-text">
					<h1>Thank You!</h1>
					<h2>We appreciate you being part of the TurtegBot Community in 2025.</h2>
					<p>Hope to see you next year!</p>
				</section>
			</section>
		</section>
		
		<p>Generated: ±2025-12-28</p>
	{/if}
</section>

<style lang="scss">
	.recap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;

		font-size: 1.25rem;

		h1 {
			margin: 0;
		}

		section {
			width: 100%;
		}

		.welcome {
			width: 100%;
			height: 200px;

			background: linear-gradient(90deg, #cecece, #87ceeb, #cecece, #87ceeb, #cecece);
			background-size: 500% 100%;
			animation: rainbow-slide 12s linear infinite;

			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			clip-path: polygon(0 100%, 100% 85%, 100% 0, 0 0);
		}

		.users-spotlight {
			background-color: #a970ff;
			padding: 1rem 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			.users-list {
				display: flex;
				flex-direction: row;
				justify-content: center;
				flex-wrap: wrap;
				gap: 1rem;
				margin-top: 1rem;
				max-width: 1425px;

				.user {
					background-color: #202020;
					padding: 2rem 2rem;
					border-radius: 5px;
					color: white;
					width: 200px;

					* {
						margin: 0;
					}
					p.bottom {
						font-size: 1rem;
						color: #cccccc;
					}
				}
			}
		}

		.best-room {
			display: flex;
			flex-direction: column;
			align-items: center;

			margin: 2rem 0 1rem 0;
			background-color: #101010;
			padding: 1rem 0;
			color: white;

			h2 {
				margin: 1rem 0 0.5rem 0;
			}

			p {
				margin: 0.5rem 0;
			}

			.achievement {
				p {
					font-size: 2.5rem;
				}
			}
		}

		.tier-commands {
			display: flex;
			flex-direction: column;
			align-items: center;

			margin: 2rem 0 1rem 0;
			background-color: #101010;
			padding: 1rem 0;
			color: white;

			.command {
				width: 80%;
				background-color: #202020;
				margin: 0.5rem 0;
				padding: 0.5rem 1rem;
				border-radius: 5px;
				display: flex;
				justify-content: space-between;
			}

			h2 {
				margin: 1rem 0 0.5rem 0;
			}

			p {
				margin: 0.5rem 0;
			}
		}

		.seventv {
			margin: 0 0 1rem 0;
			background-color: #2f1a14;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			column-gap: 10px;
			row-gap: 10px;
			padding: 20px 0;

			.text {
				width: 100%;
			}

			.achievements {
				margin-top: 0;
			}

			.user-stats {
				display: flex;
				flex-direction: row;
				justify-content: center;
				flex-wrap: wrap;
				align-items: center;
				column-gap: 4rem;
				margin-top: 2rem;

				.seventv-user {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: auto;

					h2 {
						margin-bottom: 0.5rem;
					}

					.achievement {
						min-width: 300px;
						width: auto;
					}
				}
			}
		}

		.turtles {
			margin: 0 0 1rem 0;
			background-color: #0d1b2a;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			column-gap: 10px;
			row-gap: 10px;
			padding: 20px 0;

			.text {
				width: 100%;
			}

			.achievements {
				margin-top: 0;
			}

			.user-stats {
				display: flex;
				flex-direction: row;
				justify-content: center;
				flex-wrap: wrap;
				align-items: center;
				column-gap: 4rem;
				margin-top: 2rem;

				.turtle-user {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: auto;

					h2 {
						margin-bottom: 0.5rem;
					}

					.achievement {
						min-width: 300px;
						width: auto;
					}
				}
			}
		}

		.reminders {
			margin: 0 0 1rem 0;
			background-color: #1a2a1b;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20px 0;

			.achievements {
				margin-top: 0;
			}

			.user-stats {
				display: flex;
				flex-direction: row;
				justify-content: center;
				flex-wrap: wrap;
				align-items: center;
				column-gap: 4rem;
				margin-top: 2rem;

				.remind-user {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: auto;

					h2 {
						margin-bottom: 0.5rem;
					}

					.achievement {
						min-width: 300px;
						width: auto;
					}
				}
			}
		}

		.monthly-usage {
			margin: 0 0 1rem 0;
			background-color: #772ce8;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			column-gap: 10px;
			row-gap: 10px;
			padding: 20px 0;

			.text {
				width: 100%;
			}
		}

		.thankyou {
			width: 100%;
			padding: 2rem 0;
			color: white;
		}

		.achievements {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			gap: 2rem;
			margin-top: 2rem;
		}

		.achievement {
			border-radius: 10px;
			background-color: #1c1c23;
			width: 300px;
			color: white;
			display: flex;
			flex-direction: column;
			align-items: center;
			row-gap: 5px;
			padding: 10px;

			p#title {
				background-color: #beff00;
				color: #1c1c23;
				padding: 5px 10px;
				font-size: 1rem;
				font-weight: unset;
				border-radius: 10px;
			}

			p {
				margin: 0;
				font-size: 3rem;
				font-weight: bold;
			}
		}

		.wall-of-text {
			h1 {
				font-size: 2.5rem;
				margin-bottom: 0.5rem;
			}
			h2,
			p {
				margin: 0;
			}
		}

		.categories {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			align-items: center;
			column-gap: 1rem;
			row-gap: 10px;
			padding: 1rem 0;
			button {
				background-color: limegreen;
				border-radius: 5px;
				border: none;
				color: white;
				font-size: 1.25rem;
				padding: 1rem 2rem;
				cursor: pointer;

				&:hover {
					background-color: rgba(133, 133, 133, 0.63);
				}
				&:disabled {
					background-color: gray;
					cursor: not-allowed;
				}
			}
		}
	}

	.fake-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 0, 0, 0.5);
		background-color: #0b3d2e;
		background-color: black;
		background-size: cover;
		z-index: -1;
		filter: blur(8px);
	}

	@keyframes rainbow-slide {
		0% {
			background-position: 0% 50%;
		}
		100% {
			background-position: 125% 50%;
		}
	}

	@media (max-width: 768px) {
		.recap {
			.achievements {
				flex-direction: column;
				row-gap: 1rem;
			}
		}
	}
</style>
