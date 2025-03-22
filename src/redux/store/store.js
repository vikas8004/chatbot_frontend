import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import threadreducer from "../slices/threadSlice";
import messageReducer from "../slices/msgSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    threads: threadreducer,
    messages: messageReducer
  }
});
