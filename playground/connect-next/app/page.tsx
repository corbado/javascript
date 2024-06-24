import Link from 'next/link';

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
    </div>
  );
}
