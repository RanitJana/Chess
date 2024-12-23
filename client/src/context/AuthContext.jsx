/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useContext, createContext, useState, useEffect } from "react";
import { verify } from "../api/auth";

const authContext = createContext();

export function useAuthContext() {
  return useContext(authContext);
}

const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
};

export { getCookie };

export default function AuthContext({ children }) {
  const [isAuth, setAuth] = useState(false);

  useEffect(() => {
    const handleVerify = async () => {
      try {
        let response = await verify();
        if (response?.success) setAuth(true);
      } catch (error) {
        console.log(error?.message);
      }
    }
    handleVerify();
  }, [])

  return (
    <authContext.Provider value={{ isAuth, setAuth }}>
      {children}
    </authContext.Provider>
  );
}
