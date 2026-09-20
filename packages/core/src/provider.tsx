import React, { createContext, useState, useEffect } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";

export const FroinAuthContext = createContext<any>(null);

export const FroinWeb3AuthProvider = ({ children, clientId, network = "sapphire_devnet" }: any) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new SolanaPrivateKeyProvider({
          config: { chainConfig: { chainNamespace: "solana", chainId: "0x3", rpcTarget: "https://api.devnet.solana.com", displayName: "Solana Devnet", ticker: "SOL", tickerName: "Solana" } }
        });
        const w3a = new Web3Auth({
          clientId,
          web3AuthNetwork: network,
          privateKeyProvider,
        });
        await w3a.initModal();
        setWeb3auth(w3a);
        if (w3a.provider) setProvider(w3a.provider);
      } catch (error) {
        console.error("Web3Auth init failed", error);
      }
    };
    init();
  }, [clientId, network]);

  const login = async () => {
    if (!web3auth) return;
    const p = await web3auth.connect();
    setProvider(p);
  };

  const logout = async () => {
    if (!web3auth) return;
    await web3auth.logout();
    setProvider(null);
  };

  return (
    <FroinAuthContext.Provider value={{ web3auth, provider, login, logout }}>
      {children}
    </FroinAuthContext.Provider>
  );
};
