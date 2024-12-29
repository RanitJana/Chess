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
    <div className="flex items-center max-w-[970px] w-full justify-between">
      {isLoggingOut && <Loader />}
      <div className="flex gap-2 items-center hover:cursor-pointer" onClick={() => navigate("/")}>
        <img src="/images/chess.com.png" alt="" decoding="sync" className="w-[8rem]" />
      </div>
      <div className=" flex gap-3">
        {/* <div className=" hover:cursor-pointer" onClick={() => navigate("/")}>
          <img src="/images/Home.png" className="w-[1.5rem]" alt="" />
        </div> */}
        <div
          className=" hover:cursor-pointer"
          onClick={() => navigate("/friends/" + playerInfo?._id)}
        >
          <img src="/images/friends.png" className="w-[1.6rem]" alt="" />
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
            <ul className="absolute top-[100%] pt-1 right-0 rounded-md w-[min(18rem,100dvw)] text-white overflow-hidden shadow-xl">
              <li
                onClick={() => navigate("/member/" + playerInfo._id)}
                className="flex justify-start items-center rounded-tl-md rounded-tr-md gap-3 p-4 hover:cursor-pointer bg-blackDarkest hover:bg-[rgb(58,56,54)] transition-all"
              >
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
    </div>
  );
}

export default NavBar;
