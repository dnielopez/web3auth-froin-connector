import { createContext } from "react";
import {
  Web3AuthProvider as W3AProvider,
  useWeb3AuthConnect,
  useWeb3AuthUser,
  useWeb3AuthDisconnect,
} from "@web3auth/modal/react";
import { WEB3AUTH_NETWORK, CHAIN_NAMESPACES } from "@web3auth/modal";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type Web3AuthContextConfig } from "@web3auth/modal/react";

export const FroinAuthContext = createContext<any>(null);

const SOLANA_DEVNET_CHAIN_ID = "0x67";
const DEFAULT_SOLANA_DEVNET_RPC = "https://api.devnet.solana.com";

/**
 * Internal consumer: must be rendered *inside* W3AProvider.
 * Uses the v11 hooks so the SDK's internal event loop can properly
 * complete the email-passwordless OTP verification without hanging.
 */
function FroinAuthInnerProvider({ children }: { children: React.ReactNode }) {
  // useWeb3AuthConnect returns: { connect, connectTo, isConnected, loading, error, connectorName }
  const { connect, isConnected } = useWeb3AuthConnect();
  // useWeb3AuthUser returns: { userInfo, isLoading }
  const { userInfo } = useWeb3AuthUser();
  // useWeb3AuthDisconnect returns: { disconnect, isLoading }
  const { disconnect } = useWeb3AuthDisconnect();

  const login = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Web3Auth login failed", error);
    }
  };

  const logout = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Web3Auth logout failed", error);
    }
  };

  return (
    <FroinAuthContext.Provider value={{ isConnected, userInfo, login, logout }}>
      {children}
    </FroinAuthContext.Provider>
  );
}

export const FroinWeb3AuthProvider = ({
  children,
  clientId,
  network = WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  rpcTarget = DEFAULT_SOLANA_DEVNET_RPC,
}: any) => {
  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.SOLANA,
    chainId: SOLANA_DEVNET_CHAIN_ID,
    rpcTarget,
    displayName: "Solana Devnet",
    blockExplorerUrl: "https://explorer.solana.com/?cluster=devnet",
    logo: "https://images.web3auth.io/solana.svg",
    ticker: "SOL",
    tickerName: "Solana",
    isTestnet: true,
  };

  const privateKeyProvider = new SolanaPrivateKeyProvider({
    config: { chainConfig },
  }) as any;

  // W3AProvider expects: { config: { web3AuthOptions: {...} }, children }
  const web3AuthConfig: Web3AuthContextConfig = {
    web3AuthOptions: {
      clientId,
      web3AuthNetwork: network,
      privateKeyProvider,
    },
  };

  const queryClient = new QueryClient();

  return (
    <W3AProvider config={web3AuthConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider>
          <FroinAuthInnerProvider>{children}</FroinAuthInnerProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </W3AProvider>
  );
};
