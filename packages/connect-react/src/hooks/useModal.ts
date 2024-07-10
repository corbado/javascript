import { useContext } from 'react';

import ModalContext, { ModalContextProps } from '../contexts/ModalContext';

const useModal = (context = ModalContext): ModalContextProps => {
  const modalContext = useContext(context);

  if (!modalContext) {
    throw new Error('Please make sure that your components are wrapped inside <ModalContextProvider />');
  }

  return modalContext;
};

export default useModal;
