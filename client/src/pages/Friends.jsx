/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar.jsx";
import { useNavigate, useParams } from "react-router";
import {
  acceptFriendRequest,
  getFriends,
  rejectFriendRequest,
} from "../api/friend.js";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/SocketContext.jsx";

function ListFriend({ user, navigate, setFriends, isOnline }) {
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
      className="justify-between flex flex-wrap sm:flex-row flex-col gap-5 sm:p-4 py-4 px-2 odd:bg-blackLight rounded-lg"
    >
      <div className="flex items-center gap-5">
        <div className="w-20 relative">
          <img
            src={user.avatar || "/images/user-pawn.gif"}
            alt="Dp"
            className="w-20 rounded-3xl"
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
      <div className="relative flex items-center gap-2">
        <div
          title="Challange"
          className="w-10 h-10 p-2 rounded-md hover:cursor-pointer hover:brightness-75 transition-all bg-[rgba(16,16,16,0.43)]"
        >
          <img
            src="/images/challange.png"
            alt=""
            className="w-full h-full object-contain invert"
          />
        </div>
        <div
          title="Message"
          className="w-10 h-10 p-2 rounded-md hover:cursor-pointer hover:brightness-75 transition-all bg-[rgba(16,16,16,0.43)]"
        >
          <img
            src="/images/message.png"
            alt=""
            className="w-full h-full object-contain invert brightness-0"
          />
        </div>
        <div
          title="Unfriend"
          className="w-10 h-10 p-2 rounded-md hover:cursor-pointer hover:brightness-75 transition-all bg-[rgba(16,16,16,0.43)]"
        >
          <img
            src="/images/unfriend.png"
            alt=""
            className="w-full h-full object-contain invert"
          />
        </div>
      </div>
    </li>
  );
}

function Friends() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [openTab, setOpenTab] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [friends, setFriends] = useState({
    already: [],
    pending: [],
  });

  const { onlineUsers } = useSocketContext();

  useEffect(() => {
    const handleGetAllFriends = async () => {
      try {
        setLoading(true);
        let response = await getFriends();
        if (response) {
          let tempFrndReq = [],
            tempFrnds = [];
          response.data.friends.map((value) => {
            if (value.accept) {
              if (value.sender._id.toString() != userId)
                tempFrnds.push({ ...value.sender, modelId: value._id });
              else tempFrnds.push({ ...value.receiver, modelId: value._id });
            } else if (value.sender._id.toString() !== userId.toString())
              tempFrndReq.push({ ...value.sender, modelId: value._id });
          });
          setFriends(() => ({ already: tempFrnds, pending: tempFrndReq }));
        } else {
          toast.error("Please try to refresh the page again.");
        }
      } catch (error) {
        console.log(error);
        toast.error("Please try to refresh the page again.");
      } finally {
        setLoading(false);
      }
    };
    handleGetAllFriends();
  }, [userId]);

  const handleRejectFriendRequest = async function (modelId) {
    if (isSubmit) return;
    try {
      setIsSubmit(true);
      let response = await rejectFriendRequest({ modelId });
      if (response) {
        if (response.data.success) {
          toast.success(response.data.message);
          setFriends((prev) => {
            return {
              already: prev.already,
              pending: prev.pending.filter((val) => val.modelId != modelId),
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

  const handleAcceptFriendRequest = async function (modelId) {
    if (isSubmit) return;
    try {
      setIsSubmit(true);
      let response = await acceptFriendRequest({ modelId });
      if (response) {
        if (response.data.success) {
          toast.success(response.data.message);
          setFriends((prev) => {
            return {
              already: [
                ...prev.pending.filter((val) => val.modelId == modelId),
                ...prev.already,
              ],
              pending: prev.pending.filter((val) => val.modelId != modelId),
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
    <div className="flex flex-col items-center sm:p-8 p-0">
      <div className="max-w-[970px] w-full flex flex-col gap-5">
        {<NavBar />}
        <p className="flex items-center justify-start gap-2 sm:p-0 pl-4">
          <img src="/images/friends.png" alt="" className="w-8" />
          <span className="font-bold text-white text-2xl">Friends</span>
        </p>
        <div className="rounded-md bg-blackDark sm:p-4 p-2 py-4 flex flex-col gap-6">
          <div className="relative flex w-full">
            <img
              src="/images/search.png"
              alt=""
              className="absolute left-3 top-1/2 translate-y-[-50%] w-6"
            />
            <input
              type="text"
              name=""
              id=""
              className="w-full bg-[rgb(61,58,57)] text-white outline-none p-3 pl-12 rounded-sm"
              placeholder="Search by name"
            />
          </div>

          <div className="flex items-center gap-2 mb-[-0.5rem]">
            <div
              onClick={() => setOpenTab(() => 0)}
              className={` min-w-[7rem] border-b-4 pb-3 px-2 hover:cursor-pointer transition-all ${openTab == 0 ? "border-b-white" : "border-b-transparent"}`}
            >
              <span className="text-white mr-2 font-semibold">Friends</span>
              <span className="bg-blackLight text-white px-2 py-1 rounded-md">
                {friends.already.length}
              </span>
            </div>
            <div
              onClick={() => setOpenTab(() => 1)}
              className={`min-w-[7rem] border-b-4 pb-3 px-2 hover:cursor-pointer transition-all ${openTab == 1 ? "border-b-white" : "border-b-transparent"}`}
            >
              <span className="text-white mr-2 font-semibold">Requests</span>
              <span className="bg-blackLight text-white px-2 py-1 rounded-md">
                {friends.pending.length}
              </span>
            </div>
          </div>
          {isLoading ? (
            <div className="w-full flex items-center justify-center py-10">
              <span className="loader"></span>
            </div>
          ) : openTab == 0 ? (
            friends.already?.length ? (
              <ul className="flex flex-col">
                {friends.already.map((user) => {
                  return (
                    <ListFriend
                      key={user._id}
                      user={user}
                      navigate={navigate}
                      setFriends={setFriends}
                      isOnline={onlineUsers?.[user._id]}
                    />
                  );
                })}
              </ul>
            ) : (
              <div className="w-full text-center text-white bg-[rgba(26,26,26,0.34)] h-[8rem] py-10">
                No Friends
              </div>
            )
          ) : friends.pending?.length ? (
            <ul className="flex flex-col gap-7">
              {friends.pending.map((user) => {
                return (
                  <li key={user._id} className="flex relative">
                    <div className="flex items-center gap-4 w-full">
                      <div className="relative w-[6rem] min-w-[5rem]">
                        <img
                          src={user.avatar || "/images/user-pawn.gif"}
                          alt="Dp"
                          className="w-full h-full"
                        />
                        {onlineUsers[user._id] && (
                          <div className="absolute right-0 bottom-0 w-5 aspect-square bg-green-600"></div>
                        )}
                      </div>
                      <div className="grid grid-rows-2 w-full">
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
                        <div className="grid grid-cols-2 gap-2 w-full max-w-[20rem]">
                          <button
                            className=" bg-[rgb(61,58,57)] rounded-md h-10 flex items-center justify-center w-full active:bg-blackLight transition-colors"
                            disabled={isSubmit}
                            style={{
                              opacity: isSubmit ? "0.5" : "1",
                              cursor: isSubmit ? "not-allowed" : "pointer",
                            }}
                            onClick={() =>
                              handleRejectFriendRequest(user.modelId)
                            }
                          >
                            <img
                              src="/images/cross.png"
                              alt=""
                              className="w-6"
                            />
                          </button>
                          <button
                            className=" bg-[rgb(61,58,57)] rounded-md h-10 flex items-center justify-center w-full active:bg-blackLight transition-colors"
                            disabled={isSubmit}
                            style={{
                              opacity: isSubmit ? "0.5" : "1",
                              cursor: isSubmit ? "not-allowed" : "pointer",
                            }}
                            onClick={() =>
                              handleAcceptFriendRequest(user.modelId)
                            }
                          >
                            <img
                              src="/images/tick.png"
                              alt=""
                              className="w-5"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="w-full text-center text-white bg-[rgba(26,26,26,0.34)] h-[8rem] py-10">
              No request
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Friends;
