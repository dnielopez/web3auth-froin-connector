import { useFroinAuth } from "web3auth-froin-connector";

export const AuthPanel = () => {
  const { isConnected, userInfo, login, logout } = useFroinAuth();

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", margin: "10px 0" }}
    >
      <h2>Autenticación</h2>
      {!isConnected ? (
        <button onClick={login}>Iniciar Sesión</button>
      ) : (
        <>
          <p>¡Sesión Iniciada!</p>
          {userInfo?.email && <p>Email: {userInfo.email}</p>}
          <button onClick={logout}>Cerrar Sesión</button>
        </>
      )}
    </div>
  );
};
