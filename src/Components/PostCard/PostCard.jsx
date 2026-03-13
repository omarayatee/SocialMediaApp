import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import Comment from "../Comment/Comment";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CommentCreation from "../CommentCreation/CommentCreation";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import EditePost from "../EditePost/EditePost";

const PLACEHOLDER_IMAGE =
  "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

export default function PostCard({ post, queryKey, isPostDetails = false }) {
  const {
    body,
    bookmarked,
    commentsCount,
    topComment,
    image,
    comments,
    createdAt,
    id,
    user,
  } = post;
  const { name, photo } = user;

  const { userId: logedUserId } = useContext(AuthContext);

  const userId = user._id;

  const navigate = useNavigate();

  function getPostComments() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getPostComments"],
    queryFn: getPostComments,
    enabled: isPostDetails,
  });

  if (!body && !image) return;

  const query = useQueryClient();
  function deleteMyPost() {
    return axios.delete(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
  }

  const { isPending, mutate } = useMutation({
    mutationFn: deleteMyPost,
    onSuccess: () => {
      toast.success("Post Deleted Successfully 👍");
      query.invalidateQueries({ queryKey: ["getAllPosts"] });

      navigate("/");
    },
    onError: () => {
      toast.error("Can't Delete the Post right Now 🔴");
    },
    onSettled: () => {},
  });

  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <EditePost
        postInfo={post}
        setIsEditing={setIsEditing}
        queryKey={queryKey}
      />
    );
  }

  return (
    <Card className="max-w-125 mx-auto mb-6">
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
          </div>
        </div>

        {logedUserId === userId && (
          <Dropdown>
            <DropdownTrigger>
              <BsThreeDotsVertical className="cursor-pointer" />
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem onClick={() => setIsEditing(true)} key="edite">
                Edite Post
              </DropdownItem>
              <DropdownItem onClick={mutate} key="delete">
                Delete Post
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </CardHeader>

      <Divider />
      <CardBody>
        {body && <p className="mb-2">{body}</p>}
        {image && <img src={image} alt={body} className="w-full" />}
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="w-full flex justify-between">
          <div className="cursor-pointer">👍Like</div>
          <div className="cursor-pointer">
            <Link to={`/postdetails/${id}`}>💬Comments</Link>
          </div>
          <div className="cursor-pointer">↗️Share</div>
        </div>
      </CardFooter>

      <CommentCreation
        postId={id}
        queryKey={isPostDetails ? ["getPostComments"] : ["getAllPosts"]}
      />

      {!isPostDetails && topComment && <Comment comment={topComment} />}
      {isPostDetails &&
        data?.data.data.comments.map((currentComment) => (
          <Comment key={currentComment._id} comment={currentComment} />
        ))}
    </Card>
  );
}
