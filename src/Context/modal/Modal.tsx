import React, { useState, createContext, FunctionComponent } from "react";
import { ContextProps } from "./types";

export const ModalContext = createContext<ContextProps>({
  isVisible: false,
  showModal: () => {},
  closeModal: () => {},
});

const ModalProvider: FunctionComponent = ({ children }) => {
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

export default ModalProvider;
