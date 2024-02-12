import AcmeLogo from '@/app/ui/acme-logo';
import Image from 'next/image';
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import SignoutButtonWrapper from './signout-button-wrapper';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="flex w-32 flex-col items-center text-white md:w-40">
          <Image
            src="/corbado-logo.svg"
            width={200}
            height={200}
            alt="Acme logo"
          ></Image>
          <span className="px-2 text-3xl text-white md:text-5xl">+</span>
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <SignoutButtonWrapper />
      </div>
    </div>
  );
}
