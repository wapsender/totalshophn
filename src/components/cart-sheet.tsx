export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  offerPrice?: number; // Optional offer price
  resellerPrice?: number; // Optional reseller price
  image: string;
  imageHint: string;
  category: string;
  stock?: ProductStock[];
}

export interface ProductStock {
    type: 'code' | 'credentials';
    value: string; // for code
    credentials?: { email: string, password: string };
    isSold: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  // The price applied to the item when added to cart (regular or reseller)
  appliedPrice: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; 
  quantity: number; 
  uses: number;
}


export interface Category {
    id: string;
    name: string;
}

export type UserRole = 'customer' | 'reseller' | 'admin';

export interface UserProfile {
    uid: string;
    email: string;
    balance: number;
    purchasedCodes: PurchasedCode[];
    role: UserRole;
}

export interface PurchasedCode {
    productName: string;
    code: string;
    credentials?: { email: string; password: string };
    purchasedAt: string;
}

export interface AppSettings {
    whatsappNumber: string;
}
