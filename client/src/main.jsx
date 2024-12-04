import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import AuthContext from "./context/AuthContext.jsx";
import SocketContext from "./context/SocketContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <AuthContext>
        <SocketContext>
          <App />
        </SocketContext>
      </AuthContext>
    </BrowserRouter>
  </>
);
