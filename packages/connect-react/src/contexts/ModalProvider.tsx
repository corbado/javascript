import type { FC, PropsWithChildren, ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';

import type { ModalContextProps } from './ModalContext';
import ModalContext from './ModalContext';

export const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalChildren, setChildren] = useState<ReactNode | null>(null);

  const show = useCallback(
    (children: ReactNode) => {
      setChildren(children);
      setIsModalVisible(true);
    },
    [setIsModalVisible, setChildren],
  );

  const hide = useCallback(() => {
    setChildren(null);
    setIsModalVisible(false);
  }, [setIsModalVisible, setChildren]);

  const contextValue = useMemo<ModalContextProps>(
    () => ({
      isModalVisible,
      children: modalChildren,
      show,
      hide,
    }),
    [isModalVisible, show, hide],
  );

  return <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>;
};

export default ModalProvider;
