import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home.jsx";
import Game from "./pages/Game.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import { useAuthContext } from "./context/AuthContext.jsx";

export default function App() {
  const { isAuth } = useAuthContext();

  return (
    <div className="bg-[hsl(40,7%,18%)] h-[100dvh] min-h-fit">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/"
          element={isAuth ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/game/:gameId"
          element={isAuth ? <Game /> : <Navigate to={"/login"} />}
        />
        <Route path="*" element={<Navigate to={"/login"} />} />
      </Routes>
      <Toaster />
    </div>
  );
}
