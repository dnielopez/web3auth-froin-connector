import { useState } from "react";
import { useFroinAuth } from "web3auth-froin-connector";

export const TransferFroin = () => {
  const { provider } = useFroinAuth();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  if (!provider) return null;

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", margin: "10px 0" }}
    >
      <h2>Transferir $FROIN</h2>
      <input
        placeholder="Dirección destino"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={() => alert(`Enviando ${amount} a ${address}`)}>
        Enviar Gasless Tx
      </button>
    </div>
  );
};
