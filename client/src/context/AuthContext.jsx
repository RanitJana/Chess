/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useContext, createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import { verify } from "../api/auth";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";

const authContext = createContext();

export function useAuthContext() {
  return useContext(authContext);
}

const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
};

// const setCookie = (name, value, days = 7) => {
//   const expires = new Date();
//   expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
//   document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
// };

export { getCookie };

export default function AuthContext({ children }) {
  const [isLoading, setLoading] = useState(true); // Default to true
  const [isAuth, setAuth] = useState(false);
  const [playerInfo, setPlayerInfo] = useState(null);

  const location = useLocation(); // Hook to access the current route

  useEffect(() => {
    const handleVerify = async () => {
      try {
        setLoading(true);
        let response = await verify();
        if (response?.data.success) {
          setPlayerInfo(response.data.player);
          setAuth(true);
        }
      } catch (error) {
        console.log(error?.message);
      } finally {
        setLoading(false);
      }
    };

    handleVerify();
  }, []);

  return (
    <authContext.Provider value={{ isAuth, setAuth, playerInfo }}>
      {/* <img src="/images/tile.png" alt="" className="fixed bottom-0 w-full" /> */}
      <div className="bg-[hsl(40,7%,18%)] bg-[url('/images/tile.png')] bg-bottom bg-contain bg-no-repeat overflow-y-scroll h-[100dvh]">
        <div className="min-h-fit">
          {isLoading ? (
            <div className="w-[100dvw] h-[100dvh] min-h-[10rem] flex items-center justify-center">
              <span className="loader"></span>
            </div>
          ) : isAuth ? (
            children
          ) : location.pathname === "/login" ? ( // Check the current route
            <Login />
          ) : location.pathname === "/signup" ? (
            <SignUp />
          ) : (
            <Login /> // Default to Login if the path doesn't match
          )}
        </div>
      </div>
    </authContext.Provider>
  );
}
