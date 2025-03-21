import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BalanceContextType {
  balance: number;
  setBalance: (balance: number) => void;
  updateBalance: (amount: number) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(1234.56); // Initial balance

  const updateBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  return (
    <BalanceContext.Provider value={{ balance, setBalance, updateBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}