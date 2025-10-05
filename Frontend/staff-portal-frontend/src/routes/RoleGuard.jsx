import { useSelector } from "react-redux";
import {
	selectCurrentUser,
	selectAccessibleMenus,
} from "../store/selectors/authSelectors";
import { Navigate } from "react-router";

export const RoleGuard = ({
	allowedRoles = [],
	requiredMenuPath = null,
	children,
	fallbackPath = "/unauthorized",
}) => {
	const currentUser = useSelector(selectCurrentUser);
	const accessibleMenus = useSelector(selectAccessibleMenus);

	// Check role-based access
	if (
		allowedRoles.length > 0 &&
		(!currentUser || !allowedRoles.includes(currentUser.role))
	) {
		return <Navigate to={fallbackPath} replace />;
	}

	// Check menu-based access for fine-grained permissions
	if (requiredMenuPath && !accessibleMenus.includes(requiredMenuPath)) {
		return <Navigate to={fallbackPath} replace />;
	}

	return children;
};
