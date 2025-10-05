import { useEffect } from "react";
import { useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { updateLastActivity } from "../store/slices/authSlice";
import { generateFromPath } from "../store/slices/breadcrumbSlice";
// import { ROUTE_MAPPINGS } from "../utils/constants/routeConstants";

export const RouteGuard = ({ children }) => {
	const location = useLocation();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(updateLastActivity());
		dispatch(
			generateFromPath({
				pathname: location.pathname,
				// mappings: ROUTE_MAPPINGS,
			})
		);
	}, [location.pathname, dispatch]);

	return children;
};
