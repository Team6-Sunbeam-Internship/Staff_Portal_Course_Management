import React from "react";
import { Route, Routes } from "react-router";
import {
	BatchCycleList,
	InfrastructureList,
	PremisesList,
} from "../../components/features";

const InfrastructureManagementPage = () => {
	return (
		<Routes>
			{/* Path: /infrastructure-management/batch-cycles */}
			<Route path='batch-cycles' element={<BatchCycleList />} />
			{/* Path: /infrastructure-management/premises */}
			<Route path='premises' element={<PremisesList />} />
			{/* Path: /infrastructure-management/infrastructure */}
			<Route path='infrastructure' element={<InfrastructureList />} />
		</Routes>
	);
};

export default InfrastructureManagementPage;
