import { Input } from "@heroui/react";
import { FaComment } from "react-icons/fa";

import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FaImage } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuLoaderCircle } from "react-icons/lu";
import { toast } from "react-toastify";

export default function CommentCreation({ postId, queryKey }) {
  const form = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
  });

  const query = useQueryClient();
  const { register, handleSubmit, reset } = form;
  const formData = new FormData();
  const createdComment = {
    content: "",
    image: "",
  };

  function createComment() {
    return axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, isPending, mutate } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      reset();
      query.invalidateQueries({ queryKey: queryKey });
      toast.success("Comment Created Successfully 👍", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    },
    onError: () => {
      toast.onError("🔴 Can't Create this Comment right now... !", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    },
  });

  function handleCreateComment(values) {
    if (!values.body && !values.image[0]) return;
    if (values.body) {
      formData.append("content", values.body);
    }
    if (values.image[0]) {
      formData.append("image", values.image[0]);
    }
    mutate();
  }

  return (
    <>
      <div className="w-[90%] mx-auto cursor-pointer my-1">
        <form
          onSubmit={handleSubmit(handleCreateComment)}
          className="flex gap-1 items-center"
        >
          <Input
            {...register("body")}
            labelPlacement="outside"
            placeholder="Enter Your Comment Here..."
            endContent={
              <button
                disabled={isPending}
                type="submit"
                className="text-white p-2 flex justify-center items-center cursor-pointer rounded-sm bg-blue-600 disabled:bg-slate-950 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <LuLoaderCircle className="animate-spin" />
                ) : (
                  <FaComment />
                )}
              </button>
            }
            type="text"
          />
          <label
            className="p-2 text-white cursor-pointer bg-blue-600 rounded-sm"
            htmlFor="uploadImage"
          >
            <FaImage />
          </label>
          <input {...register("image")} id="uploadImage" type="file" hidden />
        </form>
      </div>
    </>
  );
}
