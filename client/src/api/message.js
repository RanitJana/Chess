import axios from "axios";

const messagePost = async function (body = {}) {
  try {
    let response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/message`,
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

const messageGet = async function (gameId, lengthNow) {
  try {
    let response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/message/${gameId}?lengthNow=${lengthNow}`,
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error?.response;
  }
};

const messageReaction = async function (messageId, body = {}) {
  try {
    let response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/message/${messageId}`,
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

export { messageGet, messagePost, messageReaction };
