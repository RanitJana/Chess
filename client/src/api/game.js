import axios from "axios";

//initialize a game
const gameInit = async function (body = {}) {
  try {
    let response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/game/init`,
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

//get all ongoing game info
const gameOngoing = async function (userId) {
  try {
    let response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/game/ongoing/${userId}`,
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error?.response;
  }
};

//get all ongoing challanges game info
const gameChallanges = async function (userId) {
  try {
    let response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/game/challange/${userId}`,
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error?.response;
  }
};
//delete a challange
const gameChallangeReject = async function (userId) {
  try {
    let response = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/game/challange/${userId}`,
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error?.response;
  }
};
//get all ongoing challanges game info
const gameChallangeAccept = async function (userId) {
  try {
    let response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/game/challange/${userId}`,
      {},
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error?.response;
  }
};

const gameDone = async function (total, userId) {
  try {
    let response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/game/done/${userId}/${total}`,
      {
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error?.response;
  }
};

//get single game info
const gameSingle = async function (gameId) {
  try {
    let response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/game/info/${gameId}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    return error?.response;
  }
};

const gameMove = async function (body) {
  try {
    let response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/game/move/`,
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

const gameEnd = async function (body) {
  try {
    let response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/game/end`,
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
  gameInit,
  gameOngoing,
  gameDone,
  gameSingle,
  gameMove,
  gameEnd,
  gameChallanges,
  gameChallangeReject,
  gameChallangeAccept,
};
