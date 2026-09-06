export type Language = 'EN' | 'GU' | 'HI';

export type Screen = 'home' | 'sell' | 'orders';

export interface MandiPrice {
  id: string;
  cropName: string;
  hindiName: string;
  gujaratiName: string;
  pricePerKg: number;
  marketName: string;
  trend: 'up' | 'down' | 'stable';
  changeAmount: number;
  arrivalVolume: string;
  icon: string;
}

export interface FarmerListing {
  id: string;
  cropName: string;
  quantityKg: number;
  expectedPricePerKg: number;
  totalValue: number;
  listedDate: string;
  location: string;
  photoUrl?: string;
  status: 'active' | 'sold' | 'expired';
}

export interface BuyerOrder {
  id: string;
  buyerName: string;
  buyerType: 'Retailer' | 'Supermarket' | 'Wholesaler' | 'Processor';
  cropName: string;
  hindiCropName: string;
  gujaratiCropName: string;
  quantityKg: number;
  priceOfferedPerKg: number;
  totalAmount: number;
  deliveryLocation: string;
  pickupSlot: string;
  buyerPhone: string;
  orderTime: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface FarmerProfile {
  name: string;
  mobile: string;
  village: string;
  taluka: string;
  state: string;
  totalEarnings: number;
  pendingPayout: number;
  totalQuantitySoldKg: number;
  activeListingsCount: number;
}

// Runtime placeholder export to guarantee ESM export compatibility
export const AGRI_CART_VERSION = '1.0.0';
