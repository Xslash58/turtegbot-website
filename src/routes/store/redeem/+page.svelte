<script lang="ts">
	import type { User } from '$lib/API/Models/Users';
	import { myUser } from '$lib/stores/userStore';
	import { onMount } from 'svelte';
	import LoadingIndicator from '$components/LoadingIndicator.svelte';
	import { feedbackDialog } from '$lib/stores/modalStore';
	import { PostRedeemCode } from '$lib/API/Store';
	import { page } from '$app/stores';

	let code: string = '';

	let isLoading: boolean = true;

	let me: User | null = null;
	$: if (me == null) me = $myUser;
    $: codeParameter = $page.url.searchParams.get('code') || '';
    $: if (codeParameter) code = codeParameter;

	const toSignedString = (num: number) =>
		new Intl.NumberFormat('en', { signDisplay: 'always' }).format(num);

	onMount(async () => {
		console.log('Redeem page mounted');
		isLoading = false;
	});

	async function redeemCode(e: SubmitEvent) {
		e.preventDefault();
		isLoading = true;

		let code = (e.target as HTMLFormElement).querySelector('input')?.value;
		if (code == null) return;

		try {
			var res: { type: string; amount: number } = await PostRedeemCode(code);

			let parts = res.type.split('_');
			let channelName = parts.length > 2 ? parts[2] : '';
			let rewardName = parts.length > 2 ? parts[3] : '';

			feedbackDialog.set({
				visible: true,
				title: 'Redeem Code',
				content:
					res.type == 'TURTLE_CODE'
						? `Successfully redeemed code! You received ${toSignedString(res.amount)} turtles.`
						: `Successfully redeemed ${channelName} code! ${toSignedString(res.amount)} ${rewardName}`
			});

			isLoading = false;
		} catch (error) {
			console.error('Error redeeming code:', error);
			feedbackDialog.set({
				visible: true,
				title: 'Redeem Code',
				content: `${error instanceof Error ? error.message : String(error)}`
			});
			isLoading = false;
			return;
		}
	}
</script>

<svelte:head>
	<title>Redeem | TurtegBot</title>
</svelte:head>

<section class="redeem">
	<h1>Redeem Code</h1>
	<p>Enter your redeem code below to claim your reward!</p>
	<form on:submit|preventDefault={redeemCode}>
		<input
			type="text"
			placeholder="Enter your code here"
			bind:value={code}
			disabled={isLoading || me == null}
			required
		/>
		{#if isLoading}
			<LoadingIndicator size={30} />
		{:else if me == null}
			<button type="submit" disabled={true}>
				{isLoading ? '...' : 'Login required'}
			</button>
		{:else}
			<button type="submit" disabled={isLoading}>
				{isLoading ? '...' : 'Redeem'}
			</button>
		{/if}
	</form>
</section>

<style lang="scss">
	.redeem {
		max-width: 400px;
		margin: 0 auto;
		padding: 20px;
		background-color: #191919;
		border-radius: 8px;
		text-align: center;

		h1 {
			margin: 0;
			font-size: 1.5em;
		}

		form {
			display: flex;
			flex-direction: column;
			gap: 15px;

			input {
				padding: 10px;
				border-radius: 4px;
				border: none;
				background-color: #101010;
				color: white;

				&:focus {
					outline: 1px solid #33ca00;
				}
				&:disabled {
					background-color: #151515;
					cursor: not-allowed;
				}
			}

			button {
				padding: 10px;
				border-radius: 4px;
				border: none;
				background-color: #33ca00;
				color: white;
				cursor: pointer;

				&:hover {
					background-color: #28a300;
				}

				&:disabled {
					background-color: #555;
					cursor: not-allowed;
				}
			}
		}
	}
</style>
