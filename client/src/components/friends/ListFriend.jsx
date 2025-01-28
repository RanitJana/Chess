/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from "react";
import { rejectFriendRequest } from "../../api/friend.js";
import GetAvatar from "../../utils/GetAvatar.js";
import Toast from "../../utils/Toast.js";
import { gameInit } from "../../api/game.js";
import Loader from "../Loader.jsx";

export default function ListFriend({
  user = {},
  navigate,
  setFriends,
  isOnline,
}) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const moreBox = useRef(null);

  const handleCloseMoreBox = (e) => {
    const moreBoxRef = moreBox.current;
    if (moreBoxRef && !moreBoxRef.contains(e.target)) {
      setIsMoreOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleCloseMoreBox);
    return () => window.removeEventListener("click", handleCloseMoreBox);
  }, []);

  const handleRejectFriendRequest = async function (modelId) {
    if (isSubmit) return;

    try {
      setIsSubmit(true);
      let response = await rejectFriendRequest({ modelId });

      if (response) {
        if (response.data.success) {
          Toast.success("Friend Removed");
          setFriends((prev) => {
            return {
              already: prev.already.filter((prev) => prev.modelId != modelId),
              pending: prev.pending,
            };
          });
        } else Toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      Toast.error("Please try again");
    } finally {
      setIsSubmit(false);
    }
  };

  const handleCreateChallange = async function (player2) {
    if (isSubmit) return;
    try {
      setIsSubmit(true);
      const response = await gameInit({ player2 });
      const { success, message } = response?.data || {};
      if (success) {
        Toast.success(message);
        setIsMoreOpen(false);
      }
    } catch {
      Toast.error("Try again");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <li
      key={user._id}
      className="relative justify-between flex flex-wrap flex-row gap-5 sm:p-4 py-2 px-2 odd:bg-blackLight rounded-lg"
    >
      {isSubmit && <Loader />}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div
            className="w-16 relative rounded-xl overflow-hidden hover:cursor-pointer"
            onClick={() => navigate(`/member/${user._id}`)}
          >
            <div dangerouslySetInnerHTML={{ __html: GetAvatar(user?.name) }} />
          </div>
          {isOnline && (
            <div className="absolute right-0 translate-x-[50%] bottom-0 w-5 aspect-square rounded-full bg-green-600"></div>
          )}
        </div>
        <div>
          <span
            className="text-white font-semibold hover:cursor-pointer line-clamp-1"
            onClick={() => navigate(`/member/${user._id}`)}
          >
            {user.name + " "}
          </span>
          <span
            className="text-gray-400 hover:cursor-pointer text-sm"
            onClick={() => navigate(`/member/${user._id}`)}
          >
            ({user.rating})
          </span>
        </div>
      </div>
      <div className="absolute right-3 z-20 shadow-2xl" ref={moreBox}>
        <img
          onClick={() => setIsMoreOpen((prev) => !prev)}
          src="/images/more.png"
          alt=""
          className="invert rotate-90 w-8 p-2 bg-[rgba(255,255,255,0.26)] rounded-full hover:cursor-pointer"
        />
        {isMoreOpen && (
          <div className="absolute right-10 top-0 bg-blackDarkest flex shadow-lg flex-col rounded-lg overflow-hidden items-start">
            <div
              title="Challange"
              className="hover:cursor-pointer w-[10rem] px-7 py-3 flex items-center justify-start gap-2 hover:bg-blackDark transition-all"
              onClick={() => handleCreateChallange(user._id)}
            >
              <img
                src="/images/challange.png"
                alt=""
                className="w-4 object-contain invert"
              />
              <span className="text-white">Challange</span>
            </div>
            <div
              title="Message"
              className="hover:cursor-pointer w-[10rem] px-7 py-3 flex items-center justify-start gap-2 hover:bg-blackDark transition-all"
            >
              <img
                src="/images/message.png"
                alt=""
                className="w-4 object-contain invert brightness-0"
              />
              <span className="text-white">Message</span>
            </div>
            <div
              title="Unfriend"
              onClick={() => handleRejectFriendRequest(user.modelId)}
              className="hover:cursor-pointer w-[10rem] px-7 py-3 flex items-center justify-start gap-2 hover:bg-blackDark transition-all"
            >
              <img
                src="/images/unfriend.png"
                alt=""
                className="w-4 object-contain invert"
              />
              <span className="text-white">Unfriend</span>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
