import React, { useState } from "react";
import { Link } from "react-router-dom";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cpassword, setCpassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    // console.log(email, password);
    setEmail("");
    setPassword("");
    setName("");
    setCpassword("");
  };

  return (
    <>
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="border-2 border-[rgb(66,63,228)] p-20 rounded-xl bg-white">
          <h1 className="font-semibold text-[rgb(66,63,228)] mb-3 text-center text-2xl">
            Sign-up
          </h1>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
            className="flex flex-col items-center justify-center"
          >
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
              type="text"
              placeholder="Enter your name"
              className="border-2 border-[rgb(66,63,228)] rounded-full mt-5 px-5 py-3 text-xl outline-none bg-transparent placeholder:text-gray-400"
            />
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              className="border-2 border-[rgb(66,63,228)] rounded-full mt-5 px-5 py-3 text-xl outline-none bg-transparent placeholder:text-gray-400"
              type="email"
              placeholder="Enter your email"
            />
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              type="password"
              placeholder="Enter password"
              className="border-2 border-[rgb(66,63,228)] rounded-full mt-5 px-5 py-3 text-xl outline-none bg-transparent placeholder:text-gray-400"
            />
            <input
              value={cpassword}
              onChange={(e) => {
                setCpassword(e.target.value);
              }}
              required
              type="password"
              placeholder="Confirm your password"
              className="border-2 border-[rgb(66,63,228)] rounded-full mt-5 px-5 py-3 text-xl outline-none bg-transparent placeholder:text-gray-400"
            />

            <button className="border-2 border-none rounded-full px-5 py-3 mt-5 text-xl bg-[rgb(66,63,228)] text-white hover:bg-[rgb(87,86,145)] active:bg-[rgb(23,22,95)]">
              Register
            </button>
          </form>
        </div>
         
      </div>
    </>
  );
};

export default SigninPage;
