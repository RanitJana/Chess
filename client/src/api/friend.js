import axios from "axios";

const sendFriendRequest = async function (body = {}) {
  try {
    let response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/friend/send`,
      body,
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error?.response;
  }
};

const getFriends = async function (userId) {
  try {
    let response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/friend/all/${userId}`,
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error?.response;
  }
};

const acceptFriendRequest = async function (body = {}) {
  try {
    let response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/friend/accept`,
      body,
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error?.response;
  }
};

const rejectFriendRequest = async function (body = {}) {
  try {
    let response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/friend/reject`,
      body,
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error?.response;
  }
};

export {
  sendFriendRequest,
  getFriends,
  acceptFriendRequest,
  rejectFriendRequest,
};
