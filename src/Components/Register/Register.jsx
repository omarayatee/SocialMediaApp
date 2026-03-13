import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as zod from "zod";


const schema = zod
  .object({
    name: zod
      .string()
      .nonempty("name is required")
      .min(3, "min length is 3 chars")
      .max(10, "max length is 10 chars"),
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
    rePassword: zod.string().nonempty("rePassword is required"),
    dateOfBirth: zod.string().refine((date) => {
      const userDate = new Date(date);
      const currentDate = new Date();

      if (currentDate.getFullYear() - userDate.getFullYear() >= 10) {
        return true;
      } else {
        return false;
      }
    }, "invalid date.."),
    gender: zod.enum(["male", "female"]),
  })
  .refine(
    (object) => {
      if (object.password === object.rePassword) {
        return true;
      } else {
        return false;
      }
    },
    {
      error: "password & confirmation password not matched !",
      path: ["rePassword"],
    },
  );

export default function Register() {
  const navigate = useNavigate()
  const [apiError, setapiError] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },

    resolver: zodResolver(schema),

    mode: "onChange",
  });

  const { register, handleSubmit, setError, formState } = form;

  function handleRegister(values) {
    setisLoading(true)
    axios
      .post("https://route-posts.routemisr.com/users/signup", values)
      .then((res) => {
        if(res.data.message === "account created"){
          navigate("/login")
        }
        setisLoading(false)
      })
      .catch((err) => {
        setapiError(err.response.data.message)
        setisLoading(false)
      });
  }

  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold ">Register Now</h1>
      {apiError && <p className="bg-red-600 text-white font-bold p-2 m-5 rounded-sm w-[400px] mx-auto">{apiError}</p>}

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="max-w-md mx-auto my-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
      >
        {/* Name */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("name")}
            type="text"
            id="name"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label
            htmlFor="name"
            className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Name
          </label>
          {formState.errors.name && formState.touchedFields.name && (
            <p className="bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold">
              {formState.errors.name?.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            {...register(
              "email",
              //    ,{
              //   pattern : {value : "/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/" , message : "invalid email"}
              // }
            )}
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
              //   ,{
              //   pattern : {value : "/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/" , message : "invalid password"}
              // }
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

        {/* Re Password */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            {...register("rePassword")}
            id="rePassword"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label
            htmlFor="rePassword"
            className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Confirm Password
          </label>
          {formState.errors.rePassword &&
            formState.touchedFields.rePassword && (
              <p className="bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold">
                {formState.errors.rePassword?.message}
              </p>
            )}
        </div>

        {/* Date of birthday */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="date"
            {...register(
              "dateOfBirth",
              //   ,{
              //   valueAsDate : true ,
              //   validate : function(value){
              //     const userDate = value.getFullYear();
              //     const currentDate = new Date().getFullYear()
              //     if(currentDate - userDate >= 16){
              //       return true;
              //     }
              //     else{
              //       return "Invalid Date to accept"
              //     }

              //   }
              // }
            )}
            id="dateOfBirthday"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label
            htmlFor="dateOfBirthday"
            className="absolute start-[5px] top-[5px] text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Birthday
          </label>
          {formState.errors.dateOfBirth &&
            formState.touchedFields.dateOfBirth && (
              <p className="bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold">
                {formState.errors.dateOfBirth?.message}
              </p>
            )}
        </div>

        {/* Gender */}
        <div className="flex gap-4">
          <div className="flex items-center">
            <input
              id="male"
              type="radio"
              defaultValue="male"
              {...register(
                "gender",
                //   , {
                //   pattern : {value :"/^(male|female)$/" , message : "not valid gender"}
                // }
              )}
              className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
            />
            <label
              htmlFor="male"
              className="select-none ms-2 text-sm font-medium text-heading"
            >
              Male
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="female"
              type="radio"
              defaultValue="female"
              {...register("gender")}
              className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
            />
            <label
              htmlFor="female"
              className="select-none ms-2 text-sm font-medium text-heading"
            >
              FeMale
            </label>
          </div>
          {formState.errors.gender && formState.touchedFields.gender && (
            <p className="bg-slate-100 text-red-500 p-1 m-2 rounded-sm font-bold">
              {formState.errors.gender?.message}
            </p>
          )}
        </div>

        {/* Button */}
        <button
        disabled={isLoading}
          type="submit"
          className="text-white disabled:bg-slate-900 disabled:text-slate-200 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-600 rounded-lg w-full px-4 box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm my-4 py-2.5 focus:outline-none cursor-pointer"
        >
          {isLoading ? "Loading...." : "Register"}
        </button>

        <a href="login">Already have account ?</a>
      </form>
    </div>
  );
}
