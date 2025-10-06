import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	header: {
		title: "",
		subtitle: "",
		action: null,
	},
};

export const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		setHeaderInfo: (state, action) => {
			state.header = action.payload;
		},
		resetHeaderInfo: (state) => {
			state.header = initialState.header;
		},
	},
});

export const { setHeaderInfo } = uiSlice.actions;
export default uiSlice.reducer;
