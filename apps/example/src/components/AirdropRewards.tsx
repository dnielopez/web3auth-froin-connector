import { useState } from 'react';

export const AirdropRewards = () => {
  const [amount, setAmount] = useState('');

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px 0' }}>
      <h2>Reclamar Recompensa (Airdrop)</h2>
      <input placeholder="Monto" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={() => alert(`Solicitando airdrop de ${amount} FROIN`)}>Reclamar</button>
    </div>
  );
};
