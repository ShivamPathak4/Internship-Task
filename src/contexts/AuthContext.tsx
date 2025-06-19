// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: { id: string } | null;
  userEmail: string;
  isAuthenticated: boolean;
  sendOTP: (email: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, otp: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  verifyEmail: (code: string) => Promise<boolean>;
  logout: () => void;
}

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  const sendOTP = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('https://loginsignupbackend-vf5l.onrender.com/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setUserEmail(email);
        return true;
      } else {
        throw new Error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      throw error;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    otp: string
  ): Promise<boolean> => {
    try {
      const response = await fetch('https://loginsignupbackend-vf5l.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, otp }),
      });
      const data: { token: string; message: string } = await response.json();
      if (response.ok) {
        const decoded: DecodedToken = jwtDecode(data.token);
        localStorage.setItem('token', data.token);
        setUser({ id: decoded.userId });
        return true;
      } else {
        throw new Error(data.message || 'Signup failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data: { token: string; message: string } = await response.json();
      if (response.ok) {
        const decoded: DecodedToken = jwtDecode(data.token);
        localStorage.setItem('token', data.token);
        setUser({ id: decoded.userId });
        return true;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const verifyEmail = async (code: string): Promise<boolean> => {
    try {
      const response = await fetch('https://loginsignupbackend-vf5l.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          otp: code,
          name: localStorage.getItem('signupName'),
          password: localStorage.getItem('signupPassword'),
        }),
      });
      const data: { token: string; message: string } = await response.json();
      if (response.ok) {
        const decoded: DecodedToken = jwtDecode(data.token);
        localStorage.setItem('token', data.token);
        setUser({ id: decoded.userId });
        localStorage.removeItem('signupName');
        localStorage.removeItem('signupPassword');
        return true;
      } else {
        throw new Error(data.message || 'Invalid verification code');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUser({ id: decoded.userId });
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, userEmail, isAuthenticated, sendOTP, signup, login, verifyEmail, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
