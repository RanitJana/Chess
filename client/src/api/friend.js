import axios from "axios";

const sendFriendRequest = async function (body = {}) {
    try {
        let response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URI}/api/v1/friend/send`,
            body,
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            }
        );

        return response;
    } catch (error) {
        return error?.response;
    }
};

const getFriends = async function () {
    try {
        let response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URI}/api/v1/friend/all`,
            {
                headers: {
                    "Content-Type": "application/json"
                },
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
                headers: {
                    "Content-Type": "application/json"
                },
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
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            }
        );

        return response;
    } catch (error) {
        return error?.response;
    }
};

export { sendFriendRequest, getFriends, acceptFriendRequest, rejectFriendRequest }