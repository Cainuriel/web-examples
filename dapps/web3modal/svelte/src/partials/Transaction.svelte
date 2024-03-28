<script lang="ts">
	import { account, wagmiConfig } from '$lib/web3modal'
	import toast from 'svelte-french-toast'
	import Button from '../components/Button.svelte'
	import Card from '../components/Card.svelte'
	import { sendTransaction,watchAccount, http, createConfig } from '@wagmi/core'
	import { onMount } from 'svelte';
	import { polygonMumbai } from '@wagmi/core/chains'

// export const config = createConfig({
//   chains: [polygonMumbai],
//   transports: {
//     [polygonMumbai.id]: http(),
//   },
// })

// 	const unwatch = watchAccount(config, {
//       onChange(data) {
//         console.log('Account changed!', data.address);
    
//       }
//     });
// 	unwatch();

	let label: string = 'Send Transaction'
	let hash: string;
    let amount:number = 0;
	$: userAccount =$account.address;
	async function handleWrite() {
		if (!$account.address) throw Error('Wallet disconnected')
		label = 'Processing...'

		try {
			const _hash = await sendTransaction(wagmiConfig, {
				to: $account.address,
				value: BigInt(amount),
				data: '0x1DD0072C32C499db9c98604aeea9F880983142Eb',
			})

			//@ts-expect-error Wagmi Type bug
			if (_hash !== 'null') {
				hash = 'Hash: ' + _hash
				toast.success('Message signed successfully')
			} else {
				toast.error('The signature was rejected')
				hash = '_ eth_sendTransaction'
			}
		} catch (error) {
			toast.error((error as Error).message)
			hash = '_ eth_sendTransaction'
		} finally {
			label = 'Send Transaction'
		}
	}

	onMount(async () => {

		
	});

</script>

<Card>
	{#if userAccount}
	<div>
		<spam>Your address {userAccount}</spam>
		<input type="number"  bind:value={amount} placeholder="enter your amount" />
		{hash ?? '_ eth_sendTransaction'}
		<Button on:click={handleWrite}>{label}</Button>
	</div>	
	{/if}
	
</Card>

<style>
	div {
		width: 230px;
		word-wrap: break-word;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
	}
</style>
