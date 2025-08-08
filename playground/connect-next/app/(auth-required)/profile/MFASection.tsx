import { useEffect, useState } from 'react';
import { fetchMFAPreference } from 'aws-amplify/auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

type MfaInfo = {
  preferred?: string;
  enabledSMS: boolean;
  enabledTOTP: boolean;
};

export const MFASection = () => {
  const [mfaInfo, setMfaInfo] = useState<MfaInfo | undefined>();
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const mfaPrefs = await fetchMFAPreference();
        let enabledSMS = false,
          enabledTOTP = false;
        (mfaPrefs.enabled ?? []).forEach((mfaType: string) => {
          if (mfaType === 'SMS') {
            enabledSMS = true;
          } else if (mfaType === 'TOTP') {
            enabledTOTP = true;
          }
        });

        setMfaInfo({
          preferred: mfaPrefs.preferred?.toString(),
          enabledSMS,
          enabledTOTP,
        });
      } catch (err) {
        console.error('Failed to load user info:', err);
      }
    }

    void loadUser();
  }, []);

  if (!mfaInfo) {
    return <Skeleton className='h-[150px]'></Skeleton>;
  }

  const mfaData = mfaInfo && {
    'Preferred MFA': mfaInfo.preferred || 'Not Set',
    'SMS Enabled': mfaInfo.enabledSMS ? 'Yes' : 'No',
    'TOTP Enabled': mfaInfo.enabledTOTP ? 'Yes' : 'No',
  };

  return (
    <div className='flex justify-between'>
      <div className='grid grid-cols-1 gap-4 text-sm'>
        {mfaData &&
          Object.entries(mfaData).map(([label, value]) => (
            <div key={label}>
              <div className='font-medium text-gray-600'>{label}</div>
              <div className='text-gray-900 break-words'>{value}</div>
            </div>
          ))}
      </div>
      <div className='mt-1'>
        <Button onClick={() => router.push('/setup-mfa')}>Configure</Button>
      </div>
    </div>
  );
};

export default MFASection;
