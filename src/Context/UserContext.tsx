import React, {
  createContext,
  useState,
  useEffect,
  FunctionComponent,
} from "react";
import { auth } from "../Firebase";
import { createUserDocument, collectIdsAndData } from "../utilities";
import { useHistory } from "react-router-dom";

type Props = {
  children?: React.ReactNode;
};

type UserState = {
  user: null;
  loaded: boolean;
};

interface ContextProps {
  userState: UserState;
  onLogout: () => void;
}

export const UserContext = createContext<ContextProps>({
  userState: {
    user: null,
    loaded: false,
  },
  onLogout: () => {},
});

const UserProvider: FunctionComponent = ({ children }: Props) => {
  const [userState, setUserState] = useState<UserState>({
    user: null,
    loaded: false,
  });
  const [isLoading, setisLoading] = useState(true);

  let history = useHistory();

  useEffect(() => {
    let unsubscribeFromAuth: null | any = null;
    unsubscribeFromAuth = auth.onAuthStateChanged(async (userInfo) => {
      const userRef: any = await createUserDocument(userInfo, {});

      if (userRef) {
        userRef.onSnapshot((snapshot: any) => {
          const user = collectIdsAndData(snapshot);
          setUserState((userState) => ({ ...userState, user, loaded: true }));
        });
        setisLoading(false);
      } else {
        // history.push("/signin");
        setisLoading(false);
      }
    });
    return () => {
      unsubscribeFromAuth();
    };
  }, [history]);

  const onLogout = () => {
    setUserState({ ...userState, loaded: false, user: null });
  };

  return (
    <UserContext.Provider
      value={{
        userState,
        onLogout,
      }}
    >
      {isLoading ? <p>Loading App....</p> : children}
    </UserContext.Provider>
  );
};

export default UserProvider;
