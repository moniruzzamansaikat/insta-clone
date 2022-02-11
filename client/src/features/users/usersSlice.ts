import { toBase64 } from "./../../util";
import { xhr } from "./../../adapter/xhr";
import { createAsyncThunk, createSlice,   } from "@reduxjs/toolkit";
import { openNotification } from "../../util";

// state interface
export interface UserState {
  suggestedUsers: Array<any>;
  allSuggestedUser: Array<any>;
  fetchingAllSuggestion: boolean;
  appUser: any;
  status: "idle" | "loading" | "failed";
  profileUser: any;
  followingList: any[];
  followersList: any[];
  loggingIn: boolean;
  registering: boolean;
  registerSuccess?: boolean;
  loginSuccess?: boolean;
  notifications?: any[];
  uploadingAvatar: boolean;
}

// state initial value
const initialState: UserState = {
  suggestedUsers: [],
  allSuggestedUser: [],
  fetchingAllSuggestion: true,
  appUser: null,
  status: "idle",
  profileUser: null,
  followingList: [],
  followersList: [],
  loggingIn: false,
  registering: false,
  registerSuccess: false,
  loginSuccess: false,
  notifications: [],
  uploadingAvatar: false,
};

// fetch app user
export const fetchAppUser = createAsyncThunk("users/fetchUserApp", async () => {
  const { data } = await xhr("/users/current", {
    method: "get",
    headers: {
      Authorization: `jwt ${localStorage.getItem("jwt_token")}`,
    },
  });
  return data.data;
});

// fetch all suggested users
export const fetchAllSuggestedUser = createAsyncThunk("users/fetchAllSuggestedUser", async () => {
  try {
    const { data } = await xhr("/users", { method: "GET" });
    return data;
  } catch (error) {
    console.log(error);
  }
});

// fetch users notifications
export const fetchNotifications = createAsyncThunk("users/fetchNotifications", async (id: any) => {
  try {
    const { data } = await xhr(`/notifications/${id}`, { method: "get" });
    return data;
  } catch (error) {
    console.log(error);
  }
});

// fetch suggested users
export const fetchSuggestedUsers = createAsyncThunk("users/fetchSuggestedUsers", async () => {
  const { data } = await xhr("/suggestion", {
    method: "get",
  });
  return data.data;
});

// Todo: some changes need here :)
interface UpdateProfileInfoParam {
  email: string;
  username: string;
  bio: string;
  gender: string;
}

// login user
export const loginUser = createAsyncThunk("users/loginUser", async ({ email, password }: any, { rejectWithValue }) => {
  try {
    const { data } = await xhr("/auth/login", {
      method: "POST",
      data: {
        email,
        password,
      },
    });

    if (data.message === "No user found!" || data.message === "Password did not match!")
      return rejectWithValue(data.message);
    return data;
  } catch (error) {
    console.log(error);
  }
});

// register user
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async ({ fullname, email, password, password_confirmation }: any, { rejectWithValue }) => {
    try {
      const { data } = await xhr("/auth/register", {
        method: "POST",
        data: {
          fullname,
          email,
          password,
          password_confirmation,
        },
      });

      if (!data.success) {
        return rejectWithValue(data.message);
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

// update user info
export const updateProfileInfo = createAsyncThunk(
  "users/updateProfileInfo",
  async ({ email, username, bio, gender }: UpdateProfileInfoParam, { rejectWithValue }) => {
    try {
      const { data } = await xhr("/users/update_info", {
        method: "PUT",
        data: {
          email,
          username,
          bio,
          gender,
        },
      });

      if (!data.success) {
        return rejectWithValue(data.error);
      } else {
        return data.data;
      }
    } catch (error) {}
  }
);

// fetch profile user
export const fetchProfileUser = createAsyncThunk("users/fetchProfileUser", async (id: string) => {
  try {
    const { data } = await xhr(`/users/${id}`, {
      method: "get",
    });

    return data.data;
  } catch (exception) {
    console.log(exception);
  }
});

// update user avatar
export const updateAvatar = createAsyncThunk("users/updateAvatar", async ({ file, id }: any) => {
  const fileStr = await toBase64(file);
  try {
    const { data } = await xhr(`/users/update_avatar`, {
      method: "put",
      data: {
        file: fileStr,
        userId: id,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
});

// fetch followers
export const fetchFollowers = createAsyncThunk("users/fetchFollowers", async (userId: any, { rejectWithValue }) => {
  try {
    const { data } = await xhr(`/users/${userId}/followers`, {
      method: "get",
    });
    return data.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// fetch following
export const fetchFollowing = createAsyncThunk("users/fetchFollowing", async (userId: any, { rejectWithValue }) => {
  try {
    const { data } = await xhr(`/users/${userId}/following`, {
      method: "get",
    });
    return data.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// follow people
export const followPeople = createAsyncThunk(
  "users/followPeople",
  async ({ appUserId, userId }: any, { rejectWithValue }) => {
    try {
      const { data } = await xhr(`/users/${appUserId}/followers`, {
        method: "POST",
        data: {
          userId,
        },
      });

      console.log(data);
      if (data.success) {
        return userId;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// unfollow people
export const unFollowPeople = createAsyncThunk(
  "users/unFollowPeople",
  async ({ appUserId, userId }: any, { rejectWithValue }) => {
    try {
      const { data } = await xhr(`/users/${appUserId}/followers`, {
        method: "DELETE",
        data: {
          userId,
        },
      });

      if (data.success) {
        return userId;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// update password
export const changePassword = createAsyncThunk(
  "users/changePassword",
  async ({ oldPassword, newPassword, passwordConfirmation }: any, { rejectWithValue }) => {
    try {
      const { data } = await xhr("/auth/password", {
        method: "PUT",
        data: {
          oldPassword,
          newPassword,
          passwordConfirmation,
        },
      });
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

// delete account
export const deleteAccount = createAsyncThunk("users/deleteAccount", async (userId: any) => {
  try {
    const { data } = await xhr(`/users/${userId}`, { method: "DELETE" });
    return data;
  } catch (error) {
    console.log(error);
  }
});

/**
 * Main Slice
 */
export const usersSlice = createSlice({
  name: "users",
  initialState,

  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setLoggingIn: (state) => {
      state.loggingIn = true;
    },
    setRegistering: (state) => {
      state.registering = true;
    },
    setRegisterSucces: (state, { payload }) => {
      state.registerSuccess = payload;
    },
    setLoginSuccess: (state, { payload }) => {
      state.loginSuccess = payload;
    },
    setUploadingAvatar: (state, { payload }) => {
      state.uploadingAvatar = payload;
    },
  },

  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAppUser.fulfilled, (state, { payload }: any) => {
        state.status = "idle";
        state.appUser = payload;
      })
      .addCase(fetchSuggestedUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSuggestedUsers.fulfilled, (state, { payload }) => {
        state.suggestedUsers = payload;
      })
      .addCase(fetchProfileUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfileUser.fulfilled, (state, { payload }) => {
        state.profileUser = payload;
      })
      .addCase(updateProfileInfo.rejected, (state, { payload }) => {
        openNotification(payload, "error");
      })
      .addCase(updateProfileInfo.fulfilled, (state, { payload }) => {
        openNotification("Your information updated !");
      })
      .addCase(updateAvatar.fulfilled, (state, { payload }) => {
        state.profileUser = payload.user;
        state.appUser = payload.user;
        state.uploadingAvatar = false;
      })
      .addCase(fetchFollowers.fulfilled, (state, { payload }) => {
        state.followersList = payload;
      })
      .addCase(fetchFollowing.fulfilled, (state, { payload }) => {
        state.followingList = payload;
      })
      .addCase(followPeople.fulfilled, (state, { payload }) => {
        state.appUser.following = [...state.appUser.following, payload];
      })
      .addCase(unFollowPeople.fulfilled, (state, { payload }) => {
        state.appUser.following = state.appUser.following.filter((id: any) => id !== payload);
      })
      .addCase(changePassword.rejected, (state, { payload }) => {
        openNotification(payload, "error");
      })
      .addCase(changePassword.fulfilled, (state, { payload }) => {
        openNotification(payload, "success");
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loggingIn = false;
        state.loginSuccess = true;
        localStorage.setItem("jwt_token", payload);
      })
      .addCase(loginUser.rejected, (state, { payload }: any) => {
        openNotification(payload, "error");
        state.loginSuccess = false;
        state.loggingIn = false;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.registering = false;
        state.registerSuccess = true;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.registering = false;
        state.registerSuccess = false;
        openNotification(payload, "error");
      })
      .addCase(fetchNotifications.fulfilled, (state, { payload }) => {
        state.notifications = payload;
      })
      .addCase(deleteAccount.fulfilled, (state, { payload }) => {
        state.appUser = null;
        localStorage.removeItem("jwt_token");
        window.location.reload();
      })
      .addCase(fetchAllSuggestedUser.fulfilled, (state, { payload }) => {
        state.allSuggestedUser = payload;
        state.fetchingAllSuggestion = false;
      })
      .addCase(fetchAllSuggestedUser.rejected, (state, { payload }) => {
        state.fetchingAllSuggestion = false;
      });
  },
});

export const { setLoggingIn, setRegistering, setRegisterSucces, setLoginSuccess, setUploadingAvatar } =
  usersSlice.actions;

export default usersSlice.reducer;
