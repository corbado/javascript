'use client';
export const runtime = 'edge';

import Link from 'next/link';
import { hello, hello2 } from '@/app/actions';

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>
        <Link href='login'>Login</Link>
      </p>
      <p>
        <Link href='signup'>Signup</Link>
      </p>
      <button onClick={() => hello()}>Test action</button>
      <button onClick={() => hello2()}>Test action</button>
    </div>
  );
}
