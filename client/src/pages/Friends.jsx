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

function PendingRequestSkeleton({ isLoading }) {
  return (
    <>
      {isLoading && (
        <div className="flex relative">
          <div className="flex items-center gap-4 w-full">
            <div className="w-[6rem] min-w-[5rem] aspect-square bg-[rgba(0,0,0,0.5)]"></div>
            <div className="grid grid-rows-2 w-full">
              <div>
                <span className="text-white font-semibold hover:cursor-pointer">
                  Loading...{" "}
                </span>
                <span className="text-gray-400 hover:cursor-pointer">
                  (200)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full max-w-[20rem]">
                <button className=" bg-[rgb(61,58,57)] rounded-md h-10 flex items-center justify-center w-full active:bg-blackLight transition-colors">
                  <img src="/images/cross.png" alt="" className="w-6" />
                </button>
                <button className=" bg-[rgb(61,58,57)] rounded-md h-10 flex items-center justify-center w-full active:bg-blackLight transition-colors">
                  <img src="/images/tick.png" alt="" className="w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AcceptedFriendsSkeleton({ isLoading }) {
  return (
    <>
      {isLoading && (
        <div className="flex relative">
          <div className="flex items-center gap-4 w-full">
            <div className="w-[6rem] min-w-[5rem] aspect-square bg-[rgba(0,0,0,0.5)]"></div>
            <div className="grid grid-rows-1 w-full">
              <div>
                <span className="text-white font-semibold hover:cursor-pointer">
                  Loading...{" "}
                </span>
                <span className="text-gray-400 hover:cursor-pointer">
                  (200)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Friends() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [friends, setFriends] = useState({
    already: [],
    pending: [],
  });

  useEffect(() => {
    const handleGetAllFriends = async () => {
      try {
        setLoading(true);
        let response = await getFriends();
        if (response) {
          let tempFrndReq = [],
            tempFrnds = [];
          response.data.friends.map((value) => {
            if (value.accept)
              tempFrnds.push({ ...value.sender, modelId: value._id });
            else if (value.sender._id.toString() !== userId.toString())
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
    <div className="flex flex-col items-center sm:p-8 p-2">
      <div className="max-w-[970px] w-full flex flex-col gap-5">
        {<NavBar />}
        <p className="flex items-center justify-start gap-5">
          <img src="/images/friends.png" alt="" />
          <span className="font-bold text-white text-2xl">Friends</span>
        </p>
        <div className="rounded-md bg-blackDarkest p-6 flex flex-col gap-6">
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
          <div>
            <div>
              <span className="text-white mr-2 font-semibold">
                Friend requests
              </span>
              <span className="bg-blackLight text-white px-2 py-1 rounded-md">
                {friends.pending.length}
              </span>
            </div>
          </div>
          {friends.pending?.length ? (
            <ul className="flex flex-col gap-7">
              {friends.pending.map((user) => {
                return (
                  <li key={user._id} className="flex relative">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-[6rem] min-w-[5rem]">
                        <img
                          src={user.avatar || "/images/user-pawn.gif"}
                          alt="Dp"
                          className="w-full h-full"
                        />
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
            ""
          )}
          <PendingRequestSkeleton isLoading={isLoading} />
          <div>
            <div>
              <span className="text-white mr-2 font-semibold">Friends</span>
              <span className="bg-blackLight text-white px-2 py-1 rounded-md">
                {friends.already.length}
              </span>
            </div>
          </div>
          {friends.already?.length ? (
            <ul className="flex flex-col gap-7">
              {friends.already.map((user) => {
                return (
                  <li key={user._id} className="flex justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-20">
                        <img
                          src={user.avatar || "/images/user-pawn.gif"}
                          alt="Dp"
                          className="w-20"
                        />
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
                    <div></div>
                  </li>
                );
              })}
            </ul>
          ) : (
            ""
          )}
          <AcceptedFriendsSkeleton isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default Friends;
