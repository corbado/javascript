import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <Image
          src="/corbado-logo.svg"
          width={200}
          height={200}
          alt="Acme logo"
        ></Image>
        <span className="px-2 text-3xl text-white md:text-5xl">+</span>
        <AcmeLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to Corbado + Acme</strong>
          </p>
          <p>
            <a
              href="https://www.corbado.com/"
              className="text-blue-500"
              target="_blank"
            >
              Corbado
            </a>{' '}
            - Offer Passkeys To Your Users. Corbado lets your users{' '}
            <span className="font-bold">log in via Face ID or Touch ID</span> to
            boost conversion, improve UX and increase security - regardless if
            you already have users or not.
          </p>
          <p>
            Acme is the{' '}
            <a
              href="https://nextjs.org/learn/"
              className="text-blue-500"
              target="_blank"
            >
              Next.js Learn Course
            </a>
            , brought to you by Vercel.
          </p>
          <p>
            This example demonstrates how to combine the{' '}
            <a
              href="https://docs.corbado.com/frontend-integration/react"
              className="text-blue-500"
              target="_blank"
            >
              Corbado' React Package
            </a>{' '}
            and
            <a
              href="https://docs.corbado.com/backend-integration/node.js-sdk"
              className="text-blue-500"
              target="_blank"
            >
              {' '}
              Corbado's NodeJS SDK
            </a>
            and integrate it with Next.js for a seamless user experience.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Go to Application</span>{' '}
            <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src="/flow-diagram.png"
            width={1000}
            height={760}
            className="md:block"
            alt="Corbado Flow Diagram"
          />
        </div>
      </div>
    </main>
  );
}
