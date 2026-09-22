import { FroinWeb3AuthProvider } from "web3auth-froin-connector";
import { AuthPanel } from "./components/AuthPanel";
// import { WalletInfo } from "./components/WalletInfo";
// import { TransferFroin } from "./components/TransferFroin";
// import { AirdropRewards } from "./components/AirdropRewards";

function App() {
  return (
    <FroinWeb3AuthProvider
      clientId="BITSdWMTwsbZyKtfUU331bVEQWF36gJWhzOAnzH5MSfday1kuEKUnstSVnFz2HjcfykN-t2XKtvciNfGg68txXA"
      network="sapphire_devnet"
    >
      <div
        style={{
          fontFamily: "sans-serif",
          maxWidth: "600px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <h1>FROIN Ecosystem - Ejemplos de Integración</h1>
        <AuthPanel />
        {/* <WalletInfo /> */}
        {/* <TransferFroin />
        <AirdropRewards /> */}
      </div>
    </FroinWeb3AuthProvider>
  );
}

export default App;
