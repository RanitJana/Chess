import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { logout } from "../api/auth.js";
import Loader from "../components/Loader.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";
import Toast from "../utils/Toast.js";
import { socket } from "../socket.js";
import GetAvatar from "../utils/GetAvatar.js";

function NavBar() {
  const { playerInfo } = useAuthContext();
  const navigate = useNavigate();

  const moreRef = useRef(null);

  const [isLoggingOut, setLoggingOut] = useState(false);
  const [toggleSetting, setSetting] = useState(false);

  const handleLogOut = async () => {
    try {
      setLoggingOut(true);
      let response = await logout();
      if (response?.data.success) {
        Toast.success(response.data.message);
        socket.emit("log-out");
      }
    } catch (error) {
      console.log(error);
      Toast.error("Please try again");
    } finally {
      navigate("/login");
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    const handleToggle = (e) => {
      if (!moreRef.current || !toggleSetting) return;
      if (!e.target.contains(moreRef.current)) setSetting(false);
    };
    setTimeout(() => {
      window.addEventListener("click", handleToggle);
    }, 0);
    return () => window.removeEventListener("click", handleToggle);
  }, [toggleSetting]);

  return (
    <div className="flex items-center max-w-[970px] w-full justify-between sm:p-0 sm:mb-0 mb-[-1rem] p-4 z-[1000]">
      {isLoggingOut && <Loader />}
      {/* <div
        className="flex gap-2 items-center hover:cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="/images/chess.com.png"
          alt=""
          decoding="sync"
          className="w-[8rem]"
        />
      </div> */}

      {/* name info */}
      <div
        className="flex items-center gap-2 hover:cursor-pointer"
        onClick={() => navigate(`/member/${playerInfo?._id}`)}
      >
        <div
          dangerouslySetInnerHTML={{ __html: GetAvatar(playerInfo?.name) }}
          className="relative w-[2rem] rounded-md overflow-hidden"
        />
        <div className="font-semibold text-sm line-clamp-1 text-white">
          <span>{playerInfo?.name}</span>
          <span className="text-gray-400">
            {" (" + playerInfo?.rating + ")"}
          </span>
        </div>
      </div>
      {/* more options */}
      <div className=" flex gap-3">
        {/* Home */}
        <div
          className=" hover:cursor-pointer brightness-50 invert hover:brightness-0 transition-all"
          onClick={() => navigate("/")}
        >
          <img src="/images/Home.png" className="w-[1.5rem]" alt="" />
        </div>
        {/* Friends */}
        <div
          className=" hover:cursor-pointer brightness-50 invert hover:brightness-0 transition-all"
          onClick={() => navigate("/friends/" + playerInfo?._id)}
        >
          <img src="/images/friends.png" className="w-[1.6rem]" alt="" />
        </div>
        {/* settings */}
        <div
          className="relative cursor-pointer w-fit"
          onClick={() => setSetting((prev) => !prev)}
        >
          <img
            src="/images/settings.png"
            alt="Settings"
            className="aspect-square w-[1.5rem] hover:cursor-pointer brightness-50 invert hover:brightness-0 transition-all"
          />
          {toggleSetting ? (
            <ul
              className="absolute top-[100%] pt-1 right-0 rounded-md w-[min(18rem,100dvw)] text-white overflow-hidden shadow-xl"
              ref={moreRef}
            >
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
