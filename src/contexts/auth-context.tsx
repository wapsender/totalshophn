'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { addUser, createNewUser, users as allUsers, updateUserRole } from '@/lib/users';
import type { UserProfile, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  adminCreateUser: (email: string, pass: string, role: UserRole) => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        let profile = allUsers.find(u => u.uid === currentUser.uid);
        
        if (!profile && currentUser) {
            // This can happen if the user exists in Firebase Auth but not in our local `users` array.
            // For this prototype, we'll create a default 'customer' profile for them.
            const newProfile: Omit<UserProfile, 'balance' | 'purchasedCodes'> = {
                uid: currentUser.uid,
                email: currentUser.email!,
                role: 'customer',
            };
            const finalProfile = addUser(newProfile);
            setUserProfile(finalProfile || null);
        } else {
             setUserProfile(profile || null);
        }

      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const adminCreateUser = async (email: string, password: string, role: UserRole) => {
    // This will create the user in Firebase Auth.
    const userCredential = await createNewUser(email, password);

    // This will add or update the user in our local user list.
    const newUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        role: role,
    };
    addUser(newUser);
    
    // This ensures the role is set correctly, especially if the user already existed.
    updateUserRole(userCredential.user.uid, role);
    return userCredential;
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if(userCredential.user) {
        let profile = allUsers.find(u => u.uid === userCredential.user.uid);
        if (!profile) {
            // This can happen if the user exists in Firebase Auth but not in our local `users` array.
            // For this prototype, we'll create a default 'customer' profile for them.
            const newProfile: Omit<UserProfile, 'balance' | 'purchasedCodes'> = {
                uid: userCredential.user.uid,
                email: userCredential.user.email!,
                role: 'customer',
            };
            addUser(newProfile);
            const finalProfile = allUsers.find(u => u.uid === userCredential.user.uid);
            setUserProfile(finalProfile || null);
        } else {
           setUserProfile(profile);
        }
    }
    return userCredential;
  };

  const logout = () => {
    setUserProfile(null);
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, adminCreateUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
