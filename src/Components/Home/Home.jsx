import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Loader from "./../Loader/Loader";
import PostCard from "./../PostCard/PostCard";
import { useQuery } from "@tanstack/react-query";
import PostCreation from './../PostCreation/PostCreation';
import { Helmet } from "react-helmet";

export default function Home() {
  
  function getAllPosts() {
    return axios.get("https://route-posts.routemisr.com/posts", {
      params: { sort: "-createdAt" },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }
  
  

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["getAllPosts"],
    queryFn: getAllPosts,
    refetchOnMount: true,
    // refetchInterval :2000 ,
    retry: 3,
    retryDelay: 3000,
    staleTime: 8000,
    gcTime: 5000 * 60,
    // enabled: true,

  });


  
  

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return (
    <>
    <Helmet>
    <title>Home</title>
  </Helmet>
    <PostCreation queryKey={["getAllPosts"]} />
      {data?.data.data.posts.map((post) => (
        <PostCard queryKey={["getAllPosts"]} key={post.id} post={post}/>
      ))}
    </>
  );
}
