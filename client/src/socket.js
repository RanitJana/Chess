import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = import.meta.env.VITE_BACKEND_URI;

export const socket = io(URL, { withCredentials: true });
