import { useState, useEffect } from 'react';
import { useFroinAuth } from 'web3auth-froin-connector';

export const AuthPanel = () => {
  const { provider, login, logout } = useFroinAuth();

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px 0' }}>
      <h2>Autenticación</h2>
      {!provider ? (
        <button onClick={login}>Iniciar Sesión</button>
      ) : (
        <>
          <p>¡Sesión Iniciada!</p>
          <button onClick={logout}>Cerrar Sesión</button>
        </>
      )}
    </div>
  );
};
