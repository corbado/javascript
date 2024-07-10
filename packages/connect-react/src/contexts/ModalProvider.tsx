import type { FC, PropsWithChildren, ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import ModalContext, { ModalContextProps } from './ModalContext';
import { Modal } from '../components/shared/Modal';

export const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalChildren, setChildren] = useState<ReactNode>();

  const show = useCallback(
    (children: ReactNode) => {
      setChildren(children);
      setIsModalVisible(true);
    },
    [setIsModalVisible, setChildren],
  );

  const hide = useCallback(() => {
    setChildren(undefined);
    setIsModalVisible(false);
  }, [setIsModalVisible, setChildren]);

  const contextValue = useMemo<ModalContextProps>(
    () => ({
      isModalVisible,
      show,
      hide,
    }),
    [isModalVisible, show, hide],
  );

  return (
    <ModalContext.Provider value={contextValue}>
      <Modal isVisible={isModalVisible}>{modalChildren}</Modal>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
