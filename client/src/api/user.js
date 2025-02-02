import axios from "axios";

const getUserInfo = async function (userId) {
  try {
    let response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/user/info/${userId}`,
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error?.response;
  }
};

const updateUserInfo = async function (body = {}) {
  try {
    let response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/user/info`,
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

export { getUserInfo, updateUserInfo };
