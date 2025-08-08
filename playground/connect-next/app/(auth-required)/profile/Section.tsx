import { Separator } from '@/components/ui/separator';
import React from 'react';

const Section = ({ children, headline }: { children: React.ReactNode; headline: string }) => {
  return (
    <div>
      <div className='text-xl font-semibold'>{headline}</div>
      <Separator className='my-1' />
      <div className='grid grid-cols-1 gap-4 text-sm'>{children}</div>
    </div>
  );
};

export default Section;
