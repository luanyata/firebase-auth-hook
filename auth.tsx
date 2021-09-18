import { FirebaseError } from 'firebase/app';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  UserCredential,
  AuthProvider,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import api from './axios';
import auth from './firebase';

type AuthenticationProviderProps = {
  children: ReactNode;
};

type Credential = {
  name: string;
  password: string;
};

type AuthState = {
  token: string;
  user: User;
};

interface AuthContextData {
  user: User;
  signInGoogle(): Promise<void>;
  signInFacebook(): Promise<void>;
  signInEmailAndPassword({ name, password }: Credential): Promise<void>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthenticationProvider: React.FC<AuthenticationProviderProps> = ({
  children,
}: AuthenticationProviderProps) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Yata:token');
    const user = localStorage.getItem('@Yata:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const handleUserCredentialWithPopup = async (
    provider: AuthProvider,
  ): Promise<UserCredential> => {
    return signInWithPopup(auth, provider);
  };

  const handleCredencialAuthentication = async (
    userCredential: UserCredential,
  ): Promise<void> => {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      const { user } = userCredential;

      localStorage.setItem('@Yata:token', token);
      localStorage.setItem('@Yata:user', JSON.stringify(user));

      api.defaults.headers.authorization = `Bearer ${token}`;

      setData({ token, user });
    }
  };

  const signInGoogle = useCallback(async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      const userCrendential = await handleUserCredentialWithPopup(
        googleProvider,
      );
      handleCredencialAuthentication(userCrendential);
    } catch (error) {
      GoogleAuthProvider.credentialFromError(error as FirebaseError);
    }
  }, []);

  const signInFacebook = useCallback(async () => {
    const facebookProvider = new FacebookAuthProvider();
    try {
      const userCrendential = await handleUserCredentialWithPopup(
        facebookProvider,
      );
      handleCredencialAuthentication(userCrendential);
    } catch (error) {
      FacebookAuthProvider.credentialFromError(error as FirebaseError);
    }
  }, []);

  const signInEmailAndPassword = useCallback(
    async ({ name, password }: Credential) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          name,
          password,
        );
        handleCredencialAuthentication(userCredential);
      } catch (error) {
        console.warn(error);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    await auth.signOut();
    localStorage.removeItem('@Yata:token');
    localStorage.removeItem('@Yata:user');

    setData({} as AuthState);
  }, []);

  const context = {
    user: data.user,
    signInGoogle,
    signInFacebook,
    logout,
    signInEmailAndPassword,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export { AuthenticationProvider, useAuth };
