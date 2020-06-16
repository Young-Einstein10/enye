import React, {
  createContext,
  useState,
  useEffect,
  FunctionComponent,
} from "react";
import { auth } from "../utils/Firebase";
import { createUserDocument, collectIdsAndData } from "../utils/utilities";
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
  isSignedIn: (action: boolean) => void;
}

export const UserContext = createContext<ContextProps>({
  userState: {
    user: null,
    loaded: false,
  },
  onLogout: () => {},
  isSignedIn: (action: boolean) => {},
});

const UserProvider: FunctionComponent = ({ children }: Props) => {
  const [userState, setUserState] = useState<UserState>({
    user: null,
    loaded: false,
  });
  const [signedIn, setSignedIn] = useState(false);
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
    if (signedIn) {
      history.push("/main");
    }
    return () => {
      unsubscribeFromAuth();
    };
  }, [history, signedIn]);

  const isSignedIn = (action: boolean) => {
    if (action === true) {
      setSignedIn(true);
      history.push("/main");
    } else {
      setSignedIn(false);
      history.push("/signin");
    }
  };

  const onLogout = () => {
    setUserState({ ...userState, loaded: false, user: null });
  };

  return (
    <UserContext.Provider
      value={{
        userState,
        onLogout,
        isSignedIn,
      }}
    >
      {isLoading ? <p>Loading App....</p> : children}
    </UserContext.Provider>
  );
};

export default UserProvider;
