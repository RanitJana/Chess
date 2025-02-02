import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home.jsx";
import Game from "./pages/Game.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/Profile.jsx";
import Friends from "./pages/Friends.jsx";
import Edit from "./pages/Edit.jsx";
import { useAuthContext } from "./context/AuthContext.jsx";
import { useEffect } from "react";

export default function App() {
  const { isAuth } = useAuthContext();

  useEffect(() => {
    // function toggleFullscreen() {
    //   const element = document.documentElement;
    //   try {
    //     if (!document.fullscreenElement &&    // Standard
    //       !document.webkitFullscreenElement &&  // Safari
    //       !document.mozFullScreenElement &&     // Firefox
    //       !document.msFullscreenElement) {      // IE/Edge
    //       // Enter fullscreen
    //       if (element.requestFullscreen) {
    //         element.requestFullscreen();
    //       } else if (element.webkitRequestFullscreen) { // Safari
    //         element.webkitRequestFullscreen();
    //       } else if (element.mozRequestFullScreen) { // Firefox
    //         element.mozRequestFullScreen();
    //       } else if (element.msRequestFullscreen) { // IE/Edge
    //         element.msRequestFullscreen();
    //       }
    //     } else {
    //       // Exit fullscreen
    //       if (document.exitFullscreen) {
    //         document.exitFullscreen();
    //       } else if (document.webkitExitFullscreen) { // Safari
    //         document.webkitExitFullscreen();
    //       } else if (document.mozCancelFullScreen) { // Firefox
    //         document.mozCancelFullScreen();
    //       } else if (document.msExitFullscreen) { // IE/Edge
    //         document.msExitFullscreen();
    //       }
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    // toggleFullscreen();
  }, []);

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
          path="/member/edit"
          element={isAuth ? <Edit /> : <Navigate to={"/login"} />}
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
