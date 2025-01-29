/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import NavBar from "../components/NavBar.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";
import { getUserInfo } from "../api/user.js";
import { gameInit } from "../api/game.js";
import CurrentGamePreview from "../components/game/CurrentGamePreview.jsx";
import CompletedGames from "../components/game/CompletedGames.jsx";
import { sendFriendRequest, rejectFriendRequest } from "../api/friend.js";
import { useSocketContext } from "../context/SocketContext.jsx";
import { socket } from "../socket.js";
import GetAvatar from "../utils/GetAvatar.js";
import AllFriends from "../components/profile/AllFriends.jsx";
import Toast from "../utils/Toast.js";
import Loader from "../components/Loader.jsx";

const ActionButton = ({ onClick, text, icon, disabled = false }) => (
  <button
    className={`flex gap-2 py-2 items-center justify-center rounded-md bg-[rgb(66,66,62)] active:bg-[rgba(66,66,62,0.64)] ${disabled && "brightness-50 hover:cursor-not-allowed"} transition-all w-[9rem]`}
    onClick={onClick}
    disabled={disabled}
  >
    <div className="w-5">
      <img src={icon} alt="" className="invert" />
    </div>
    <span className="font-semibold text-white text-sm">{text}</span>
  </button>
);

function timeAgo(lastSeen) {
  const diffInSeconds = Math.floor(
    (Date.now() - new Date(lastSeen).getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
}

function Profile() {
  const { userId } = useParams();
  const { playerInfo } = useAuthContext();
  const [isLoading, setLoading] = useState(true);
  const [isSendFriendRequest, setIsSendFriendRequest] = useState(false);
  const [user, setUser] = useState(null);
  const [lastSeen, setLastSeen] = useState("Loading...");

  const { onlineUsers } = useSocketContext();

  const handleUser = async () => {
    if (userId != playerInfo?._id) {
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

  const handleLastSeen = (userIdSave) => {
    if (userId == userIdSave) {
      if (onlineUsers[userId]) delete onlineUsers[userId];
      user.lastSeen = Date.now();
    }
  };

  useEffect(() => {
    handleUser();
  }, [userId, playerInfo]);

  useEffect(() => {
    socket.on("fix-time", handleLastSeen);

    const displayLastSeenRef = setInterval(() => {
      if (onlineUsers[userId]) setLastSeen("Online Now");
      else setLastSeen(timeAgo(user?.lastSeen));
    }, 10);

    return () => {
      clearInterval(displayLastSeenRef);
      socket.off("fix-time", handleLastSeen);
    };
  }, [onlineUsers, user, userId]);

  const handleSendFriendRequest = async () => {
    if (isSendFriendRequest) return;
    try {
      setIsSendFriendRequest(true);
      let response = await sendFriendRequest({
        sender: playerInfo._id,
        receiver: userId,
      });
      if (response) {
        if (response.data.success) {
          Toast.success(response.data.message);
          setUser((prev) => ({ ...prev, friend: { accept: false } }));
        } else Toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      Toast.error("Please try again..");
    } finally {
      setIsSendFriendRequest(false);
    }
  };

  const handleRejectFriendRequest = async (modelId) => {
    if (isSendFriendRequest) return;
    try {
      setIsSendFriendRequest(true);
      let response = await rejectFriendRequest({ modelId });
      if (response) {
        if (response.data.success) {
          Toast.success("Unfriend successful");
          setUser((prev) => ({ ...prev, friend: null }));
        } else Toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      Toast.error("Please try again");
    } finally {
      setIsSendFriendRequest(false);
    }
  };

  const handleCreateChallange = async () => {
    if (isSendFriendRequest) return;
    try {
      setIsSendFriendRequest(true);
      const response = await gameInit({ player2: userId });
      const { success, info, message } = response?.data || {};
      if (success) {
        Toast.success(message);
        socket.emit("send-challange", { game: info, userId });
      } else Toast.error(message || "Try again");
    } catch {
      Toast.error("Try again");
    } finally {
      setIsSendFriendRequest(false);
    }
  };

  if (!user) return <Loader />;

  return (
    <div className="flex flex-col items-center sm:p-8 p-0">
      <div className="max-w-[970px] w-full flex flex-col gap-5">
        <NavBar />
        <div className="bg-blackDark p-4 rounded-md">
          <div className=" flex flex-wrap sm:flex-nowrap gap-5">
            <div className="relative">
              <div className="max-h-[12rem] flex justify-center items-center sm:w-fit w-full left-1/2 rounded-sm overflow-hidden aspect-square">
                <div className="relative w-[10rem] rounded-3xl overflow-hidden">
                  <div
                    dangerouslySetInnerHTML={{ __html: GetAvatar(user?.name) }}
                  />
                </div>
              </div>
              {onlineUsers[userId] && (
                <div className="absolute right-0 translate-x-[50%] bottom-0 w-7 aspect-square rounded-full bg-green-600"></div>
              )}
            </div>
            <div className="flex flex-col justify-between w-full text-[rgb(146,147,145)] gap-5">
              <div>
                <p className="text-white font-bold text-2xl">
                  {user?.name || "Loading.."}
                </p>
                <p>{user?.about || "Loading.."}</p>
              </div>
              <ul className="grid grid-cols-3 w-full max-w-[23rem]">
                <li className="flex flex-col justify-center items-center">
                  <img
                    className="w-8 invert-[70%]"
                    src="/images/online.png"
                    alt=""
                  />
                  <span className="text-[0.85rem]">{lastSeen}</span>
                </li>
                <li className="flex flex-col justify-center items-center">
                  <img
                    className="w-8 invert-[70%]"
                    src="/images/joined.png"
                    alt=""
                  />
                  <span className="text-[0.85rem]">
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
                  <img
                    className="w-8 invert-[70%]"
                    src="/images/followers.png"
                    alt=""
                  />
                  <span className="text-[0.85rem]">
                    {user?.friendsCount || 0}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex gap-2 w-full mt-4">
            {/* challange button */}
            {userId !== playerInfo?._id && (
              <ActionButton
                onClick={handleCreateChallange}
                text="Challange"
                icon="/images/challange.png"
                disabled={isSendFriendRequest}
              />
            )}
            {/* add friend */}
            {!isLoading && !user?.friend && userId !== playerInfo?._id && (
              <ActionButton
                onClick={handleSendFriendRequest}
                text="Add Friend"
                icon="/images/add-user.png"
                disabled={isSendFriendRequest}
              />
            )}
            {/* req already sent */}
            {user?.friend?.accept === false && userId !== playerInfo?._id && (
              <ActionButton
                onClick={null}
                text="Request sent"
                icon="/images/add-user.png"
                disabled={true}
              />
            )}
            {/* unfriend */}
            {user?.friend?.accept === true && userId !== playerInfo?._id && (
              <ActionButton
                onClick={() => handleRejectFriendRequest(user?.friend?._id)}
                text="Unfriend"
                icon="/images/unfriend.png"
                disabled={isSendFriendRequest}
              />
            )}
          </div>
        </div>
        <AllFriends userId={userId} />
        <CurrentGamePreview userId={userId} />
        <CompletedGames userId={userId} />
      </div>
    </div>
  );
}

export default Profile;
