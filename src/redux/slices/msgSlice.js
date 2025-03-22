import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    messageLoading: false
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setMessageLoading: (state, action) => {
      state.messageLoading = action.payload;
    }
  }
});

export const { setMessageLoading, setMessages } = messageSlice.actions;
export default messageSlice.reducer;
