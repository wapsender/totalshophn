import type { UserProfile, CartItem, PurchasedCode, Coupon, UserRole } from '@/types';
import { products, coupons as allCoupons } from './products';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// In-memory user database simulation
export let users: UserProfile[] = [
    {
        uid: 'FIREBASE_UID_PLACEHOLDER', // This should be replaced by the actual Firebase UID upon user creation
        email: 'eliazar.zacapa@gmail.com',
        balance: 9999,
        purchasedCodes: [],
        role: 'admin',
    }
];


// This function should be called from a trusted server environment in a real app
export const createNewUser = (email: string, password: string) => {
    // Note: This creates the user in Firebase Auth.
    // In a real production app, this should be done from a secure backend (like a Cloud Function)
    // to avoid exposing admin-like capabilities to the client-side.
    // For this prototype, we call it from the admin page context.
    return createUserWithEmailAndPassword(auth, email, password);
}


export const addUser = (user: Omit<UserProfile, 'balance' | 'purchasedCodes'>): UserProfile => {
  const existingUserIndex = users.findIndex(u => u.uid === user.uid || u.email === user.email);

  if (existingUserIndex !== -1) {
    // Update existing user's role if different, but don't overwrite other data like balance
    users[existingUserIndex].role = user.role;
    // IMPORTANT: Sync the UID from Firebase Auth to our local user record
    if (users[existingUserIndex].uid !== user.uid) {
        users[existingUserIndex].uid = user.uid;
    }
    return users[existingUserIndex];
  } else {
    // Add new user
    const newUser: UserProfile = {
        ...user,
        balance: 0,
        purchasedCodes: [],
    }
    users.push(newUser);
    return newUser;
  }
};

export const updateUserRole = (uid: string, role: UserRole) => {
    const userIndex = users.findIndex(u => u.uid === uid);
    if(userIndex !== -1) {
        users[userIndex].role = role;
    }
}

export const deleteUser = (uid: string): void => {
    users = users.filter(u => u.uid !== uid);
};

export const getAllUsers = (): UserProfile[] => {
  return users;
};

export const assignBalance = (uid: string, amount: number): UserProfile | null => {
  const userIndex = users.findIndex(u => u.uid === uid);
  if (userIndex !== -1) {
    users[userIndex].balance += amount;
    return users[userIndex];
  }
  return null;
};

export const getUserBalance = (uid: string): number => {
    const user = users.find(u => u.uid === uid);
    return user ? user.balance : 0;
}

const calculateDiscount = (subtotal: number, coupon: Coupon | null): number => {
    if (!coupon) return 0;
    if (coupon.discountType === 'percentage') {
        return subtotal * (coupon.value / 100);
    }
    return coupon.value;
};


export const purchaseWithBalance = (
  uid: string,
  cartItems: CartItem[],
  appliedCoupon: Coupon | null
): { success: boolean; message: string } => {
  const userIndex = users.findIndex(u => u.uid === uid);
  if (userIndex === -1) {
    return { success: false, message: 'Usuario no encontrado.' };
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.appliedPrice, 0);
  
  if (appliedCoupon) {
      const couponIndex = allCoupons.findIndex(c => c.id === appliedCoupon.id);
      if (couponIndex === -1) {
          return { success: false, message: 'El cupón aplicado ya no es válido.' };
      }
      if (allCoupons[couponIndex].uses >= allCoupons[couponIndex].quantity) {
           return { success: false, message: 'El cupón seleccionado ha alcanzado su límite de usos.' };
      }
  }

  const discountAmount = calculateDiscount(subtotal, appliedCoupon);
  const totalCost = Math.max(0, subtotal - discountAmount);


  if (users[userIndex].balance < totalCost) {
    return { success: false, message: 'Saldo insuficiente.' };
  }

  // Check stock for all items BEFORE processing
  for (const item of cartItems) {
    const product = products.find(p => p.id === item.id);
    if (!product || !product.stock) {
        return { success: false, message: `El producto "${item.name}" está mal configurado.` };
    }
    const availableStock = product.stock.find(s => !s.isSold);
    if (!availableStock) {
      return { success: false, message: `Lo sentimos, "${item.name}" está agotado.` };
    }
  }
  
  // Deduct balance
  users[userIndex].balance -= totalCost;
  
  // Increment coupon usage
  if (appliedCoupon) {
      const couponIndex = allCoupons.findIndex(c => c.id === appliedCoupon.id);
      if (couponIndex !== -1) {
        allCoupons[couponIndex].uses++;
      }
  }


  // Process purchase and "deliver" codes
  cartItems.forEach(item => {
    const product = products.find(p => p.id === item.id);
    // We already checked for this, but to be safe
    if (product && product.stock) {
      const stockToSell = product.stock.find(s => !s.isSold);
      if (stockToSell) {
        stockToSell.isSold = true;
        
        const purchasedItem: PurchasedCode = {
            productName: product.name,
            purchasedAt: new Date().toISOString(),
            code: stockToSell.value,
            credentials: stockToSell.credentials
        };

        if(!users[userIndex].purchasedCodes) {
          users[userIndex].purchasedCodes = [];
        }
        users[userIndex].purchasedCodes.push(purchasedItem);
      }
    }
  });

  return { success: true, message: '¡Compra exitosa!' };
};
