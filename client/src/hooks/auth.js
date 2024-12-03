import axios from "axios";

async function auth(url, body) {
  try {
    let response = await axios.post(`${url}`, body, {
      withCredentials: true,
    });

    return response;
  } catch (error) {
    return error?.response;
  }
}

export default auth;
