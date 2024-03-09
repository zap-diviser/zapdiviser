import { ReactElement } from 'react';

// ==============================|| TYPES - AUTH  ||============================== //

export type GuardProps = {
  children: ReactElement | null;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
  jwt_token: string;
  stripe_customer_id: string;
  source_data: {
    text: string;
    files: string[];
    qanda: string[];
    saved: boolean;
    website: string[];
  };
  total_messages: number;
  subscription_status: boolean;
  subscription_code: string;
  subscription_end: string;
  subscription_name: string;
  subscription_total_messages: number;
  subscription_generation_limit: number;
};

export interface AuthProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null;
  token?: string | null;
}

export interface AuthActionProps {
  type: string;
  payload?: AuthProps;
}

export interface InitialLoginContextProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
}

export interface JWTDataProps {
  userId: string;
}

export type JWTContextType = {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: VoidFunction;
  checkCodeIsValid: (email: string, code: string) => Promise<void>;
  resetPasswordwithCode: (email: string, code: string, newPassword: string) => Promise<void>;
};
