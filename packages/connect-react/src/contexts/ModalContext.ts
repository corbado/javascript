import { createContext, ReactNode } from 'react';

const missingImplementation = (): never => {
  throw new Error('Please make sure that your components are wrapped inside <ModalContext/>');
};

export interface ModalContextProps {
  isModalVisible: boolean;
  show: (children: ReactNode) => void;
  hide: () => void;
}

export const initialContext: ModalContextProps = {
  isModalVisible: false,
  show: missingImplementation,
  hide: missingImplementation,
};

const ModalContext = createContext<ModalContextProps>(initialContext);

export default ModalContext;
