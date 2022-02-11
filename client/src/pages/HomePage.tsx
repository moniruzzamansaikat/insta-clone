import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { fetchPosts } from "../features/posts/postsSlice";
import { Row, Col, Skeleton } from "antd";
import HomeSidebar from "../components/HomeSidebar/HomeSidebar";
import Posts from "../features/posts/Posts";
import styles from "../styles/HomePage.module.css";

// main compoent
function HomePage() {
  const { status } = useSelector((state: RootState) => state.posts);
  const [limit, setLimit] = useState(10);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts(limit));
  }, [dispatch, limit]);

  if (status === "failed") return <h2>FAILED TO CONNECT TO DATABASE !!</h2>;

  return (
    <div>
      <Row>
        <Col sm={24} md={16}>
          {status === "loading" ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : (
            <Posts />
          )}
        </Col>
        <Col span={8} className={styles.sidebar}>
          <HomeSidebar />
        </Col>
      </Row>
    </div>
  );
}

export default HomePage;
