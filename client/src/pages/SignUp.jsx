/* eslint-disable no-unsafe-optional-chaining */
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signup } from "../api/auth.js";
import toast from "react-hot-toast";
import Button from "../components/Button.jsx";
import InputField from "../components/InputField.jsx";

export default function Login() {
  const [info, setInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmit, setSubmit] = useState(false);

  const navigate = useNavigate();

  const handleFormSumbit = async function (e) {
    e.preventDefault();

    if (isSubmit) return toast.loading("Please wait..");
    console.log(info);

    if (!info.email || !info.password || !info.confirmPassword || !info.name)
      return toast.error("Please fill all the fields..");

    try {
      setSubmit(true);

      const response = await signup({
        name: info.name,
        email: info.email,
        password: info.password,
        confirmPassword: info.confirmPassword,
      });
      const { success, message } = response?.data;
      if (success) {
        toast.success(message);
        navigate("/login");
      } else toast.error(message);
    } catch (error) {
      console.log(error);
    } finally {
      setSubmit(false);
    }
  };

  return (
    <div className="relative h-full min-h-[100dvh] w-full grid items-center justify-center">
      <img src="/images/tile.png" alt="" className="absolute bottom-0 w-full" />
      <form
        onSubmit={handleFormSumbit}
        className="bg-blackDark h-fit max-w-[400px] w-[100dvw] min-w-fit rounded-xl flex flex-col gap-4 z-[2]"
      >
        <div className="p-4 flex flex-col gap-4">
          <div className="relative bg-blackLight w-full">
            <img
              src="/images/name.png"
              alt=""
              className="absolute left-2 w-5 top-[50%] translate-y-[-50%]"
            />
            <InputField
              type={"text"}
              placeholder={"Your Name"}
              value={info.name}
              setInfo={setInfo}
              infoName={"name"}
            />
          </div>
          <div className="relative bg-blackLight w-full">
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
          <div className="relative bg-blackLight w-full">
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
          <div className="relative bg-blackLight w-full">
            <img
              src="/images/lock.png"
              alt=""
              className="absolute left-2 w-5 top-[50%] translate-y-[-50%]"
            />
            <InputField
              type={"password"}
              placeholder={"Confirm Password"}
              value={info.confirmPassword}
              setInfo={setInfo}
              infoName={"confirmPassword"}
            />
          </div>
          <Button isSubmit={isSubmit}>
            <p>Sign Up</p>
          </Button>
        </div>
        <Link
          to="/login"
          className="bg-blackDarkest text-gray-400 p-5 text-center rounded-bl-xl rounded-br-xl"
        >
          Already have an account? Sign In!
        </Link>
      </form>
    </div>
  );
}