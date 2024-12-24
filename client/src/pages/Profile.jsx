/* eslint-disable no-unused-vars */
import React from "react";
import { useParams } from "react-router";
import NavBar from "../components/NavBar.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";

function Profile() {
  const { userId } = useParams();
  const { playerInfo } = useAuthContext();

  return (
    <div className="flex flex-col items-center sm:p-8 p-2">
      <div className="max-w-[970px] w-full flex flex-col gap-10">
        {<NavBar />}
        <div className="bg-blackDarkest p-4 rounded-md flex gap-5">
          <div>
            <img src={playerInfo.avatar || '/images/user-pawn.gif'} alt="" />
          </div>
          <div className="flex flex-col text-left w-full">
            <p className="text-white font-bold text-2xl">{playerInfo?.name || "Loading.."}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;
