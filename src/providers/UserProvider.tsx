"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '@/../amplify/data/resource';
import { useRouter } from 'next/navigation';

const client = generateClient<Schema>({ authMode: 'userPool' });

type UserType = any;

type AuthContextType = {
  user: UserType;
  loading: boolean;
  refetchUser: () => Promise<void>; // To manually refresh user data
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  const redirectBackToSignIn = () => {
    window.location.href = '/signin';
  };

  async function fetchUser() {
    try {
      // Step 1: Check if user is authenticated
      let currentUser;
      currentUser = await getCurrentUser();

      if (!currentUser) {
        console.log('User is not authenticated, redirecting to /signin');
        redirectBackToSignIn();
        return;
      }

      // Step 2: Fetch user attributes
      const userAttributes = await fetchUserAttributes();
      const email = userAttributes.email;

      if (!email) {
        console.error('No email found in user attributes');
        return;
      }

      // Step 3: Check if user exists in DB
      const { data: userData } = await client.models.User.list({
        filter: { email: { eq: email } },
      });

      if (!userData || userData.length === 0) {
        // Step 4: Create user if not found
        const newUser = await client.models.User.create(
          {
            email,
            firstName: '',
            family_name: '',
            owner: currentUser.userId,
          },
          { authMode: 'userPool' }
        );
        console.log(newUser);
        setUser(newUser.data);
      } else {
        setUser(userData[0]);
      }
    } catch (error) {
      redirectBackToSignIn(); 
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const refetchUser = async () => {
    setLoading(true);
    await fetchUser();
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, refetchUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
