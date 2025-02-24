'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Hub } from 'aws-amplify/utils';
import { signOut } from 'aws-amplify/auth';

const Navbar = ({ isSignedIn }: { isSignedIn: boolean }) => {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(isSignedIn);
  useEffect(() => {
    const hubListenerCancel = Hub.listen('auth', (data) => {
      const { payload } = data;
      if (payload.event === 'signedIn') {
        setSignedIn(true);
        router.push('/');
      } else if (payload.event === 'signedOut') {
        setSignedIn(false);
        router.push('/signin');
      }
    });
    return () => {
      hubListenerCancel();
    };
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/signin');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <nav className='bg-gray-800 p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <div className='text-white text-lg font-semibold'>
          <Link href='/'>MVP</Link>
        </div>
        {signedIn && (
          <div className='flex space-x-4'>
            <Link href='/profile' className='text-gray-300 hover:text-white'>
              Profile
            </Link>
            <Link href='/offers' className='text-gray-300 hover:text-white'>
              Offers
            </Link>
            <Link href='/messages' className='text-gray-300 hover:text-white'>
              Messages
            </Link>
            <button
              onClick={handleSignOut}
              className='text-gray-300 hover:text-white'
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
