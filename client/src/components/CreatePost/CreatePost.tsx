import { LoadingOutlined } from "@ant-design/icons";
import { Form, Input, Modal } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { createNewPost, setNewPostCreating, setPostCreated } from "../../features/posts/postsSlice";
import styles from "./CreatePost.module.css";

interface PropType {
  creatingPost: boolean;
  setCreatingPost: Function;
}

// MAIN COMPONENT
function CreatePost({ creatingPost, setCreatingPost }: PropType) {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { appUser } = useSelector((state: RootState) => state.users);
  const { createdPost, creatingPost: creatingNewPost } = useSelector((state: RootState) => state.posts);
  const dispatch = useDispatch();

  // remove modal after creating post
  if (createdPost) {
    dispatch(setPostCreated(false));
    setCreatingPost(false);
  }

  // submit form
  const submitForm = async () => {
    const body = form.getFieldValue("postbody");
    const userId = appUser?._id;

    dispatch(setNewPostCreating(true));
    dispatch(createNewPost({ body, file: imageFile, userId }));
  };

  // image upload change - event
  const onImageFileChange = (e: any) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <Modal
      title="Create A Post"
      visible={creatingPost}
      onOk={() => form.submit()}
      okText={creatingNewPost ? <LoadingOutlined /> : "Submit"}
      onCancel={() => setCreatingPost(false)}
      className={styles.modal}
    >
      <Form form={form} layout="vertical" onFinish={submitForm}>
        <Input type="file" name="image" onChange={onImageFileChange} />
        <br />
        <Form.Item label="Post body" name="postbody" rules={[{ required: true, message: "Please write a post body!" }]}>
          <Input.TextArea></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreatePost;
