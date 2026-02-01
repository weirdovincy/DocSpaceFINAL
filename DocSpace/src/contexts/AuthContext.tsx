import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '@/integrations/firebase/firebase';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: 'student' | 'lecturer' | 'owner';
  college_name: string | null;
  college_address: string | null;
  points: number;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  sendVerificationEmail: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to map Firebase User to our Profile interface
  const mapUserToProfile = (firebaseUser: User): Profile => {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      full_name: firebaseUser.displayName,
      avatar_url: firebaseUser.photoURL,
      // Defaulting to student as we don't have a database profile yet
      role: 'student',
      college_name: null,
      college_address: null,
      points: 0,
      created_at: firebaseUser.metadata.creationTime || new Date().toISOString(),
    };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setProfile(mapUserToProfile(currentUser));
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // We allow unverified users to sign in, but ProtectedRoute will redirect them
      return { error: null };
    } catch (error) {
      console.error("Error signing in:", error);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name immediately
      await updateProfile(userCredential.user, {
        displayName: fullName
      });

      // Send verification email
      await sendEmailVerification(userCredential.user);

      // Sign out immediately so they can't access the app without verifying
      await firebaseSignOut(auth);

      return { error: null };
    } catch (error) {
      console.error("Error signing up:", error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const refreshProfile = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser(auth.currentUser);
      setProfile(mapUserToProfile(auth.currentUser));
    }
  };

  const sendVerificationEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        return { error: null };
      }
      return { error: new Error("No user signed in") };
    } catch (error) {
      console.error("Error sending verification email:", error);
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        sendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


