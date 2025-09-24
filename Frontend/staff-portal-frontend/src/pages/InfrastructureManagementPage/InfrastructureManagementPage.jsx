import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router";
import { setBreadcrumbs } from "../../store";
import {
	BatchCycleList,
	InfrastructureList,
	PremiseList,
} from "../../components";

const InfrastructureManagementPage = () => {
	const dispath = useDispatch();
	const location = useLocation();

	useEffect(() => {
		if (location.pathname === "/infrastructure-management") {
			dispath(
				setBreadcrumbs([
					{ title: "Home", path: "/dashboard", icon: "home" },
					{
						label: "Infrastructure Management",
						path: "/infrastructure-management",
						icon: "building-office",
					},
				])
			);
		}
	}, [dispath, location.pathname]);

	return (
		<Routes>
			<Route path='infrastructure' element={<InfrastructureList />} />
			<Route path='premises' element={<PremiseList />} />
			<Route path='batch-cycles' element={<BatchCycleList />} />
		</Routes>
	);
};

export default InfrastructureManagementPage;
