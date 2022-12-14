import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  roomInfos: [],
  userNickname: [],
};

const rtcSlice = createSlice({
  name: 'rtcSlice',
  initialState,
  reducers: {
    exit: (state, action) => {
      state.roomInfos = action.payload;
    },
    ready: (state, action) => {
      state.userNickname = [...action.payload];
      // state.userNickname = action.payload;
    },
  },
});

export const { getRoomInfo, getUserNickname } = roomSlice.actions;
export default rtcSlice.reducer;
