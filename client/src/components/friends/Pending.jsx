/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router";
import GetAvatar from "../../utils/GetAvatar.js";
import { rejectFriendRequest, acceptFriendRequest } from "../../api/friend.js";
import Toast from "../../utils/Toast.js";

function Pending({ user = {}, isOnline = false, setFriends }) {
  const navigate = useNavigate();

  const [isSubmit, setIsSubmit] = useState(false);

  const handleRejectFriendRequest = async function (modelId) {
    if (isSubmit) return;
    try {
      setIsSubmit(true);
      let response = await rejectFriendRequest({ modelId });
      if (response) {
        if (response.data.success) {
          Toast.success(response.data.message);
          setFriends((prev) => {
            return {
              already: prev.already,
              pending: prev.pending.filter((val) => val.modelId != modelId),
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

  const handleAcceptFriendRequest = async function (modelId) {
    if (isSubmit) return;
    try {
      setIsSubmit(true);
      let response = await acceptFriendRequest({ modelId });
      if (response) {
        if (response.data.success) {
          Toast.success(response.data.message);
          setFriends((prev) => {
            return {
              already: [
                ...prev.pending.filter((val) => val.modelId == modelId),
                ...prev.already,
              ],
              pending: prev.pending.filter((val) => val.modelId != modelId),
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

  return (
    <li
      key={user._id}
      className="relative justify-between flex flex-wrap flex-row gap-5 sm:p-4 p-2 odd:bg-blackLight rounded-lg"
    >
      <div className="flex items-center gap-4 w-full">
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
        <div className="flex flex-col gap-1 w-full text-sm">
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
          <div className="grid grid-cols-2 gap-2 w-full max-w-[15rem]">
            <button
              className={`bg-red-500 hover:bg-red-600 rounded-md h-10 flex items-center justify-center w-full transition-colors ${isSubmit && "brightness-50 cursor-not-allowed"}`}
              disabled={isSubmit}
              onClick={() => handleRejectFriendRequest(user.modelId)}
            >
              <span className="text-white font-bold text-sm">Decline</span>
            </button>
            <button
              className={`bg-green-500 hover:bg-green-600 rounded-md h-10 flex items-center justify-center w-full transition-colors ${isSubmit && "brightness-50 cursor-not-allowed"}`}
              disabled={isSubmit}
              onClick={() => handleAcceptFriendRequest(user.modelId)}
            >
              <span className="text-white font-bold text-sm">Accept</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default Pending;
