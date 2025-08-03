import React, { FC, useContext, useState } from "react";
import { Button, Checkbox, Link } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Field from "../ui/input/field";
import { validEmail } from "./valid-email";
import { Context } from "../../main";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import GoogleIcon from './../../images/authGoogle.svg';
import video from './../video/12788303_1920_1080_30fps.mp4';


import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Auth = () => {
  const [type, setType] = useState("login");
  const { auth, firestore } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);

  const Login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      console.log("User signed in:", user);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
  });


  // Firebase регистрация
  const registerUser = async (email, password, displayName = '') => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Сохраняем дополнительные данные в Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName || user.email,
        photoURL: user.photoURL || '',
        createdAt: new Date(),
      });

      console.log("Пользователь зарегистрирован и сохранён");
      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка регистрации:", error.message);
      setIsLoading(false);
      throw error;
    }
  };

  // Firebase вход
  const loginUser = async (email, password) => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Пользователь вошел в систему:", user);
      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка входа:", error.message);
      setIsLoading(false);
      throw error;
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
            <form className="flex flex-col gap-3" onSubmit={handleSubmit(async (data) => {
              try {
                if (type === 'login') {
                  await loginUser(data.email, data.password);
                } else {
                  await registerUser(data.email, data.password, data.displayName);
                }
                reset();
              } catch (error) {
                alert(`Ошибка: ${error.message}`);
              }
            })}>
              {type === 'register' && (
                <Field
                  {...formRegister("displayName", {
                    required: "Display name is required",
                    minLength: {
                      value: 2,
                      message: 'Name should be at least 2 characters!'
                    }
                  })}
                  type="text"
                  placeholder="Name"
                  error={errors.displayName?.message}
                />
              )}
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