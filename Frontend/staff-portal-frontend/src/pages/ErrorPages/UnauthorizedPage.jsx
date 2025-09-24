import { useNavigate } from "react-router";
import { Button, EmptyState } from "../../components";

const UnauthorizedPage = () => {
	const navigate = useNavigate();

	return (
		<div className='min-h-screen flex items-center justify-center'>
			<EmptyState
				title='Access Denied'
				description="You don't have permission to access this resource. Please contact your administrator if you believe this is an error."
				actionText='Go to Dashboard'
				onAction={() => navigate("/dashboard")}
			/>
		</div>
	);
};

export default UnauthorizedPage;
