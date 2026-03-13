import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as zod from "zod";
import { AuthContext } from "../../Context/AuthContext";

const schema = zod.object({
  email: zod
    .email("invalid email")
    .nonempty("email is required")
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "not match with pattern"),
  password: zod
    .string()
    .nonempty("password is required")
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "password should contains at least 1 spical chars , 1 number , 1 small chars , 1 capital chars & min length 8 chars",
    ),
});

export default function Login() {
  const navigate = useNavigate();
  const [apiError, setapiError] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const {userLogin, setuserLogin } = useContext(AuthContext)

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    resolver: zodResolver(schema),

    mode: "onChange",
  });

  const { register, handleSubmit, setError, formState } = form;

  function handleLogin(values) {
    setisLoading(true);
    axios
      .post("https://route-posts.routemisr.com/users/signin", values)
      .then((res) => {
        if (res.data.message === "signed in successfully") {
          localStorage.setItem("userToken", res.data.data.token)
          setuserLogin(res.data.data.token)
          navigate("/home");
          
        }
        setisLoading(false);
      })
      .catch((err) => {
        setapiError(err.response.data.errors);
        setisLoading(false);
      });
  }

  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold ">Login Now</h1>
      {apiError && (
        <p className="bg-red-600 text-white font-bold p-2 m-5 rounded-sm w-[400px] mx-auto">
          {apiError}
        </p>
      )}

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="max-w-md mx-auto my-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
      >
        {/* Email */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            {...register("email")}
            id="email"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Email
          </label>
          {formState.errors.email && formState.touchedFields.email && (
            <p className="bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold">
              {formState.errors.email?.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            {...register(
              "password",
            )}
            id="password"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label
            htmlFor="password"
            className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Password
          </label>
          {formState.errors.password && formState.touchedFields.password && (
            <p className="bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold">
              {formState.errors.password?.message}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          disabled={isLoading}
          type="submit"
          className="text-white disabled:bg-slate-900 disabled:text-slate-200 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-600 rounded-lg w-full px-4 box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm my-4 py-2.5 focus:outline-none cursor-pointer"
        >
          {isLoading ? "Loading...." : "Login"}
        </button>

        <a href="register">Register Now</a>
      </form>
    </div>
  );
}