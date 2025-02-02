/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import GetAvatar from "../../utils/GetAvatar.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { useNavigate } from "react-router";

function SingleFriend({ info, userId }) {
  const navigate = useNavigate();
  const { onlineUsers } = useSocketContext();

  return (
    <div
      className="w-fit hover:cursor-pointer max-w-[5rem] overflow-hidden"
      onClick={() => navigate(`/member/${info._id}`)}
    >
      <div className="mb-1">
        <div className="h-[4rem] relative flex justify-center items-center sm:w-fit rounded-sm aspect-square">
          <div className="w-full rounded-2xl overflow-hidden">
            <div dangerouslySetInnerHTML={{ __html: GetAvatar(info.name) }} />
          </div>
          {onlineUsers[info._id] && (
            <div className="absolute right-0 translate-x-[50%] bottom-0 w-5 aspect-square rounded-full bg-green-600"></div>
          )}
        </div>
      </div>
      <div className="text-white font-semibold text-xs text-wrap line-clamp-1 overflow-hidden w-full">
        <span>{info.name}</span>
        <span className="text-gray-500"> ({info.rating})</span>
      </div>
    </div>
  );
}

export default SingleFriend;
