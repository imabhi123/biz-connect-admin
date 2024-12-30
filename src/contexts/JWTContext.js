import PropTypes from "prop-types";
import { createContext, useEffect, useReducer } from "react";
// utils
import axios from "../utils/axios";
import { isValidToken, setSession } from "../utils/jwt";

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  role: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user, role } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      role,
    };
  },
  LOGIN: (state, action) => {
    const { user, role } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user,
      role,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    role: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  method: "jwt",
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await axios.post("/api/v1/admin/profile", {
            token: localStorage.getItem('accessToken'),
          });
          const { user, role } = response.data;

          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user,
              role,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
              role: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
            role: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post("/api/v1/admin/login", {
      username: email,
      password: password,
    });
    localStorage.setItem('userId',response.data.admin?._id);
    const { user, role } = response.data;
    const accessToken = response.data.accessToken;
    setSession(accessToken);

    dispatch({
      type: "LOGIN",
      payload: {
        user,
        role,
      },
    });
  };

  const register = async (email, password, firstName, lastName) => {
    const response = await axios.post("/api/v1/accounts/register", {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;
    // console.log(response.data.data.admin._id);
    localStorage.setItem('userId',response.data.admin?._id);

    localStorage.setItem("accessToken", accessToken);

    dispatch({
      type: "REGISTER",
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
