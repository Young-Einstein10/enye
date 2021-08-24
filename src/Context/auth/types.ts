export type Props = {
  children?: React.ReactNode;
};

export type UserState = {
  user: null;
  loaded: boolean;
};

export interface ContextProps {
  userState: UserState;
  onLogout: () => void;
  isSignedIn: (action: boolean) => void;
  setUser: (user: any) => void;
}
