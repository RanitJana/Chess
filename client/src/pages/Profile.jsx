/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import NavBar from "../components/NavBar.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";
import { getUserInfo } from "../api/user.js";
import CurrentGamePreview from "../components/CurrentGamePreview.jsx";

function Profile() {
  const { userId } = useParams();
  const { playerInfo } = useAuthContext();
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isDifferentUser, setIsDifferentUser] = useState(false);

  useEffect(() => {
    const handleUser = async () => {
      if (userId != playerInfo?._id) {
        setIsDifferentUser(true);
        try {
          setLoading(true);
          let response = await getUserInfo(userId);
          if (response?.data.success) {
            setUser(response.data.player);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(playerInfo);
        setLoading(false);
      }
    };
    handleUser();
  }, [userId, playerInfo]);

  return (
    <div className="flex flex-col items-center sm:p-8 p-2">
      <div className="max-w-[970px] w-full flex flex-col gap-10">
        {<NavBar />}
        <div className="bg-blackDarkest p-6 rounded-md flex flex-wrap sm:flex-nowrap gap-5">
          <div className="max-h-[12rem] flex justify-center items-center sm:w-fit w-full rounded-sm overflow-hidden aspect-square">
            <img
              className=""
              src={user?.avatar || "/images/user-pawn.gif"}
              alt=""
            />
          </div>
          <div className="flex flex-col justify-between w-full text-[rgb(146,147,145)] gap-5">
            <div>
              <p className="text-white font-bold text-2xl">
                {user?.name || "Loading.."}
              </p>
              <p>{user?.about || "Loading.."}</p>
            </div>
            <ul className="flex w-full justify-between max-w-[20rem]">
              <li className="flex flex-col justify-center items-center">
                <img className="w-8" src="/images/joined.png" alt="" />
                <span>
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </span>
              </li>
              <li className="flex flex-col justify-center items-center">
                <img className="w-8" src="/images/followers.png" alt="" />
                <span>{user?.friends.length || 0}</span>
              </li>
              <li className="flex flex-col justify-center items-center">
                <img className="w-8" src="/images/icons8-eye-24.png" alt="" />
                <span>{user?.views || 0}</span>
              </li>
            </ul>
          </div>
        </div>
        {<CurrentGamePreview/>}
      </div>
    </div>
  );
}

export default Profile;
