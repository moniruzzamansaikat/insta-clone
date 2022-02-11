import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import { RootState } from "./app/store";
import EditProfile from "./components/EditProfile/EditProfile";
import Followers from "./components/Followers/Followers";
import Following from "./components/Following/Following";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import AllUsers from "./pages/AllUsers";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Notifications from "./pages/Notifications";
import PageNotFound from "./pages/PageNotFound";
import ProfilePage from "./pages/ProfilePage";
import Register from "./pages/RegisterPage";
import SinglePost from "./pages/SinglePost";

function App() {
  const { isDark, darkTheme, lightTheme } = useSelector((state: RootState) => state.themes);

  useEffect(() => {
    if (isDark) {
      document.body.style.background = darkTheme?.bodyBackground;
    } else {
      document.body.style.background = lightTheme.bodyBackground;
    }
  }, [isDark]);

  return (
    <div className="App">
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={Register} />

        {/* Protected Routes */}
        <PrivateRoute path="/" exact>
          <HomePage />
        </PrivateRoute>
        <PrivateRoute path="/posts/:id">
          <SinglePost />
        </PrivateRoute>
        <PrivateRoute path="/profile/:id/followers">
          <Followers />
        </PrivateRoute>
        <PrivateRoute path="/profile/:id/following">
          <Following />
        </PrivateRoute>
        <PrivateRoute path="/profile/edit" exact>
          <EditProfile />
        </PrivateRoute>
        <PrivateRoute path="/profile/:id" exact>
          <ProfilePage />
        </PrivateRoute>
        <PrivateRoute path="/notifications" exact>
          <Notifications />
        </PrivateRoute>
        <PrivateRoute path="/users">
          <AllUsers />
        </PrivateRoute>
        <PrivateRoute path="*" exact>
          <PageNotFound />
        </PrivateRoute>
      </Switch>
    </div>
  );
}

export default App;
