import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { HomeOutlined, PlusOutlined } from "@ant-design/icons";
import { Dropdown, Input } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import CreatePost from "../CreatePost/CreatePost";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { fetchAppUser, fetchNotifications } from "../../features/users/usersSlice";
import styles from "./Navbar.module.css";
import NavbarDropdown from "../NavbarDropdown/NavDropdown";
const { Search } = Input;

function Navbar() {
  const [creatingPost, setCreatingPost] = useState(false);
  const history = useHistory();
  const user = useSelector((state: RootState) => state.users.appUser);
  const { isDark, lightTheme, darkTheme } = useSelector((state: RootState) => state.themes);
  const dispatch = useDispatch();

  const setUsr = () => {};

  useEffect(() => {
    dispatch(fetchAppUser());
    dispatch(fetchNotifications(user?._id));
  }, []);

  return (
    <>
      {creatingPost && <CreatePost creatingPost={creatingPost} setCreatingPost={setCreatingPost} />}

      <nav
        className={styles.nav}
        style={{
          background: isDark ? darkTheme.navBackground : lightTheme.navBackground,
          color: isDark ? "#f0f0f0" : "#0f0f0f",
        }}
      >
        <div className="container">
          <div className={styles.navbar}>
            <Link to="/">
              <img src="/img/logo.png" alt="" />
            </Link>

            <div className={styles.search_box}>
              <Search size="small" placeholder="Search..." />
            </div>

            <ul className={styles.navmenu}>
              <li>
                <Link to="/">
                  <HomeOutlined className={styles.link_item} />
                </Link>
              </li>

              <li>
                <div>
                  <PlusOutlined onClick={() => setCreatingPost(!creatingPost)} className={styles.link_item} />
                </div>
              </li>
              <li>
                <Dropdown overlay={NavbarDropdown(history, setUsr, user?._id)} trigger={["click"]}>
                  <Link to="/" className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                    <Avatar src={user?.avatar?.url} alt="" />
                  </Link>
                </Dropdown>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
