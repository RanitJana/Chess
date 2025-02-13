import axios from "axios";

const handleSearch = async (username) => {
  try {
    let response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/search`,
      {
        withCredentials: true,
        params: {
          username,
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

export { handleSearch };
