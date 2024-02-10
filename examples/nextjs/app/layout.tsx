import '@/app/ui/global.css';

import { Metadata } from 'next';
import { inter } from '@/app/ui/fonts';

export const metadata: Metadata = {
  title: 'Corbado Next Demo',
  description:
    "The official Corbado Next.js demo built on top of Vercel's Next.js Learn course.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
