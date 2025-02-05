/* eslint-disable react/prop-types */
import { useGoogleLogin } from "@react-oauth/google";
import { loginGoogle } from "../../api/auth.js";
import Toast from "../../utils/Toast.js";
import { useNavigate } from "react-router";

function GoogleLoginButton({ setAuth, isSubmit, setSubmit, setPlayerInfo }) {
  const navigate = useNavigate();

  const handleLogin = async (authResponse) => {
    if (isSubmit) return;
    try {
      setSubmit(true);
      let { success, message, player } = (
        await loginGoogle({
          accessToken: authResponse.access_token,
        })
      ).data;
      if (success) {
        Toast.success(message);
        setAuth(true);
        setPlayerInfo(player);
        navigate("/");
      } else {
        Toast.error(message);
      }
    } catch (error) {
      console.log(error);
      Toast.error(error.message);
    } finally {
      setSubmit(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleLogin,
    onError: handleLogin,
    flow: "implicit",
  });

  return (
    <button
      onClick={googleLogin}
      disabled={isSubmit}
      className={`bg-blackDarkest transition-all w-fit flex items-center justify-center gap-2 px-4 py-2 rounded-md ${isSubmit ? "hover:cursor-not-allowed brightness-50" : "hover:cursor-pointer hover:bg-blackDark"}`}
    >
      <img src="/images/google.png" alt="" className="w-6" />
      <span className="text-gray-300 text-sm font-bold">
        Continue with google
      </span>
    </button>
  );
}

export default GoogleLoginButton;
