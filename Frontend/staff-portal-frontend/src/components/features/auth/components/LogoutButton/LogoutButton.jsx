import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button, ConfirmDialog } from "../../../../common";
import { useDispatch } from "react-redux";
import { authApi } from "../../../../../store";

export const LogoutButton = ({ variant = "ghost", size = "sm" }) => {
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const dispatch = useDispatch();
	const logout = authApi.endpoints.logout.useMutation();
	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await dispatch(logout()).unwrap();
		} catch (error) {
			console.error("Logout failed:", error);
		} finally {
			setIsLoggingOut(false);
			setConfirmOpen(false);
		}
	};

	return (
		<>
			<Button
				variant={variant}
				size={size}
				leftIcon={<LogOut className='w-4 h-4' />}
				onClick={() => setConfirmOpen(true)}
			>
				Logout
			</Button>
			<ConfirmDialog
				isOpen={confirmOpen}
				onClose={() => setConfirmOpen(false)}
				onConfirm={handleLogout}
				title='Confirm Logout'
				message='Are you sure you want to log out of the staff portal?'
				confirmText='Logout'
				loading={isLoggingOut}
			/>
		</>
	);
};
