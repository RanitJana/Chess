/* eslint-disable no-unsafe-optional-chaining */
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login } from "../api/auth.js";
import Button from "../components/Button.jsx";
import InputField from "../components/InputField.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";
import Toast from "../utils/Toast.js";

export default function Login() {
  const [info, setInfo] = useState({
    email: "",
    password: "",
  });

  const { setAuth, setPlayerInfo } = useAuthContext();

  const [isSubmit, setSubmit] = useState(false);

  const navigate = useNavigate();

  const handleFormSumbit = async function (e) {
    e.preventDefault();

    if (isSubmit) return Toast.loading("Please wait..");

    if (!info.email || !info.password)
      return Toast.error("Please fill all the fields..");

    try {
      setSubmit(true);

      const response = await login({
        email: info.email,
        password: info.password,
      });
      const { success, message, player } = response?.data;

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
      Toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmit(false);
    }
  };

  return (
    <div className="relative h-full min-h-[100dvh] w-full grid items-center justify-center">
      <form
        onSubmit={handleFormSumbit}
        className="bg-blackDark h-fit max-w-[400px] w-[100dvw] min-w-fit rounded-xl flex flex-col gap-4 z-[2]"
      >
        <div className="p-4 flex flex-col gap-4">
          <div className=" w-full flex items-center justify-center min-h-[3rem]">
            <img
              src="/images/chess.com.png"
              alt=""
              className="w-[10rem]"
              decoding="sync"
            />
          </div>
          <div className="relative bg-blackLight w-full rounded-2xl">
            <img
              src="/images/user.png"
              alt=""
              className="absolute left-2 w-5 top-[50%] translate-y-[-50%]"
            />
            <InputField
              type={"email"}
              placeholder={"Email"}
              value={info.email}
              setInfo={setInfo}
              infoName={"email"}
            />
          </div>
          <div className="relative bg-blackLight w-full rounded-2xl">
            <img
              src="/images/lock.png"
              alt=""
              className="absolute left-2 w-5 top-[50%] translate-y-[-50%]"
            />
            <InputField
              type={"password"}
              placeholder={"Password"}
              value={info.password}
              setInfo={setInfo}
              infoName={"password"}
            />
          </div>
          <Link
            to={"/login"}
            className="text-[13px] text-right text-white underline"
          >
            Forgot password?
          </Link>
          <Button isSubmit={isSubmit}>
            <p>Log In</p>
          </Button>
        </div>
        <Link
          to="/signup"
          className="bg-blackDarkest text-gray-400 p-5 text-center rounded-bl-xl rounded-br-xl"
        >
          New? Sign up - and start playing chess!
        </Link>
      </form>
    </div>
  );
}
