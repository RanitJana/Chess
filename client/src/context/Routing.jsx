import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import Game from "../pages/Game.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route path="game/:gameId" element={<Game />} />
    </Route>
  )
);

export default router;
