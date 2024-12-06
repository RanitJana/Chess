/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useContext, createContext, useState } from "react";

const authContext = createContext();

export function useAuthContext() {
  return useContext(authContext);
}

const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
};

export default function AuthContext({ children }) {
  const [isAuth, setAuth] = useState(
    (JSON.parse(localStorage.getItem("user")) && getCookie("accessToken")) ||
      false
  );

  return (
    <authContext.Provider value={{ isAuth, setAuth }}>
      {children}
    </authContext.Provider>
  );
}
