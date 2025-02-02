/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useContext, createContext, useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom"; // Import useLocation
import { verify } from "../api/auth";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import getCountryNameFlag from "../utils/getCountryNameFlag.js";

const authContext = createContext();

export function useAuthContext() {
  return useContext(authContext);
}

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
          const info = response.data.player;
          info.nationality = { ...getCountryNameFlag(info.nationality) };
          setPlayerInfo(info);
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

  if (isLoading)
    return (
      <div className="bg-[hsl(40,7%,18%)] overflow-y-scroll w-[100dvw] h-[100dvh] min-h-[10rem] flex items-center justify-center">
        <span className="loader"></span>
      </div>
    );

  return (
    <authContext.Provider
      value={{ isAuth, setAuth, playerInfo, setPlayerInfo }}
    >
      <div className="bg-[hsl(40,7%,18%)] overflow-y-scroll h-[100dvh]">
        <div className="min-h-fit">
          {location.pathname == "/login" ? (
            <Login />
          ) : location.pathname == "/signup" ? (
            <SignUp />
          ) : isAuth ? (
            children
          ) : (
            <Navigate to={"/login"} />
          )}
        </div>
      </div>
    </authContext.Provider>
  );
}
