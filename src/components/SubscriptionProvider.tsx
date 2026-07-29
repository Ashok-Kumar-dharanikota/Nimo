import React, { createContext, useContext, ReactNode } from 'react';

interface SubscriptionContextType {
  isPremium: boolean;
  customerInfo: any | null;
  packages: any[];
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPremium: true,
  customerInfo: null,
  packages: [],
  isLoading: false,
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SubscriptionContext.Provider
      value={{
        isPremium: true,
        customerInfo: null,
        packages: [],
        isLoading: false,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
