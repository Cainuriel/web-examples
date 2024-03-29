import { getWalletClient , getPublicClient } from '@wagmi/core'
import { BrowserProvider, FallbackProvider, JsonRpcProvider } from 'ethers'
import { type Chain, type Client, type Transport, type WalletClient, createWalletClient, custom } from 'viem'
import { http, createConfig } from '@wagmi/core'
import { bscTestnet, bsc } from '@wagmi/core/chains'

// import { createWalletClient, custom } from 'viem'
// import { bscTestnet } from 'viem/chains'
 
// const client = createWalletClient({
//   chain: bscTestnet,
//   transport: custom(window.ethereum!)
// })


export const walletClient:WalletClient = createWalletClient({
  chain: bscTestnet,
  transport: custom(window.ethereum!),
})

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback') {
    const providers = (transport.transports as ReturnType<Transport>[]).map(
      ({ value }) => new JsonRpcProvider(value?.url, network)
    )
    if (providers.length === 1) return providers[0]
    return new FallbackProvider(providers)
  }
  return new JsonRpcProvider(transport.url, network)
}

const config = createConfig({
  chains: [bscTestnet, bsc],
  transports: {
    [bscTestnet.id]: http(),
    [bsc.id]: http(),
  },
})

/** Action to convert a viem Client to an ethers.js Provider. */
export async function getEthersProvider() {
  const client = getPublicClient(config)
  return clientToProvider(client)
}

export async function walletClientToSigner(walletClient: WalletClient) {
  const { chain, transport } = walletClient
  // const [account] = await walletClient.getAddresses()
  const network = {
    chainId: chain?.id,
    name: chain?.name,
    ensAddress: chain?.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network);
  
  // const provider = new JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
  // const signer = new JsonRpcSigner(provider, account)
  const signer = provider.getSigner()
  return signer
}

/** Action to convert a viem Wallet Client to an ethers.js Signer. */
export async function getEthersSigner() {
  const client = await getWalletClient(config)
  if (!client) return undefined
  return walletClientToSigner(client)
}