import React, {
  createContext,
  useState,
  useEffect,
  FunctionComponent,
} from "react";
import { auth } from "../utils/Firebase";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
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
  setUser: (user: any) => void;
}

export const UserContext = createContext<ContextProps>({
  userState: {
    user: null,
    loaded: false,
  },
  onLogout: () => {},
  isSignedIn: (action: boolean) => {},
  setUser: (user: any) => {},
});

const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

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
    } else {
      setSignedIn(false);
      history.push("/signin");
    }
  };

  const setUser = (user: any) => {
    setUserState((userState) => ({ ...userState, user, loaded: true }));
    history.push("/main");
  };

  const onLogout = () => {
    setUserState({ ...userState, loaded: false, user: null });
  };

  const spinnerStyles = {
    display: "flex",
    justifyContent: "center",
    height: "100vh",
    alignItems: "center",
  };

  return (
    <UserContext.Provider
      value={{
        userState,
        onLogout,
        isSignedIn,
        setUser,
      }}
    >
      {isLoading ? (
        <div style={spinnerStyles}>
          <Spin indicator={antIcon} />
        </div>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
};

export default UserProvider;
