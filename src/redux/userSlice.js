import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase.config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Fetch user data (ASYNC)
export const fetchUser = createAsyncThunk("user/fetchUser", async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data(); // Return user data
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
});

// Update user data (ASYNC)
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ uid, name, email }) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { name, email });
      return { name, email }; // Return updated values
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
);

// Redux Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userData = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        if (state.userData) {
          state.userData.name = action.payload.name;
          state.userData.email = action.payload.email;
        }
      });
  },
});

export default userSlice.reducer;
