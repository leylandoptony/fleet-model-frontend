import React, { useState, useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import LoginForm from "../components/LoginForm";

function Login() {
  const { login, getUser } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginstatus = await login(email, password);
      const loggedInUser = getUser();
      if (loginstatus) {
        setMessage("User logged in successfully!");
      } else {
        setMessage("Error logging in");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="relative bg-gray-100 flex-1 h-full">
        <img
          src="/logo2.png"
          alt="Logo"
          className="z-10 absolute left-0 bottom-0 h-auto w-[200px] m-10"
        />


        <img
          className="h-full object-cover filter grayscale"
          src="ProFormaPage.png"
          rel="preload" 
          alt="evtruck"
        />
      </div>
      <div className="flex-1 bg-gray-100 h-full flex justify-center items-center">
        <div className="w-[400px]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;
