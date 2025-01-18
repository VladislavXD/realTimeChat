import React, { FC, useContext, useState } from "react";
// import Field from "../../ui/input/field";
import authBg from "./../../images/black_background-texture-2.jpg";
import GoogleIcon from './../../images/authGoogle.svg'
// import authLogo from '@/publick/social.png'
import { Button, Checkbox, Link } from "@nextui-org/react";
import { useTheme } from "next-themes";
import video from './../video/12788303_1920_1080_30fps.mp4'
import { Context } from "../../main";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";






const Auth = () => {
  const [type, setType] = useState  ("login");
  const {auth} = useContext(Context)


  const Login = async ()=> {
    const provider = new GoogleAuthProvider();
    const {user} = await signInWithPopup(auth, provider)
    
  }
  return (
    <>

      <div className={`flex items-center justify-center h-screen dark  dark:text-white`}>
        <div
          className="flex flex-col items-center h-screen w-screen justify-center bg-none bg-transparent overflow-hidden bg-content1 p-2 sm:p-4 lg:p-8 relative z-20"
          
        >

          <div className="flex flex-col items-center pb-2">
            {/* <img src={authLogo.src} className="h-[60px] w-[60px]" alt="" /> */}
            <p className="text-xl font-medium text-white" >Welcome</p>
            <p className="text-small text-default-500">Create your account to get started</p>
          </div>
          <div className="mt-2 bg-transparent  backdrop-blur-md flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
            {/* <Heading className="pb-2 text-xl font-medium dark:text-white">{type == 'login' ? 'Log In' : 'Sign Up'}</Heading> */}
            <h1 className="pb-2 text-xl font-medium dark:text-white">
              {type === "login" ? "Log In" : "Sign Up"}
            </h1>

            {/* <div className="flex items-center gap-4 py-2">
              <div className="bg-divider border-none w-full h-divider flex-1"></div>
              <p className="shrink-0 text-tiny text-default-500">OR</p>
              <div className="bg-divider border-none w-full h-divider flex-1"></div>
            </div> */}

            <div className="flex flex-col gap-2 text-center ">
              <Button variant="bordered" onClick={Login} ><img src={GoogleIcon} alt="" />Continue With Google</Button>
              <p className="text-xs">Need to create an account?
                <Link  onClick={() => { setType(type === 'login' ? 'register' : 'login') }} href="#">
                  {type == 'login' ? 'Sign Up' : 'login'}</Link> </p>
            </div>

          </div>
        </div>
        <video src={video} className='video object-cover w-full h-screen absolute z-10' autoPlay={true} loop  muted control={false} ></video>
      </div>

    </>
  );
};

export default Auth;
