/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useContext, createContext, useState } from "react";

const authContext = createContext();

export function useAuthContext() {
  return useContext(authContext);
}

export default function AuthContext({ children }) {

  const [isAuth, setAuth] = useState(JSON.parse(localStorage.getItem("user")) || false);

  return <authContext.Provider value={{ isAuth, setAuth }}>{children}</authContext.Provider>;
}
