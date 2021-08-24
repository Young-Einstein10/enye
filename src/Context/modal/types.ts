export interface ContextProps {
  isVisible: boolean;
  showModal: () => void;
  closeModal: () => void;
}

export type Props = {
  children?: React.ReactNode;
};
