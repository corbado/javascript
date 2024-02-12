import { Suspense } from 'react';
import CurrentUser from '../ui/dashboard/current-user';
import Loading from '../ui/dashboard/loading';

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <CurrentUser />
    </Suspense>
  );
}
