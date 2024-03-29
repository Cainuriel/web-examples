import { getWalletClient , getPublicClient } from '@wagmi/core'
import { BrowserProvider, FallbackProvider, JsonRpcProvider } from 'ethers'
import { type Chain, type Client, type Transport, type WalletClient } from 'viem'
import { http, createConfig } from '@wagmi/core'
import { polygonMumbai } from '@wagmi/core/chains';
import { type Networkish} from "ethers"
// import { createWalletClient, custom } from 'viem'
// import { bscTestnet } from 'viem/chains'
 
// const client = createWalletClient({
//   chain: bscTestnet,
//   transport: custom(window.ethereum!)
// })


// export const walletClient:WalletClient = createWalletClient({
//   chain: bscTestnet,
//   transport: custom(window.ethereum!),
// })

export async function clientToProvider(client: Client<Transport, Chain>) {
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
  chains: [polygonMumbai],
  transports: {
    [polygonMumbai.id]: http(),
  },
})

/** Action to convert a viem Client to an ethers.js Provider. */
export async function getEthersProvider() {
  const client =  getPublicClient(config)
  return await clientToProvider(client)
}

export async function walletClientToSigner(walletClient: WalletClient) {
 console.log(`walletClient`, walletClient);
  // const [account] = await walletClient.getAddresses()
  const network = {
    chainId: walletClient.chain,
    name: walletClient?.chain?.name,
    ensAddress: walletClient?.chain?.contracts?.ensRegistry?.address,
  }
  const provider = await new BrowserProvider(walletClient.transport, network as Networkish | undefined);
  console.log(`provider`, provider);
  // const provider = new JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
  // const signer = new JsonRpcSigner(provider, account)
  const signer = await provider.getSigner();
  console.log(`signer`, signer);
  return signer
}

/** Action to convert a viem Wallet Client to an ethers.js Signer. */
export async function getEthersSigner() {
  const client = await getWalletClient(config)
  if (!client) return undefined
  return walletClientToSigner(client)
}