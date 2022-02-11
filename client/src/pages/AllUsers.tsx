import { Card, Skeleton } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import UserItem from "../components/UserItem/UserItem";
import { fetchAllSuggestedUser } from "../features/users/usersSlice";

function AllUsers() {
  const { allSuggestedUser, fetchingAllSuggestion, appUser } = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllSuggestedUser());
  }, []);

  return (
    <Card style={{ maxWidth: "400px", margin: "0 auto" }} title="All suggesstions for you">
      {fetchingAllSuggestion && (
        <>
          <Skeleton />
          <Skeleton />
        </>
      )}

      {allSuggestedUser.map((user) => (
        <UserItem user={user} appUser={appUser} />
      ))}
    </Card>
  );
}

export default AllUsers;
