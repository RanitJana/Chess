/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useContext, createContext } from "react";

const authContext = createContext();

export function useAuthContext() {
  return useContext(authContext);
}

export default function AuthContext({ children }) {
  return <authContext.Provider value={{}}>{children}</authContext.Provider>;
}
