import { Modal, Spin } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { setUploadingAvatar, updateAvatar } from "../../features/users/usersSlice";
import { LoadingOutlined } from "@ant-design/icons";

// avatar upload
const UploadAvatar = ({ showAvatarModal, setShowAvatarModal }: any) => {
  const [file, setFile] = useState();
  const dispatch = useDispatch();
  const { uploadingAvatar, appUser } = useSelector((state: RootState) => state.users);

  const handleOk = () => {
    dispatch(setUploadingAvatar(true));
    dispatch(updateAvatar({ file, id: appUser._id }));
  };

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  return (
    <Modal
      title="Change profile picture"
      visible={showAvatarModal}
      onOk={handleOk}
      onCancel={() => setShowAvatarModal(false)}
      okText={uploadingAvatar ? <Spin indicator={<LoadingOutlined style={{ color: "#f0f0f0" }} />} /> : "OK"}
    >
      <input type="file" onChange={handleFileChange} />
    </Modal>
  );
};

export default UploadAvatar;
