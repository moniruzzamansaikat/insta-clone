import { Button, Modal, Switch } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../app/store";
import { makeDark, makeLight } from "../../features/theme/themeSlice";
import { deleteAccount } from "../../features/users/usersSlice";

function SettingModel({ isSetting, setIsSetting }: any) {
  const { appUser } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteAccount(appUser?._id));
  };

  return (
    <Modal visible={isSetting} onCancel={() => setIsSetting(false)} title="Setting">
      <Button style={{ width: "100%" }}>Logout</Button>
      <br />
      <br />
      <Button style={{ width: "100%" }}>
        <Link to="/profile/edit">Edit Profile</Link>
      </Button>
      <br />
      <br />

      <Button style={{ width: "100%" }} danger onClick={handleDelete}>
        Delete Account{" "}
      </Button>
    </Modal>
  );
}

export default SettingModel;
