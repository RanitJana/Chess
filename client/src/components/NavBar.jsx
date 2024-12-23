import { useNavigate } from "react-router";
import { useState } from "react";
import { logout } from "../api/auth.js";
import toast from "react-hot-toast";
import Loader from "../components/Loader.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";

function NavBar() {
  const { playerInfo } = useAuthContext();

  const [isLoggingOut, setLoggingOut] = useState(false);
  const [toggleSetting, setSetting] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      setLoggingOut(true);
      let response = await logout();
      if (response?.data.success) {
        document.cookie = `${"authToken"}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
        localStorage.removeItem("user");
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Please try again");
    } finally {
      navigate("/login");
      setLoggingOut(false);
    }
  };
  return (
    <div className="flex items-center max-w-[60rem] w-full justify-between">
      {isLoggingOut && <Loader />}
      <div className="flex gap-2 items-center">
        <div className="w-[2rem] overflow-hidden rounded-sm">
          <img src="/images/user-pawn.gif" alt="" />
        </div>
        <p
          className="hover:cursor-pointer"
          onClick={() => {
            if (playerInfo) {
              navigate(`/member/${playerInfo._id}`);
            }
          }}
        >
          <span className="text-white font-bold text-[1.3rem]">
            {playerInfo?.name || "Loading..."}
          </span>
          <span className="text-gray-400 pl-2">
            ({playerInfo?.rating || "0"})
          </span>
        </p>
      </div>
      <div
        className="relative cursor-pointer w-fit"
        onMouseEnter={() => setSetting(true)}
        onMouseLeave={() => {
          setTimeout(() => {
            setSetting(false);
          }, 200);
        }}
      >
        <img
          src="/images/settings.png"
          alt="Settings"
          className="aspect-square w-[1.5rem]"
        />
        {toggleSetting ? (
          <ul className="absolute top-[100%] pt-1 right-0 rounded-md w-[min(18rem,100dvw)] text-white overflow-hidden">
            <li className="flex justify-start items-center rounded-tl-md rounded-tr-md gap-3 p-4 hover:cursor-pointer bg-blackDarkest hover:bg-[rgb(58,56,54)] transition-all">
              <img src="/images/user.png" alt="" className="w-[1.5rem]" />
              <span>Profile</span>
            </li>
            <li
              onClick={handleLogOut}
              className="flex justify-start items-center gap-3 p-4 hover:cursor-pointer bg-blackDarkest hover:bg-[rgb(58,56,54)] transition-all"
            >
              <img src="/images/exit.png" alt="" className="w-[1.5rem]" />
              <span>Log out</span>
            </li>
          </ul>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default NavBar;
