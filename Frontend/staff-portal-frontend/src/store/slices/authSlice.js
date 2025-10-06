import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	authUser: [
		{
			firstName: "",
			lastName: "",
			email: "",
			phoneNumber: "",
			role: "",
			staffType: "",
			staffId: "",
			courseCode: "",
			courseName: "",
			address: "",
		},
	],
	isAuthenticated: !1, //
	isInitializing: !0,
	lastActivity: null,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setAuthUser: (state, action) => {
			const {
				firstName,
				lastName,
				email,
				role,
				staffType,
				staffId,
				courseCode,
				courseName,
				address,
				isAuthenticated,
				lastActivity,
			} = action.payload;
			if (!state.authUser) {
				state.authUser = [
					{
						firstName: "",
						lastName: "",
						email: "",
						phoneNumber: "",
						role: "",
						staffType: "",
						staffId: "",
						courseCode: "",
						courseName: "",
						address: "",
					},
				];
				state.isAuthenticated = !1;
			}

			state.authUser = {
				firstName,
				lastName,
				email,
				role,
				staffType,
				staffId,
				courseCode,
				courseName,
				address,
			};
			state.isAuthenticated = isAuthenticated;
			state.lastActivity = lastActivity;
		},
	},
});

export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer;