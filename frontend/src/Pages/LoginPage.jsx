import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    // console.log(email, password);
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="border-2 border-emerald-600 p-20 rounded-xl bg-white">
          <h1 className="font-semibold text-emerald-600 mb-3 text-center text-2xl">
            Login
          </h1>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
            className="flex flex-col items-center justify-center"
          >
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              className="border-2 border-emerald-600 rounded-full px-5 py-3 text-xl outline-none bg-transparent placeholder:text-gray-400"
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
              className="border-2 border-emerald-600 rounded-full mt-5 px-5 py-3 text-xl outline-none bg-transparent placeholder:text-gray-400"
            />
            <button className="border-2 border-none rounded-full px-5 py-3 mt-5 text-xl bg-emerald-600 text-white hover:bg-emerald-400 active:bg-emerald-800">
              Login
            </button>
            <div className="mt-3">
              <p>
                Don't have an account?
                <span className="text-emerald-600">
                  <Link to="/signin">Sign-up</Link>
                </span>
              </p>
            </div>
          </form>
        </div>
         
      </div>
    </>
  );
};

export default LoginPage;
