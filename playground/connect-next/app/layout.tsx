'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { CorbadoConnectProvider, CorbadoConnectModal } from '@corbado/connect-react';
import ReactDOM from 'react-dom';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <CorbadoConnectProvider
          projectId={process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID!}
          frontendApiUrlSuffix={process.env.NEXT_PUBLIC_CORBADO_FRONTEND_API_URL_SUFFIX}
          isDebug={true}
        >
          {children}
        </CorbadoConnectProvider>
      </body>
    </html>
  );
}
