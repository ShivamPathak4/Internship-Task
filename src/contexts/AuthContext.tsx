import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp, signUp, verifyEmail, login, logout, forgotPassword, resetPassword } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  verifyEmail: (code: string) => Promise<boolean>;
  needsVerification: boolean;
  userEmail: string;
  sendOtp: (email: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (password: string, confirmPassword: string, token: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleSendOtp = async (email: string): Promise<boolean> => {
    setUserEmail(email);
    const success = await sendOtp(email, navigate);
    if (success) {
      setNeedsVerification(true);
    }
    return success;
  };

  const handleSignup = async (name: string, email: string, password: string): Promise<boolean> => {
    setUserEmail(email);
    const success = await signUp(name, email, password, navigate);
    if (success) {
      setNeedsVerification(true);
    }
    return success;
  };

  const handleVerifyEmail = async (code: string): Promise<boolean> => {
    const success = await verifyEmail(code, userEmail, (userData: User) => {
      setUser(userData);
    });
    if (success) {
      setNeedsVerification(false);
      navigate('/interests');
    }
    return success;
  };

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const success = await login(email, password, (userData: User) => {
      setUser(userData);
    }, navigate);
    return success;
  };

  const handleLogout = () => {
    logout(navigate, setUser);
  };

  const handleForgotPassword = async (email: string): Promise<boolean> => {
    return await forgotPassword(email, (value: boolean) => {
      setUserEmail(value ? email : '');
    });
  };

  const handleResetPassword = async (password: string, confirmPassword: string, token: string): Promise<boolean> => {
    return await resetPassword(password, confirmPassword, token, () => {
      navigate('/login');
    });
  };

  const value: AuthContextType = {
    user,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    isAuthenticated: !!user,
    verifyEmail: handleVerifyEmail,
    needsVerification,
    userEmail,
    sendOtp: handleSendOtp,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};