import { createSlice } from "@reduxjs/toolkit";

const threadSlice = createSlice({
  name: "threads",
  initialState: {
    threads: [],
    thread: "",
    threadLoading: false
  },
  reducers: {
    setThreads: (state, action) => {
      state.threads = action.payload.reverse();
    },
    setThreadLoading: (state, action) => {
      state.loading = action.payload;
    },
    setThread: (state, action) => {
      state.thread = action.payload;
    }
  }
});

export const { setThread, setThreadLoading, setThreads } = threadSlice.actions;
export default threadSlice.reducer;
