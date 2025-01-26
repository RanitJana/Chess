/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router";
import GetAvatar from "../../utils/GetAvatar.js";
import { rejectFriendRequest, acceptFriendRequest } from "../../api/friend.js";
import toast from "react-hot-toast";

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
    <li
      key={user._id}
      className="relative justify-between flex flex-wrap flex-row gap-5 sm:p-4 py-4 px-2 odd:bg-blackLight rounded-lg"
    >
      <div className="flex items-center gap-4 w-full">
        <div className="relative w-[6rem] min-w-[5rem]">
          <div className="relative">
            <div className="w-20 relative rounded-xl overflow-hidden">
              <div
                dangerouslySetInnerHTML={{
                  __html: GetAvatar(user?.name),
                }}
                className="bg-white rounded-xl"
              />
            </div>
          </div>
          {isOnline && (
            <div className="absolute right-0 translate-x-[50%] bottom-0 w-5 aspect-square rounded-full bg-green-600"></div>
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
              onClick={() => handleRejectFriendRequest(user.modelId)}
            >
              <img src="/images/cross.png" alt="" className="w-6" />
            </button>
            <button
              className=" bg-[rgb(61,58,57)] rounded-md h-10 flex items-center justify-center w-full active:bg-blackLight transition-colors"
              disabled={isSubmit}
              style={{
                opacity: isSubmit ? "0.5" : "1",
                cursor: isSubmit ? "not-allowed" : "pointer",
              }}
              onClick={() => handleAcceptFriendRequest(user.modelId)}
            >
              <img src="/images/tick.png" alt="" className="w-5" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default Pending;
