import { createContext, useState, useEffect, useCallback } from "react";
import { Web3Auth, WEB3AUTH_NETWORK, CHAIN_NAMESPACES } from "@web3auth/modal";

export const FroinAuthContext = createContext<any>(null);

const SOLANA_DEVNET_CHAIN_ID = "0x3"; // Solana devnet in web3auth's numeric-as-hex convention

export const FroinWeb3AuthProvider = ({
  children,
  clientId,
  network = WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
}: any) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<any>(null);

  const initWeb3Auth = useCallback(async () => {
    if (web3auth !== null) return;
    try {
      const w3a = new Web3Auth({
        clientId,
        web3AuthNetwork: network,
      });
      await w3a.init();
      setWeb3auth(w3a);
      if (w3a.provider) setProvider(w3a.provider);
    } catch (error) {
      console.error("Web3Auth init failed", error);
    }
  }, [clientId, network, web3auth]);

  useEffect(() => {
    if (web3auth === null) {
      initWeb3Auth();
    }
  }, [clientId, network]);

  const login = async () => {
    if (!web3auth) return;
    try {
      const p = await web3auth.connect();
      if (web3auth.connected) {
        setProvider(p);
      }
    } catch (error) {
      console.error("Web3Auth login failed", error);
    }
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
