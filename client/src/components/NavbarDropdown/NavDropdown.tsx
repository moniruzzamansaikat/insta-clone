import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import SettingModel from "../SettingModel/SettingModel";

const NavbarDropdown = (history: any, setUsr: any, userId: any) => {
  const [isSetting, setIsSetting] = useState<any>(false);

  const handleSetting = (e: any) => {
    e.preventDefault();

    setIsSetting(!isSetting);
  };

  return (
    <Menu style={{ minWidth: "200px" }}>
      {/* settting modal */}
      {isSetting && <SettingModel isSetting={isSetting} setIsSetting={setIsSetting} />}

      <Menu.Item key="0">
        <UserOutlined style={{ marginRight: "10px" }} />
        <Link to={`/profile/${userId}`}>Profile</Link>
      </Menu.Item>

      <Menu.Item key="1">
        <SettingOutlined style={{ marginRight: "10px" }} />
        <Link to="/#" onClick={handleSetting}>
          Setting
        </Link>
      </Menu.Item>

      <Menu.Divider />
      <Menu.Item key="2">
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            localStorage.removeItem("jwt_token");
            setUsr();
            history.push("/");
          }}
        >
          Logout
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export default NavbarDropdown;
