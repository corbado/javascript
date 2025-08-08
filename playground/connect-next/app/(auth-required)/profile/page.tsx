'use client';

import PasskeySection from './PasskeySection';
import { AccountSection } from './AccountSection';
import DangerSection from './DangerSection';
import MFASection from './MFASection';
import Section from './Section';

export default function Page() {
  return (
    <div className='flex flex-1 items-center justify-center bg-gray-50'>
      <div className='flex flex-col gap-10 p-10 max-w-4xl w-full mb-10'>
        <h1 className='text-2xl font-bold'>Your profile</h1>
        <Section headline='Passkeys'>
          <PasskeySection />
        </Section>
        <Section headline='Account'>
          <AccountSection />
        </Section>
        <Section headline='MFA Settings'>
          <MFASection />
        </Section>
        <Section headline='Danger Section'>
          <DangerSection />
        </Section>
      </div>
    </div>
  );
}
