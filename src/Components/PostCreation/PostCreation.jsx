import {
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
} from "@heroui/react";
import { IoClose } from "react-icons/io5";
import { FaImages } from "react-icons/fa";
import React, { useRef, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function PostCreation({ queryKey }) {
  const [isUploaded, setisUploaded] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const textInput = useRef(null);
  const imageInput = useRef(null);

  const query = useQueryClient();

  function handleImagePreview(e) {
    const path = URL.createObjectURL(e.target.files[0]);
    setisUploaded(path);
  }

  function handleRemoveImage() {
    setisUploaded(false);
    imageInput.current.value = "";
  }

  function prepareData() {
    const formData = new FormData();
    if (textInput.current.value) {
      formData.append("body", textInput.current.value);
    }
    if (imageInput.current.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    return formData;
  }

  function createPost() {
    return axios.post(
      `https://route-posts.routemisr.com/posts`,
      prepareData(),
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }

  const { data, isPending, mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      setisUploaded(null);
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      toast.success("Post Created Successfully 👍", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    //   textInput.current.value = "";
    //   imageInput.current.value = "";
      
    },
    onError: () => {
        toast.error("🔴 Can't Create this Post right now... !", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  });

  return (
    <div className="max-w-125 mx-auto mb-6 bg-slate-100 p-2 rounded-sm">
      <div className="flex gap-2 p-2 rounded-sm">
        <Avatar
          isBordered
          size="lg"
          src="https://i.pravatar.cc/150?u=a04258114e29026302d"
        />

        <input
          onClick={onOpen}
          type="text"
          className="w-full bg-slate-300 rounded-sm p-2 border border-slate-300 focus:border-none outline-none"
          placeholder="What's in Your Mind...!"
          readOnly
        />
      </div>
      <div className="modal ">
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex gap-1 items-center  bg-slate-200">
                  New Post
                </ModalHeader>
                <ModalBody>
                  <div className="relative">
                    <textarea
                      ref={textInput}
                      placeholder="What's in Your Mind...!"
                      className="w-full bg-slate-200 rounded-sm p-2 border border-slate-200 focus:border-none outline-none"
                    ></textarea>
                    <label className="absolute end-3 bottom-3">
                      <FaImages className="text-3xl text-blue-700 cursor-pointer" />
                      <input
                        ref={imageInput}
                        type="file"
                        onChange={handleImagePreview}
                        hidden
                      />
                    </label>
                  </div>

                  {isUploaded && (
                    <div className="relative">
                      <img
                        alt="Card background"
                        className="object-cover rounded-xl w-full"
                        src={isUploaded}
                      />
                      <IoClose
                        onClick={handleRemoveImage}
                        className="absolute top-3 end-3 text-white text-2xl cursor-pointer bg-black rounded-sm"
                      />
                    </div>
                  )}
                </ModalBody>
                <ModalFooter className="flex gap-3 items-center">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <button
                    onClick={function () {
                      mutate();
                      onClose();
                    }}
                    color="primary"
                    className="cursor-pointer hover:bg-blue-500 p-2 rounded-sm"
                  >
                    Create
                  </button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
