import { useContext } from 'react';
import { FroinAuthContext } from '../provider';

export const useFroinAuth = () => {
  const context = useContext(FroinAuthContext);
  if (!context) throw new Error("useFroinAuth must be used within FroinWeb3AuthProvider");
  return context;
};
