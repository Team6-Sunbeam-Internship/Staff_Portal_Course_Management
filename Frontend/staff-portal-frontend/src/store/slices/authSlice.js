import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	authUser: {
		name: "",
		email: "",
		emailVerified: !1,
		phoneNumber: "",
		phoneNumberVerified: !1,
		role: "",
		staffId: "",
		staffType: "",
		specialization: "",
		gender: "",
		address: "",
	},
	isAuthenticated: !1, //
	isInitializing: !0,
	lastActivity: null,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setAuthUser: (state, action) => {
			const { name, email, emailVerified, phoneNumber, phoneNumberVerified, role, staffId, staffType, specialization, gender, address } =
				action.payload;
			if (!state.authUser) {
				((state.authUser = {
					name: "",
					email: "",
					emailVerified: !1,
					phoneNumber: "",
					phoneNumberVerified: !1,
					role: "",
					staffId: "",
					staffType: "",
					specialization: "",
					gender: "",
					address: "",
				}),
					(state.isAuthenticated = !1));
				state.isInitializing = !0;
				state.lastActivity = null;
			}

			state.authUser = {
				name,
				email,
				emailVerified,
				phoneNumberVerified,
				phoneNumber,
				role,
				staffId,
				staffType,
				specialization,
				gender,
				address,
			};
			state.isAuthenticated = !0;
			state.isInitializing = !1;
			state.lastActivity = new Date().getDate() + "-" + new Date().getHours() + ":" + new Date().getMinutes();
		},

		updateAuthUser: (state, action) => {
			state.authUser = {
				...state.authUser,
				...action.payload,
			};
		},
	},
});

export const { setAuthUser, updateAuthUser } = authSlice.actions;
export default authSlice.reducer;
