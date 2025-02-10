import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Auth from '@/components/auth/Auth';
import '@aws-amplify/ui-react/styles.css';
import Navbar from '@/components/Navbar';
import './globals.css';
import { isAuthenticated } from '@/utils/amplify-utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MVP',
  description: 'This is a mvp app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const signedIn = await isAuthenticated();
  console.log(signedIn);

  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar isSignedIn={signedIn}></Navbar>
        <Auth>{children}</Auth>
      </body>
    </html>
  );
}
