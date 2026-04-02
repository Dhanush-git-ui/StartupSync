import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useGoogleLogin, googleLogout, CodeResponse, TokenResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  picture: string;
  exp: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleSuccess = async (credentialResponse: CodeResponse | TokenResponse) => {
    if ('credential' in credentialResponse && credentialResponse.credential) {
      try {
        const decoded: JwtPayload = jwtDecode(credentialResponse.credential as string);
        const userData: User = {
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setLoading(false);
      } catch (error) {
        console.error('Error processing Google credentials:', error);
        handleError();
      }
    } else {
      handleError();
    }
  };

  const handleError = () => {
    if (import.meta.env.DEV) {
      console.log('Login Failed');
    }
    setLoading(false);
  };

  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleSignInWithGoogle = () => {
    login();
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle: handleSignInWithGoogle, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};