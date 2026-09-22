import { useFroinAuth } from "web3auth-froin-connector";

export const WalletInfo = () => {
  const { provider } = useFroinAuth();

  if (!provider) return null;

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", margin: "10px 0" }}
    >
      <h2>Información de Wallet</h2>
      <p>Proveedor conectado correctamente.</p>
      <button onClick={() => alert("Consulta de saldo simulada")}>
        Consultar Saldo Helius
      </button>
    </div>
  );
};
