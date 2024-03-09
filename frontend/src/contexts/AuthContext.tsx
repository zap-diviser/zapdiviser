import { createContext, useEffect, useReducer, ReactElement, useContext } from 'react';

import jwtDecode from 'jwt-decode';

import { LOGIN, LOGOUT } from 'store/reducers/actions';
import authReducer from 'store/reducers/auth';

import axios from 'utils/axios';
import { KeyedObject } from 'types/root';
import { AuthProps, JWTContextType } from 'types/auth';
import { useNavigate } from 'react-router';
import { userService } from 'services/user';

// constant
const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken: (st: string) => boolean = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded: KeyedObject = jwtDecode(serviceToken);
  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken?: string | null) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const AuthContext = createContext<JWTContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactElement }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          const response = await axios.get('user');
          const user = response.data;

          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await userService.login({ email, password });
    setSession(data.access_token);
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user: data
      }
    });
  };

  const register = async (email: string, password: string, name: string, phone: string) => {
    const data = await userService.register({
      email,
      password,
      name,
      phone: phone.replace(/\D/g, '')
    });

    window.localStorage.setItem('user', JSON.stringify(data));

    setSession(data.access_token);

    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user: data
      }
    });
    navigate('/config');
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async (email: string) => {
    const response = await axios.post('user/forget-password', {
      email
    });

    return response.data;
  };

  const resetPasswordWithCode = async (email: string, code: string, newPassword: string) => {
    return await userService.forgetPassword({ email, code, newPassword });
  };

  const checkCodeIsValid = async (email: string, code: string) => {
    return await userService.checkCodeIsValid({ email, code });
  };

  const updateProfile = () => {};

  const navigate = useNavigate();

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        resetPassword,
        updateProfile,
        checkCodeIsValid,
        resetPasswordwithCode: resetPasswordWithCode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('context must be use inside provider');

  return context;
};
