// Stub for RevenueCat, removed to reduce dependencies
export const ENTITLEMENT_ID = 'Nimo Premium';

export const initializeRevenueCat = async () => {};

export const getCustomerInfo = async (): Promise<any | null> => {
  return null;
};

export const checkIsPremium = (customerInfo: any | null): boolean => {
  return true; // Assume premium by default now
};

export const getOfferings = async () => {
  return null;
};

export const purchasePackage = async (pack: any) => {
  return { success: true, customerInfo: null };
};

export const restorePurchases = async () => {
  return { success: true, customerInfo: null };
};

export const showCustomerCenter = async () => {
  return { success: false, error: 'Not supported' };
};
