import { Navigate } from "react-router";
import { useSelector } from "react-redux";
import {
	selectIsAuthenticated,
	selectIsInitializing,
} from "../store/selectors";
import { LoadingSpinner } from "../components/common";

export const ProtectedRoutes = ({ children }) => {
	const isAuthenticated = useSelector(selectIsAuthenticated);
	const isInitializing = useSelector(selectIsInitializing);

	if (isInitializing) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	return children;
};
