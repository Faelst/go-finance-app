import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as AuthSessions from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string | undefined;
}

interface AuthContextData {
  user: User;
  userStorageLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}

const USER_STORAGE_KEY = '@gofinances:user';

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  const signInWithApple = async () => {
    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credentials) {
        const name = credentials.fullName?.givenName;
        const userLogged = {
          id: String(credentials.user),
          email: credentials.email,
          name,
          photo: `https://ui-avatars.com/api/?name=${name}`,
        } as User;

        setUser(userLogged);

        await AsyncStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(userLogged)
        );
      }
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const CLIENT_ID = '';
      const REDIRECT_URI = '';
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { type, params } = (await AuthSessions.startAsync({
        authUrl,
      })) as AuthorizationResponse;

      if (type === 'success') {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`
        );

        const userInfo = await response.json();

        setUser({
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture,
        });

        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userInfo));
      }
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    setUser({} as User);

    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  };

  useEffect(() => {
    const getUserLogged = async () => {
      const userString = await AsyncStorage.getItem(USER_STORAGE_KEY);

      if (userString) {
        setUser(JSON.parse(userString));
      }

      setUserStorageLoading(false);
    };

    getUserLogged();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userStorageLoading,
        signInWithGoogle,
        signInWithApple,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
