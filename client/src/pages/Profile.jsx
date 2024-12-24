/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import NavBar from "../components/NavBar.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";
import { getUserInfo } from "../api/user.js";

function Profile() {
  const { userId } = useParams();
  const { playerInfo } = useAuthContext();
  const [isDifferentUser, setIsDifferentUser] = useState(false);

  useEffect(() => {
    const handleUser = async () => {
      if (userId != playerInfo?._id) {
        setIsDifferentUser(true);
        let response = await getUserInfo(userId);
        console.log(response);
      }
    };
    handleUser();
  }, [userId, playerInfo]);

  return (
    <div className="flex flex-col items-center sm:p-8 p-2">
      <div className="max-w-[970px] w-full flex flex-col gap-10">
        {<NavBar />}
        <div className="bg-blackDarkest p-6 rounded-md flex flex-wrap  sm:flex-nowrap gap-5">
          <div className="max-h-[12rem] rounded-sm overflow-hidden aspect-square">
            <img
              className="h-full w-full"
              src={playerInfo?.avatar || "/images/user-pawn.gif"}
              alt=""
            />
          </div>
          <div className="flex flex-col justify-between w-full text-[rgb(146,147,145)] gap-5">
            <div>
              <p className="text-white font-bold text-2xl">
                {playerInfo?.name || "Loading.."}
              </p>
              <p>{playerInfo?.about}</p>
            </div>
            <ul className="flex w-full justify-between max-w-[20rem]">
              <li className="flex flex-col justify-center items-center">
                <img className="w-8" src="/images/joined.png" alt="" />
                <span>
                  {new Date(playerInfo.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </li>
              <li className="flex flex-col justify-center items-center">
                <img className="w-8" src="/images/followers.png" alt="" />
                <span>{playerInfo?.friends.length}</span>
              </li>
              <li className="flex flex-col justify-center items-center">
                <img className="w-8" src="/images/icons8-eye-24.png" alt="" />
                <span>{playerInfo?.views}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
