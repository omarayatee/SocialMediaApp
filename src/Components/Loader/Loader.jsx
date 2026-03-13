import React from "react";
import { Comment } from "react-loader-spinner";
export default function Loader() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Comment
        visible={true}
        height="80"
        width="80"
        ariaLabel="comment-loading"
        wrapperStyle={{}}
        wrapperClass="comment-wrapper"
        color="#fff"
        backgroundColor="#F4442E"
      />
    </div>
  );
}
