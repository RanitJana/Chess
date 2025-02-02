import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import AuthContext from "./context/AuthContext.jsx";
import SocketContext from "./context/SocketContext.jsx";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import preloadImages from "./utils/PreLoadImages.js";

preloadImages();

createRoot(document.getElementById("root")).render(
  <>
    <Toaster toastOptions={{ style: { zIndex: 9999 } }} reverseOrder={false} />
    <BrowserRouter>
      <AuthContext>
        <SocketContext>
          <App />
        </SocketContext>
      </AuthContext>
    </BrowserRouter>
  </>
);
