import {
  CardFooter,
  CardHeader,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PLACEHOLDER_IMAGE =
  "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

export default function Comment({ comment }) {
  const { commentCreator, content, createdAt } = comment;
  const { name, photo, _id } = commentCreator;

  const { userId: logedUserId } = useContext(AuthContext);

  const userId = _id;

  const navigate = useNavigate();

  const query = useQueryClient();
  function deleteMyComment() {
    return axios.delete(
      `https://route-posts.routemisr.com/posts/${comment.post}/comments/${comment._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  const { isPending: isDeleting, mutate: deleteComment } = useMutation({
    mutationFn: deleteMyComment,

    onSuccess: () => {
      toast.success("Comment Deleted Successfully 👍");
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
    },
    onError: () => {
      toast.error("Can't Delete the Comment right Now 🔴");
    },
    onSettled: () => {},
  });

  const [openMenu, setOpenMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content || "");
  const [editedImage, setEditedImage] = useState(null);
  const [actionError, setActionError] = useState("");

  function updateMyComment() {
    const formData = new FormData();
    formData.append("content", editedContent);

    if (editedImage) {
      formData.append("image", editedImage);
    }
    return axios.put(
      `https://route-posts.routemisr.com/posts/${comment.post}/comments/${comment._id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      },
    );
  }
  const { mutate: updateCommentMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateMyComment,
    onSuccess: () => {
      toast.success("Comment Update Successfully 👍");
      setActionError("");
      setIsEditing(false);
      setOpenMenu(false);
      setEditedImage(null);
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
    },
    onError: (error) => {
      toast.error("Can't update the Comment right Now 🔴");
      setActionError(
        error?.response?.data?.message || "Failed to update comment.",
      );
    },
  });

  return (
    <CardFooter>
      <CardHeader className="flex justify-between gap-3">
        <div className="flex gap-3">
          <img
            alt="heroui logo"
            height={40}
            radius="sm"
            src={photo}
            width={40}
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
          <div className="flex flex-col">
            <p className="text-md">{name}</p>
            <p className="text-small text-default-500">{createdAt}</p>
            {isEditing ? (
              <div className="flex flex-col gap-2 mt-2">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="border p-2 rounded"
                />

                <div className="flex gap-2">
                  <div
                    className="text-blue-700 rounded-sm p-2 cursor-pointer bg-amber-100"
                    onClick={() => updateCommentMutate()}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </div>

                  <div
                    className="text-black-700 rounded-sm p-2 cursor-pointer bg-amber-100"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedContent(comment.content);
                    }}
                  >
                    Cancel
                  </div>
                </div>
              </div>
            ) : (
              comment.content && <p>{comment.content}</p>
            )}
            {comment.image && <img src={comment.image} />}
          </div>
        </div>

        {logedUserId === userId && (
          <Dropdown>
            <DropdownTrigger>
              <BsThreeDotsVertical className="cursor-pointer" />
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem onClick={() => setIsEditing(true)} key="edite">
                Edite Comment
              </DropdownItem>
              <DropdownItem onClick={deleteComment} key="delete">
                Delete Comment
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </CardHeader>
    </CardFooter>
  );
}
