/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import { getFriends } from "../../api/friend.js";
import { gameInit } from "../../api/game.js";
import { useAuthContext } from "../../context/AuthContext.jsx";
import Toast from "../../utils/Toast.js";
import SearchBar from "../SearchBar.jsx";
import GetAvatar from "../../utils/GetAvatar.js";
import { socket } from "../../socket.js";

function PrintFriends({ friends, userId, isSubmit, handleCreateChallange }) {
  return (
    <div className="py-4 grid gap-2">
      {friends?.map((friend) => {
        const info =
          friend.receiver._id.toString() === userId
            ? friend.sender
            : friend.receiver;
        return (
          <div
            key={friend._id}
            className={`flex items-center gap-2 p-2 odd:bg-blackLight rounded-md ${
              isSubmit
                ? "brightness-50 hover:cursor-not-allowed"
                : "hover:cursor-pointer"
            }`}
            onClick={() => handleCreateChallange(info._id)}
          >
            <div className="relative">
              <div className="w-14 relative rounded-xl overflow-hidden">
                <div
                  dangerouslySetInnerHTML={{
                    __html: GetAvatar(info.name),
                  }}
                />
              </div>
            </div>
            <div className="text-white font-semibold line-clamp-1">
              <span>{info.name + " "}</span>
              <span className="text-gray-400 text-sm">({info.rating})</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChallangeFriends({ setOpen, setGames }) {
  const { playerInfo } = useAuthContext();
  const userId = playerInfo._id;

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [friends, setFriends] = useState(null);

  const contentRef = useRef(null);

  const handleGetAllFriends = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getFriends(userId);
      if (response) {
        setFriends(response.data.friends.filter((friend) => friend.accept));
      } else {
        Toast.error("Please try to refresh the page again.");
      }
    } catch (error) {
      console.error(error);
      Toast.error("Please try to refresh the page again.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const handleCreateChallange = async (player2) => {
    if (isSubmit) return;
    try {
      setIsSubmit(true);
      const response = await gameInit({ player2 });

      const { success, info, message } = response?.data || {};
      if (success) {
        Toast.success(message);
        socket.emit("send-challange", { game: info, userId: player2 });
        setOpen(false);
        setGames((prev) => [info, ...prev]);
      }
    } catch {
      Toast.error("Try again");
    } finally {
      setIsSubmit(false);
    }
  };

  const handleOutsideClick = (e) => {
    if (contentRef.current && !contentRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    handleGetAllFriends();
  }, [handleGetAllFriends]);

  useEffect(() => {
    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    }, 1000);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-dvw bg-[rgba(0,0,0,0.2)] h-[100dvh] overflow-y-auto z-[9999]">
      <div
        className="absolute overflow-hidden top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] sm:h-[80%] sm:w-[30rem] h-full w-full rounded-lg p-4 bg-blackDarkest shadow-lg"
        ref={contentRef}
      >
        <div className="flex gap-2">
          <SearchBar />
          <button
            disabled={isSubmit}
            className={`bg-red-500 hover:bg-red-600 transition-colors rounded-md w-[5rem] flex justify-center items-center ${isSubmit && "brightness-50"}`}
            onClick={() => setOpen(false)}
          >
            <img
              src="/images/cross.png"
              alt=""
              className="invert brightness-0 w-6"
            />
          </button>
        </div>
        <div className="overflow-scroll h-full mt-2  pb-10">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center py-3">
              <span
                className="loader"
                style={{ width: "2rem", height: "2rem", borderWidth: "2px" }}
              ></span>
            </div>
          ) : (
            <PrintFriends
              friends={friends}
              userId={userId}
              isSubmit={isSubmit}
              handleCreateChallange={handleCreateChallange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChallangeFriends;
