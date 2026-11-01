import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from './config';
import { UserRole } from '../types';

export interface UserProfileData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  city?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfileData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfileData);
          } else {
            // New user registration in Firestore
            const initialProfile: UserProfileData = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'Celebration Host',
              photoURL: currentUser.photoURL || undefined,
              role: 'parent',
              city: 'Mumbai, Maharashtra',
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, initialProfile);
            setUserProfile(initialProfile);
          }
        } catch (error) {
          console.error("Error reading user profile:", error);
          // Fallback profile
          setUserProfile({
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || 'Celebration Host',
            photoURL: currentUser.photoURL || undefined,
            role: 'parent',
            city: 'Mumbai, Maharashtra',
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const updateUserRole = async (role: UserRole) => {
    if (userProfile && user) {
      const updated = { ...userProfile, role };
      setUserProfile(updated);
      try {
        await setDoc(doc(db, 'users', user.uid), { role }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithGoogle,
        signOutUser,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
