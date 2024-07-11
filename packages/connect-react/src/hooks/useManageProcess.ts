import { useContext } from 'react';

import type { ManageProcessContextProps } from '../contexts/ManageProcessContext';
import ManageProcessContext from '../contexts/ManageProcessContext';

const useManageProcess = (context = ManageProcessContext): ManageProcessContextProps => {
  const manageProcess = useContext(context);

  if (!manageProcess) {
    throw new Error('Please make sure that your components are wrapped inside <ManageProcessProvider />');
  }

  return manageProcess;
};

export default useManageProcess;
