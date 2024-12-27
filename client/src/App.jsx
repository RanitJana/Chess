import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home.jsx";
import Game from "./pages/Game.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/Profile.jsx";
import Friends from "./pages/Friends.jsx";
import { useAuthContext } from "./context/AuthContext.jsx";

export default function App() {
  const { isAuth } = useAuthContext();

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/"
          element={isAuth ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/member/:userId"
          element={isAuth ? <Profile /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/friends/:userId"
          element={isAuth ? <Friends /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/game/:gameId"
          element={isAuth ? <Game /> : <Navigate to={"/login"} />}
        />
        <Route path="*" element={<Navigate to={"/login"} />} />
      </Routes>
      <Toaster />
    </>
  );
}
