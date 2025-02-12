import axios from "axios";

const handleRank = async (page, count) => {
  try {
    let response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/rank`,
      {
        withCredentials: true,
        params: {
          page,
          count,
        },
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

export { handleRank };
