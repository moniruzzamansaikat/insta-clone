import { xhr } from "./../../adapter/xhr";
import { authToken, openNotification, toBase64 } from "./../../util";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PostsState {
  allPosts: Array<any>;
  status: "idle" | "loading" | "failed";
  creatingPost?: boolean;
  createdPost?: boolean;
  fetchingPost: boolean;
  post: any;
}

const initialState: PostsState = {
  allPosts: [],
  status: "idle",
  creatingPost: false,
  createdPost: false,
  post: {},
  fetchingPost: true,
};

// fetch posts
export const fetchPosts = createAsyncThunk("posts/fetchAll", async (limit: any = 10, { rejectWithValue }) => {
  try {
    const { data } = await xhr(`/posts?limit=${limit}`, {
      method: "get",
    });

    return data;
  } catch (e) {
    return rejectWithValue(e);
  }
});

// fetch post by id
export const fetchPostById = createAsyncThunk("posts/fetchPostById", async (id: any, { rejectWithValue }) => {
  try {
    const { data } = await xhr(`/posts/${id}`, { method: "GET" });
    return data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// create new post
interface CreateNewPostParam {
  file: File | null;
  body: string;
  userId: string;
}
export const createNewPost = createAsyncThunk("posts/createNew", async ({ file, body, userId }: CreateNewPostParam) => {
  const fileStr = await toBase64(file);
  const { data } = await xhr("/posts", {
    method: "POST",
    data: {
      body,
      image: fileStr,
      user: userId,
    },
  });
  return data;
});

/**
 * @params: {file: File | null, body: string, userId: string}
 */
interface DeletePostParam {
  publicId: string;
  id: string;
}
// delete post
export const deletePost = createAsyncThunk("posts/deletePost", async ({ id, publicId }: DeletePostParam) => {
  const { data } = await xhr("/posts", {
    method: "DELETE",
    data: { id, publicId },
  });
  return data;
});

// like post
export const likePost = createAsyncThunk("posts/likePost", async ({ postId, userId }: any, { rejectWithValue }) => {
  try {
    const { data } = await xhr(`/posts/${postId}/likes`, {
      method: "POST",
      data: { userId },
    });
    if (data.success) {
      const likeData = { avatar: data.data.avatar, username: data.data.username, _id: data.data._id };
      return { postId, likeData };
    }
  } catch (error) {
    return rejectWithValue(error);
  }
});

// dislike post
export const unlikePost = createAsyncThunk("posts/unlikePost", async ({ postId, userId }: any, { rejectWithValue }) => {
  try {
    const { data } = await xhr(`/posts/${postId}/likes`, {
      method: "DELETE",
      data: { userId },
    });
    if (data.success) {
      return { postId, data: { avatar: data.data.avatar, username: data.data.username, _id: data.data._id } };
    }
  } catch (error) {
    return rejectWithValue(error);
  }
});

// add comment
export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, userId, text }: any, { rejectWithValue }) => {
    try {
      const { data } = await xhr(`/posts/${postId}/comments`, {
        method: "POST",
        data: { userId, text },
      });

      if (data.success) {
        return {
          postId,
          comments: data.data,
        };
      }
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

// Main slice
export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setNewPostCreating: (state, { payload }) => {
      state.creatingPost = payload;
    },
    setPostCreated: (state, { payload }) => {
      state.createdPost = payload;
    },
    addPost: (state, { payload }) => {
      return {
        ...state,
        allPosts: [payload, ...state.allPosts],
      };
    },
    setFetchingPost: (state, { payload }) => {
      state.fetchingPost = payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, { payload }: any) => {
        state.status = "idle";
        state.allPosts = payload;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(createNewPost.fulfilled, (state, { payload }) => {
        state.creatingPost = false;
        state.createdPost = true;
        openNotification("Post created successfully!");
        state.allPosts = [payload, ...state.allPosts];
      })
      .addCase(createNewPost.rejected, (state) => {
        state.creatingPost = false;
      })
      .addCase(deletePost.fulfilled, (state, { payload }) => {
        state.allPosts = state.allPosts.filter((post) => post._id !== payload.id);
      })
      .addCase(likePost.fulfilled, (state, { payload }) => {
        // for all posts
        state.allPosts.forEach((post: any) =>
          post._id === payload?.postId ? post.likes.push(payload?.likeData) : null
        );

        // for single post
        if (state.post._id === payload?.postId) {
          state.post.likes.push(payload?.likeData);
        }
      })
      .addCase(unlikePost.fulfilled, (state, { payload }) => {
        // for all posts
        state.allPosts.forEach((post: any) =>
          post._id === payload?.postId
            ? (post.likes = post.likes.filter((user: any) => user?._id !== payload?.data._id))
            : null
        );

        // for single post
        if (state.post._id === payload?.postId) {
          state.post.likes = state.post.likes.filter((user: any) => user?._id !== payload?.data._id);
        }
      })
      .addCase(addComment.fulfilled, (state, { payload }) => {
        // for all posts
        state.allPosts.forEach((post) => {
          if (post._id === payload?.postId) {
            post.comments = payload?.comments;
          }
        });

        // for single post
        if (state.post._id === payload?.postId) {
          state.post.comments = payload?.comments;
        }
      })
      .addCase(fetchPostById.fulfilled, (state, { payload }) => {
        state.fetchingPost = false;
        state.post = payload;
      });
  },
});

export const { addPost, setNewPostCreating, setPostCreated, setFetchingPost } = postsSlice.actions;

export default postsSlice.reducer;
