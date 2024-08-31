import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userApi } from "../../api/userApi";

const initialState = {
  userData: [],
  isLoading: false,
};

// Define the async thunk
export const getUserData = createAsyncThunk("user/getUserData", async () => {
  try {
    const data = await userApi();
    return data;
  } catch (err) {
    console.log(err);
    throw err; // Re-throw the error to handle it in rejected state
  }
});

// Create the slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    createUser: (state, action) => {
      const newUser = action.payload;
      state.userData.push(newUser);
    },
    editUser: (state, action) => {
      const user = action.payload;
      state.userData = state.userData.map((u) => (u.id === user.id ? user : u));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
      })
      .addCase(getUserData.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { createUser, editUser } = userSlice.actions;
export default userSlice.reducer;
