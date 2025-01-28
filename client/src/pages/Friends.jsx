/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar.jsx";
import { useNavigate, useParams } from "react-router";
import { getFriends } from "../api/friend.js";
import { useSocketContext } from "../context/SocketContext.jsx";
import ListFriend from "../components/friends/ListFriend.jsx";
import Pending from "../components/friends/Pending.jsx";
import Toast from "../utils/Toast.js";

function Friends() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [openTab, setOpenTab] = useState(0);
  const [friends, setFriends] = useState({
    already: [],
    pending: [],
  });

  const { onlineUsers } = useSocketContext();

  useEffect(() => {
    const handleGetAllFriends = async () => {
      try {
        setLoading(true);
        let response = await getFriends(userId);
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
          Toast.error("Please try to refresh the page again.");
        }
      } catch (error) {
        console.log(error);
        Toast.error("Please try to refresh the page again.");
      } finally {
        setLoading(false);
      }
    };
    handleGetAllFriends();
  }, [userId]);

  return (
    <div className="flex flex-col items-center sm:p-8 p-0">
      <div className="max-w-[970px] w-full flex flex-col gap-5">
        {<NavBar />}
        <p className="flex items-center justify-start gap-2 sm:p-0 pl-4">
          <img src="/images/friends.png" alt="" className="w-8" />
          <span className="font-bold text-white text-2xl">Friends</span>
        </p>
        <div className="rounded-md bg-blackDark sm:p-4 p-2 py-4 flex flex-col gap-6 sm:pt-10 pt-10">
          {/* search bar */}
          <div className="relative flex w-full rounded-3xl overflow-hidden">
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
              className={`min-w-[6rem] text-sm border-b-2 pb-3 px-2 hover:cursor-pointer transition-all  ${openTab == 0 ? "border-b-white" : "border-b-transparent"}`}
            >
              <span className="text-white mr-2 font-semibold">Friends</span>
              <span className="bg-blackLight text-white px-2 py-1 rounded-md">
                {friends.already.length}
              </span>
            </div>
            <div
              onClick={() => setOpenTab(() => 1)}
              className={`min-w-[6rem] text-sm border-b-2 pb-3 px-2 hover:cursor-pointer transition-all ${openTab == 1 ? "border-b-white" : "border-b-transparent"}`}
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
              {friends.pending.map((user, idx) => {
                return (
                  <Pending
                    key={idx}
                    user={user}
                    setFriends={setFriends}
                    isOnline={onlineUsers?.[user._id]}
                  />
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
