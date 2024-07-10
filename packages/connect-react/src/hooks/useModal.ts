import { useContext } from 'react';

import type { ModalContextProps } from '../contexts/ModalContext';
import ModalContext from '../contexts/ModalContext';

const useModal = (context = ModalContext): ModalContextProps => {
  const modalContext = useContext(context);

  if (!modalContext) {
    throw new Error('Please make sure that your components are wrapped inside <ModalContextProvider />');
  }

  return modalContext;
};

export default useModal;
