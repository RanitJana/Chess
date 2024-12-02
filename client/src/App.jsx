import SocketContext from "./context/SocketContext.jsx";
import AuthContext from "./context/AuthContext.jsx";
import { Outlet } from "react-router";

export default function App() {
  return (
    <div className="bg-[hsl(40,7%,18%)] min-h-[100dvh]">
      <AuthContext>
        <SocketContext>
          <Outlet />
        </SocketContext>
      </AuthContext>
    </div>
  );
}
