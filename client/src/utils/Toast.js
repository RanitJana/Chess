import toast from "react-hot-toast";

const toastSettings = {
  style: {
    borderRadius: "10px",
    background: "#333",
    color: "#fff",
  },
};
const Toast = {
  success: (message, options = {}) =>
    toast.success(message, { ...toastSettings, ...options }),
  error: (message, options = {}) =>
    toast.error(message, { ...toastSettings, ...options }),
  loading: (message, options = {}) =>
    toast.loading(message, { ...toastSettings, ...options }),
  custom: (message, options = {}) =>
    toast(message, { ...toastSettings, ...options }),
  dismiss: (toastId) => toast.dismiss(toastId),
};

export default Toast;
