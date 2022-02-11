import { Input, Form, Row, Col, Button } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../../features/posts/postsSlice";

function CommentBox({ commentForm, userId, postId }: any) {
  const dispatch = useDispatch();

  // submit new comment
  const handleCommentSubmit = () => {
    const newComment = {
      text: commentForm.getFieldValue("text"),
      userId,
      postId,
    };
    dispatch(addComment(newComment));
    commentForm.resetFields();
  };

  return (
    <div>
      <div>
        <Input.Group size="large">
          <Form form={commentForm} onFinish={handleCommentSubmit}>
            <Row gutter={1}>
              <Col span={20}>
                <Form.Item name="text">
                  <Input placeholder="Add a comment..." />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Button type="primary" style={{ width: "100%", minHeight: "40px" }} htmlType="submit">
                  Post
                </Button>
              </Col>
            </Row>
          </Form>
        </Input.Group>
      </div>
    </div>
  );
}

export default CommentBox;
