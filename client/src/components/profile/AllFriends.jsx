/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { getFriends } from "../../api/friend.js";
import { useParams } from "react-router";
import SingleFriend from "./SingleFriend";
import SingleFriendSkeleton from "./SingleFriendSkeletion.jsx";
import Toast from "../../utils/Toast.js";

function AllFriends() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  const handleGetAllFriends = useCallback(async () => {
    try {
      setLoading(true);
      let response = await getFriends(userId);
      if (response) {
        setFriends(response.data.friends.filter((value) => value.accept));
      } else {
        Toast.error("Please try to refresh the page again.");
      }
    } catch (error) {
      console.log(error);
      Toast.error("Please try to refresh the page again.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    handleGetAllFriends();
  }, [userId]);

  return (
    <div className="w-full max-w-[970px] bg-blackDark rounded-md">
      <div className="flex gap-2 p-4 border-b-[2px] border-blackLight">
        <img
          src="/images/friends.png"
          alt=""
          className="brightness-0 invert w-6 aspect-square"
        />
        <p className="text-white font-bold">Friends ({friends.length})</p>
      </div>
      <div className=" flex gap-6 p-4 flex-wrap">
        {!loading ? (
          friends.length ? (
            friends.map((friend) => {
              return (
                <SingleFriend
                  key={friend._id}
                  info={
                    friend.sender._id.toString() == userId
                      ? friend.receiver
                      : friend.sender
                  }
                  userId={userId}
                />
              );
            })
          ) : (
            <div className="w-full text-sm text-center text-white font-semibold">
              No friend..
            </div>
          )
        ) : (
          <>
            <SingleFriendSkeleton />
            <SingleFriendSkeleton />
            <SingleFriendSkeleton />
          </>
        )}
      </div>
    </div>
  );
}

export default AllFriends;
