import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, CustomerInfo, PurchasesPackage } from 'react-native-purchases';

// IMPORTANT: Replace these with your actual RevenueCat API keys
const API_KEYS = {
  apple: 'test_LUXPiBLeVswacRKbDgvdrpUQrka', // Using the same test key if provided for both, otherwise split them
  google: 'test_LUXPiBLeVswacRKbDgvdrpUQrka',
};

export const ENTITLEMENT_ID = 'Nimo Premium';

export const initializeRevenueCat = async () => {
  if (Platform.OS === 'web') return;

  Purchases.setLogLevel(LOG_LEVEL.DEBUG);

  if (Platform.OS === 'ios') {
    Purchases.configure({ apiKey: API_KEYS.apple });
  } else if (Platform.OS === 'android') {
    Purchases.configure({ apiKey: API_KEYS.google });
  }
};

export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  if (Platform.OS === 'web') return null;
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('Failed to get customer info', error);
    return null;
  }
};

export const checkIsPremium = (customerInfo: CustomerInfo | null): boolean => {
  if (!customerInfo) return false;
  return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
};

export const getOfferings = async () => {
  if (Platform.OS === 'web') return null;
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      return offerings.current;
    }
  } catch (error) {
    console.error('Error fetching offerings', error);
  }
  return null;
};

export const purchasePackage = async (pack: PurchasesPackage) => {
  if (Platform.OS === 'web') return { success: false, error: 'Web not supported' };
  try {
    const { customerInfo } = await Purchases.purchasePackage(pack);
    return { success: true, customerInfo };
  } catch (error: any) {
    if (!error.userCancelled) {
      console.error('Purchase failed', error);
    }
    return { success: false, error };
  }
};

export const restorePurchases = async () => {
  if (Platform.OS === 'web') return { success: false, error: 'Web not supported' };
  try {
    const customerInfo = await Purchases.restorePurchases();
    return { success: true, customerInfo };
  } catch (error) {
    console.error('Restore failed', error);
    return { success: false, error };
  }
};

export const showCustomerCenter = async () => {
  if (Platform.OS === 'web') return { success: false, error: 'Web not supported' };
  try {
    const RevenueCatUI = require('react-native-purchases-ui').default;
    await RevenueCatUI.presentCustomerCenter();
    return { success: true };
  } catch (error) {
    console.error('Failed to present Customer Center', error);
    return { success: false, error };
  }
};
