import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { fetchPostById, setFetchingPost } from "../features/posts/postsSlice";
import PostItem from "../components/PostItem/PostItem";

// main componenet
function SinglePost() {
  const params: any = useParams();
  const { fetchingPost, post } = useSelector((state: RootState) => state.posts);
  const dispatch = useDispatch();

  // fetch post
  useEffect(() => {
    dispatch(fetchPostById(params.id));
    dispatch(setFetchingPost(true));
  }, [params, dispatch]);

  if (fetchingPost) {
    return (
      <>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </>
    );
  }

  return <PostItem isSingle={true} post={post} />;
}

export default SinglePost;
