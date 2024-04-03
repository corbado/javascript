import { Suspense } from 'react';
// import CurrentUser from '../ui/dashboard/current-user';
import Loading from '../ui/dashboard/loading';
import SessionDetails from '../ui/dashboard/session-details';

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      {/* TODO: Uncomment the following line to display the current user details after Node SDK has added support for frontend API v2 */}
      {/* <CurrentUser /> */}
      <SessionDetails />
    </Suspense>
  );
}
