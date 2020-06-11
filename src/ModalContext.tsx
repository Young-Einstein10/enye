import React, { useState, createContext, FunctionComponent } from "react";

interface ContextProps {
  isVisible: boolean;
  showModal: () => void;
  closeModal: () => void;
}

type Props = {
  children?: React.ReactNode;
};

const ModalContext = createContext<Partial<ContextProps>>({});

const ModalProvider: FunctionComponent = ({ children }: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  const showModal = () => {
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
  };

  return (
    <ModalContext.Provider
      value={{
        showModal,
        closeModal,
        isVisible,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;
export { ModalProvider };
