import SocketContext from "./context/SocketContext.jsx";
import AuthContext from "./context/AuthContext.jsx";
import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div className="bg-[hsl(40,7%,18%)] min-h-[100dvh]">
      <Toaster />
      <AuthContext>
        <SocketContext>
          <Outlet />
        </SocketContext>
      </AuthContext>
    </div>
  );
}
