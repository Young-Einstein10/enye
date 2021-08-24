import React, { useState, createContext, FunctionComponent } from "react";

interface ContextProps {
  isVisible: boolean;
  showModal: () => void;
  closeModal: () => void;
}

type Props = {
  children?: React.ReactNode;
};

const ModalContext = createContext<ContextProps>({
  isVisible: false,
  showModal: () => {},
  closeModal: () => {},
});

const ModalProvider: FunctionComponent = ({ children }: Props) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

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
