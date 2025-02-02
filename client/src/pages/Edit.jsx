/* eslint-disable no-unused-vars */
import { useState } from "react";
import NavBar from "../components/NavBar.jsx";
import GetAvatar from "../utils/GetAvatar.js";
import { useAuthContext } from "../context/AuthContext.jsx";
import EditInput from "../components/edit/EditInput.jsx";
import Toast from "../utils/Toast.js";
import { updateUserInfo } from "../api/user.js";
import { useSocketContext } from "../context/SocketContext.jsx";
import CountryList from "../components/edit/CountryList.jsx";
import getCountryNameFlag from "../utils/getCountryNameFlag.js";

function EditHeadline() {
  return (
    <div className="flex w-full gap-2 p-4 border-b-[2px] border-blackLight">
      <img src="/images/edit.png" alt="" className="invert w-6 aspect-square" />
      <p className="text-white font-bold">Edit profile</p>
    </div>
  );
}

function Edit() {
  const { playerInfo, setPlayerInfo } = useAuthContext();
  const { onlineUsers } = useSocketContext();

  const [userInfo, setUserInfo] = useState({
    name: playerInfo?.name || "",
    email: playerInfo?.email || "",
    about: playerInfo?.about || "",
    nationality:
      playerInfo?.nationality.name == "International"
        ? ""
        : playerInfo?.nationality.name,
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const handleUpateProfile = async () => {
    if (
      !userInfo.name.trim() ||
      !userInfo.email.trim() ||
      !userInfo.about.trim()
    )
      return Toast.error("Fields must not be empty");
    if (isSubmit) return Toast.loading("Profile is updating...");
    try {
      setIsSubmit(true);
      const response = await updateUserInfo(userInfo);
      const { success, message, player } = response.data;
      if (success) {
        Toast.success(message);
        setPlayerInfo((prev) => ({
          ...(prev || {}),
          name: userInfo.name.trim(),
          email: userInfo.email.trim(),
          about: userInfo.about.trim(),
          nationality: {
            ...getCountryNameFlag(
              userInfo.nationality == "International"
                ? ""
                : userInfo.nationality
            ),
          },
        }));
      } else Toast.error(message);
    } catch (error) {
      console.log(error);
      Toast.error("Something went wrong..");
    } finally {
      setIsSubmit(false);
    }
  };

  const handleResetProfile = () => {
    if (isSubmit) return Toast.loading("Profile is updating...");
    setUserInfo({
      name: playerInfo?.name || "",
      email: playerInfo?.email || "",
      about: playerInfo?.about || "",
      nationality: playerInfo?.nationality || {},
    });
  };

  return (
    <div className="w-full flex flex-col items-center h-fit sm:p-8 p-0 gap-5">
      <NavBar />
      {isMapOpen && (
        <CountryList setIsMapOpen={setIsMapOpen} setUserInfo={setUserInfo} />
      )}
      <div className="flex w-full max-w-[970px] flex-col gap-5">
        <div className=" flex flex-wrap sm:flex-nowrap gap-5 bg-blackDarkest p-4 rounded-md">
          <div className="relative">
            <div className="max-h-[12rem] sm:w-fit w-full aspect-square">
              <div
                dangerouslySetInnerHTML={{
                  __html: GetAvatar(playerInfo?.name),
                }}
                className="relative w-[10rem] rounded-3xl overflow-hidden"
              />
            </div>
            {onlineUsers[playerInfo?._id] && (
              <div className="absolute right-0 translate-x-[50%] bottom-0 w-7 aspect-square rounded-full bg-green-600"></div>
            )}
          </div>
          <div className="w-full text-[rgb(146,147,145)] gap-5">
            <p className="text-white font-bold text-2xl flex gap-2">
              {playerInfo?.name || "Loading.."}
              <img
                src={playerInfo?.nationality.link}
                alt=""
                className="w-8"
                title={playerInfo?.nationality.name}
              />
            </p>
            <p>{playerInfo?.about || "Loading.."}</p>
          </div>
        </div>
        <div className=" flex flex-col sm:flex-nowrap bg-blackDarkest rounded-md">
          <EditHeadline />
          <div className="p-4 flex flex-col gap-3">
            {/* name */}
            <EditInput
              type={"text"}
              value={userInfo.name}
              placeholder={"Your name"}
              setInfo={setUserInfo}
              infoName={"name"}
              imgPath={"/images/name.png"}
              instruction={"Your Name"}
            />
            {/* email */}
            <EditInput
              type={"email"}
              value={userInfo.email}
              placeholder={"Your email"}
              setInfo={setUserInfo}
              infoName={"email"}
              imgPath={"/images/user.png"}
              instruction={"Your email"}
            />
            {/* about */}
            <EditInput
              type={"text"}
              value={userInfo.about}
              placeholder={"About"}
              setInfo={setUserInfo}
              infoName={"about"}
              imgPath={"/images/about.png"}
              instruction={"About"}
            />
            {/* nationality */}
            <div className="flex flex-col text-sm gap-1">
              <span className="text-white font-bold">Nationality</span>
              <div className="relative">
                <img
                  src={"/images/nationality.png"}
                  alt=""
                  className="absolute left-2 top-1/2 translate-y-[-50%] w-5"
                />
                <input
                  type="text"
                  placeholder="Nation"
                  value={
                    userInfo.nationality == ""
                      ? "International"
                      : userInfo.nationality
                  }
                  onChange={(e) => e.preventDefault()}
                  onClick={() => setIsMapOpen(true)}
                  className="bg-blackLight transition-all hover:border-gray-400 focus:border-gray-400 p-2 outline-none border-[1px] border-gray-700 text-white pl-9 w-full rounded-2xl"
                />
              </div>
            </div>

            <div className="flex gap-2 text-sm py-4">
              <button
                className={`w-fit min-w-[5rem] ${isSubmit ? "brightness-50 hover:cursor-not-allowed" : "hover:bg-green-700 hover:cursor-pointer"} bg-green-600  transition-all px-4 py-2 rounded-md text-white font-bold`}
                onClick={handleUpateProfile}
                disabled={isSubmit}
              >
                Save
              </button>
              <button
                className={`w-fit min-w-[5rem] ${isSubmit ? "brightness-50 hover:cursor-not-allowed" : "hover:bg-red-700 hover:cursor-pointer"} bg-red-600  transition-all px-4 py-2 rounded-md text-white font-bold`}
                onClick={handleResetProfile}
                disabled={isSubmit}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edit;
