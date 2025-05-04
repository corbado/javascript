'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import WrappedCorbadoConnectProvider from '@/components/ClientWrapper';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <WrappedCorbadoConnectProvider>{children}</WrappedCorbadoConnectProvider>
      </body>
    </html>
  );
}
