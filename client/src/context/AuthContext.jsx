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

const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export { getCookie };

export default function AuthContext({ children }) {
  const [isLoading, setLoading] = useState(true); // Default to true
  const [isAuth, setAuth] = useState(false);
  const location = useLocation(); // Hook to access the current route

  useEffect(() => {
    const handleVerify = async () => {
      const cookie = getCookie("authToken"); // Replace with your cookie name
      if (cookie) {
        // If cookie is present, assume the user is authenticated
        setAuth(true);
        setLoading(false); // Skip the verification request
      } else {
        // If cookie is not found, proceed to verify authentication
        try {
          setLoading(true);
          let response = await verify();
          if (response?.data.success) {
            // Set the cookie if authentication is successful
            setCookie("authToken", response.data.token); // Set your token or identifier here
            setAuth(true);
          }
        } catch (error) {
          console.log(error?.message);
        } finally {
          setLoading(false);
        }
      }
    };

    handleVerify();
  }, []);

  return (
    <authContext.Provider value={{ isAuth, setAuth }}>
      <div className="bg-[hsl(40,7%,18%)] h-full min-h-[max(25rem,100dvh)]">
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
    </authContext.Provider>
  );
}
