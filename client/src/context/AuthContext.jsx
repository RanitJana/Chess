/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useContext, createContext, useState, useEffect } from "react";

const authContext = createContext();

export function useAuthContext() {
  return useContext(authContext);
}

const getCookie = (name) => {
  console.log(document.cookie);

  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
};

export { getCookie };

export default function AuthContext({ children }) {
  const [isAuth, setAuth] = useState(
    (JSON.parse(localStorage.getItem("user"))) ||
      false
    );

  return (
    <authContext.Provider value={{ isAuth, setAuth }}>
      {children}
    </authContext.Provider>
  );
}
