import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo, PurchasesPackage } from 'react-native-purchases';
import {
  initializeRevenueCat,
  getCustomerInfo,
  checkIsPremium,
  getOfferings,
} from '@/lib/revenuecat';

interface SubscriptionContextType {
  isPremium: boolean;
  customerInfo: CustomerInfo | null;
  packages: PurchasesPackage[];
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPremium: false,
  customerInfo: null,
  packages: [],
  isLoading: true,
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'web') {
        setIsLoading(false);
        return;
      }

      await initializeRevenueCat();

      const initialCustomerInfo = await getCustomerInfo();
      setCustomerInfo(initialCustomerInfo);
      setIsPremium(checkIsPremium(initialCustomerInfo));

      const offerings = await getOfferings();
      if (offerings && offerings.availablePackages.length > 0) {
        setPackages(offerings.availablePackages);
      }

      setIsLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    // Listen for changes in customer info (e.g., after a purchase)
    const customerInfoUpdateListener = (info: CustomerInfo) => {
      setCustomerInfo(info);
      setIsPremium(checkIsPremium(info));
    };

    Purchases.addCustomerInfoUpdateListener(customerInfoUpdateListener);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(customerInfoUpdateListener);
    };
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        isPremium,
        customerInfo,
        packages,
        isLoading,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
