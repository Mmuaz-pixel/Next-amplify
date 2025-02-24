'use client';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Auth from '@/components/auth/Auth';
import '@aws-amplify/ui-react/styles.css';
import Navbar from '@/components/Navbar';
import './globals.css';
import { Amplify } from 'aws-amplify';
import outputs from '@/../amplify_outputs.json';
import { UserProvider } from '@/providers/UserProvider';
import { usePathname } from 'next/navigation';

Amplify.configure(outputs, { ssr: true });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  
  const pathname = usePathname(); // ✅ Correct way to get the pathname
  const isExcluded = pathname === '/signin';

  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar isSignedIn={true} />
        <Auth>
          {!isExcluded ? <UserProvider>{children}</UserProvider> : children}
        </Auth>
      </body>
    </html>
  );
}
