import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import PostItem from "../../components/PostItem/PostItem";

function Posts() {
  const { allPosts } = useSelector((state: RootState) => state.posts);

  return (
    <>
      {allPosts.map((post: any) => {
        return <PostItem isSingle={false} key={post._id} post={post} />;
      })}
    </>
  );
}

export default Posts;
