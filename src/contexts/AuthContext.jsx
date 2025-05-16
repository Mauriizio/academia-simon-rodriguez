
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, checkFirebaseConfig } from '@/firebase';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!checkFirebaseConfig()) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setCurrentUser({ ...user, ...userData });
          setIsAdmin(userData.role === 'admin');
        } else {
          setCurrentUser(user);
          setIsAdmin(false); 
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signup(email, password, displayName) {
    if (!checkFirebaseConfig()) throw new Error("Firebase configuration is missing.");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userDocRef, {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: displayName,
      role: 'user', 
      createdAt: new Date(),
    });
    
    setCurrentUser({ ...userCredential.user, displayName, role: 'user' });
    setIsAdmin(false);
    return userCredential;
  }

  async function login(email, password) {
    if (!checkFirebaseConfig()) throw new Error("Firebase configuration is missing.");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      setCurrentUser({ ...userCredential.user, ...userData });
      setIsAdmin(userData.role === 'admin');
    } else {
      setCurrentUser(userCredential.user);
      setIsAdmin(false);
    }
    return userCredential;
  }

  async function signOut() {
    if (!checkFirebaseConfig()) return;
    await firebaseSignOut(auth);
    setCurrentUser(null);
    setIsAdmin(false);
    toast({ title: "Sesión cerrada", description: "Has cerrado sesión exitosamente." });
  }
  
  async function updateUserProfile(updates) {
    if (!currentUser || !checkFirebaseConfig()) throw new Error("User not authenticated or Firebase not configured.");
    
    const user = auth.currentUser;
    if (updates.displayName && updates.displayName !== user.displayName) {
      await updateProfile(user, { displayName: updates.displayName });
    }

    const userDocRef = doc(db, 'users', currentUser.uid);
    await setDoc(userDocRef, updates, { merge: true });
    
    const updatedUserDocSnap = await getDoc(userDocRef);
    if (updatedUserDocSnap.exists()) {
      setCurrentUser({ ...user, ...updatedUserDocSnap.data() });
    }
  }


  const value = {
    currentUser,
    isAdmin,
    signup,
    login,
    signOut,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
  