import { useState } from "react";
import { Link, useNavigate } from "react-router";
import auth from "../hooks/auth.js";
import toast from "react-hot-toast";
import Button from "../components/Button.jsx";
import InputField from "../components/InputField.jsx";

export default function Login() {
  const [info, setInfo] = useState({
    email: "",
    password: "",
  });

  const [isSubmit, setSubmit] = useState(false);

  const navigate = useNavigate();

  const handleFormSumbit = async function (e) {
    e.preventDefault();

    if (isSubmit) return toast.loading("Please wait..");

    if (!info.email || !info.password)
      return toast.error("Please fill all the fields..");

    try {
      setSubmit(true);

      const { success, message } = await auth(
        "http://localhost:7096/api/v1/login",
        { email: info.email, password: info.password }
      );
      if (success) {
        toast.success(message);
        navigate("/");
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
          <Link
            to={"/login"}
            className="text-[13px] text-right text-white underline"
          >
            Forgot password?
          </Link>
          <Button isSubmit={isSubmit} value="Log In" />
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
