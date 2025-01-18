/* eslint-disable react/prop-types */

import { useState } from "react";
import { rejectFriendRequest } from "../api/friend.js";
import toast from "react-hot-toast";

export default function ListFriend({
  user = {},
  navigate,
  setFriends,
  isOnline,
}) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const handleRejectFriendRequest = async function (modelId) {
    if (isSubmit) return;

    try {
      setIsSubmit(true);
      let response = await rejectFriendRequest({ modelId });

      if (response) {
        if (response.data.success) {
          toast.success("Friend Removed");
          setFriends((prev) => {
            return {
              already: prev.already.filter((prev) => prev.modelId != modelId),
              pending: prev.pending,
            };
          });
        } else toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Please try again");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <li
      key={user._id}
      className="relative justify-between flex flex-wrap flex-row gap-5 sm:p-4 py-4 px-2 odd:bg-blackLight rounded-lg"
    >
      {isSubmit && (
        <div className="fixed top-0 left-0 z-[1000] w-full h-full bg-[rgba(0,0,0,0.27)] flex justify-center items-center">
          <span className="loader"></span>
        </div>
      )}
      <div className="flex items-center gap-5">
        <div className="w-20 relative">
          <img
            src={
              user
                ? user.avatar || `https://robohash.org/${user?.name}`
                : "/images/user-pawn.gif"
            }
            alt="Dp"
            className="w-20 rounded-xl bg-white"
          />
          {isOnline && (
            <div className="absolute right-0 bottom-0 w-5 aspect-square bg-green-600"></div>
          )}
        </div>
        <div>
          <span
            className="text-white font-semibold hover:cursor-pointer"
            onClick={() => navigate(`/member/${user._id}`)}
          >
            {user.name}{" "}
          </span>
          <span
            className="text-gray-400 hover:cursor-pointer"
            onClick={() => navigate(`/member/${user._id}`)}
          >
            ({user.rating})
          </span>
        </div>
      </div>
      <div className="absolute right-3 z-20">
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
