/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import NavBar from "../components/NavBar.jsx";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext.jsx";
import { getUserInfo } from "../api/user.js";
import CurrentGamePreview from "../components/CurrentGamePreview.jsx";
import CompletedGames from "../components/CompletedGames.jsx";
import { sendFriendRequest, rejectFriendRequest } from "../api/friend.js";
import { useSocketContext } from "../context/SocketContext.jsx";
import { socket } from "../socket.js";

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
  const [lastSeen, setLastSeen] = useState("x min ago");

  const { onlineUsers } = useSocketContext();

  useEffect(() => {
    const handleUser = async () => {
      if (userId != playerInfo?._id) {
        try {
          setLoading(true);
          let response = await getUserInfo(userId);
          console.log(response);
          
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

  useEffect(() => {
    socket.on("fix-time", (userIdSave) => {
      if (userId == userIdSave) {
        if (onlineUsers[userId]) delete onlineUsers[userId];
        user.lastSeen = Date.now();
      }
    });

    const displayLastSeenRef = setInterval(() => {
      if (onlineUsers[userId]) setLastSeen("Online");
      else setLastSeen(timeAgo(user?.lastSeen));
    }, 1000);
    return () => {
      clearInterval(displayLastSeenRef);
      socket.off("fix-time");
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
          toast.success(response.data.message);
          setUser((prev) => ({ ...prev, friend: { accept: false } }));
        } else toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Please try again..");
    } finally {
      setIsSendFriendRequest(false);
    }
  };

  const handleRejectFriendRequest = async function (modelId) {
    if (isSendFriendRequest) return;
    try {
      setIsSendFriendRequest(true);
      let response = await rejectFriendRequest({ modelId });
      if (response) {
        if (response.data.success) {
          toast.success("Unfriend successful");
          setUser((prev) => ({ ...prev, friend: null }));
        } else toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Please try again");
    } finally {
      setIsSendFriendRequest(false);
    }
  };

  return (
    <div className="flex flex-col items-center sm:p-8 p-0">
      <div className="max-w-[970px] w-full flex flex-col gap-5">
        {<NavBar />}
        <div className="bg-blackDarkest p-4 rounded-md">
          <div className=" flex flex-wrap sm:flex-nowrap gap-5">
            <div className="max-h-[12rem] flex justify-center items-center sm:w-fit w-full rounded-sm overflow-hidden aspect-square">
              <div className="relative">
                <img
                  className=""
                  src={user?.avatar || "/images/user-pawn.gif"}
                  alt=""
                />
                {onlineUsers[userId] ? (
                  <div className="absolute bg-green-600 w-7 aspect-square right-0 bottom-0"></div>
                ) : (
                  ""
                )}
              </div>
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
                  <img
                    className="w-8 invert-[70%]"
                    src="/images/online.png"
                    alt=""
                  />
                  <span>{lastSeen}</span>
                </li>
                <li className="flex flex-col justify-center items-center">
                  <img
                    className="w-8 invert-[70%]"
                    src="/images/joined.png"
                    alt=""
                  />
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
                  <img
                    className="w-8 invert-[70%]"
                    src="/images/followers.png"
                    alt=""
                  />
                  <span>{user?.friends?.length || 0}</span>
                </li>
                <li className="flex flex-col justify-center items-center">
                  <img
                    className="w-8 invert-[70%]"
                    src="/images/views.png"
                    alt=""
                  />
                  <span>{user?.views || 0}</span>
                </li>
              </ul>
            </div>
          </div>
          {!isLoading && !user?.friend && userId !== playerInfo?._id && (
            <div className="mt-6">
              <button
                className="flex gap-2 items-center justify-center px-4 py-3 rounded-md bg-[rgb(66,66,62)] active:bg-[rgba(66,66,62,0.64)] transition-colors w-[10rem]"
                style={{
                  opacity: isSendFriendRequest ? "0.5" : "1",
                  cursor: isSendFriendRequest ? "not-allowed" : "pointer",
                }}
                onClick={handleSendFriendRequest}
                disabled={isSendFriendRequest}
              >
                <div className="w-5">
                  <img src="/images/add-user.png" alt="" className="invert" />
                </div>
                <span className="font-semibold text-white">Add Friend</span>
              </button>
            </div>
          )}
          {user?.friend?.accept == false && userId !== playerInfo?._id && (
            <div className="mt-6">
              <button
                className="flex gap-2 items-center justify-center px-4 py-3 rounded-md bg-[rgb(66,66,62)] active:bg-[rgba(66,66,62,0.64)] transition-colors w-[10rem]"
                disabled={true}
              >
                <div className="w-5">
                  <img src="/images/add-user.png" alt="" className="invert" />
                </div>
                <span className="font-semibold text-white">Request sent</span>
              </button>
            </div>
          )}
          {user?.friend?.accept == true && userId !== playerInfo?._id && (
            <div className="mt-6">
              <button
                className="flex gap-2 items-center justify-center px-4 py-3 rounded-md bg-[rgb(66,66,62)] active:bg-[rgba(66,66,62,0.64)] transition-colors w-[10rem]"
                style={{
                  opacity: isSendFriendRequest ? "0.5" : "1",
                  cursor: isSendFriendRequest ? "not-allowed" : "pointer",
                }}
                onClick={() => handleRejectFriendRequest(user?.friend?._id)}
                disabled={isSendFriendRequest}
              >
                <div className="w-5">
                  <img src="/images/unfriend.png" alt="" className="invert" />
                </div>
                <span className="font-semibold text-white">Unfriend</span>
              </button>
            </div>
          )}
        </div>
        <CurrentGamePreview userId={userId} />
        <CompletedGames userId={userId} />
      </div>
    </div>
  );
}

export default Profile;
