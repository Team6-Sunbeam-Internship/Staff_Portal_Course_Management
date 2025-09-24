// import { useNavigate } from "react-router";
// import { Button, EmptyState } from "../components";

const NotFoundPage = () => {
	// const navigate = useNavigate();

	return (
		<div className='min-h-screen flex items-center justify-center'>
			{/* <EmptyState
				title='404 - Page Not Found'
				description="The page you're looking for doesn't exist or has been moved."
				actionText='Go to Dashboard'
				onAction={() => navigate("/dashboard")}
			/> */}
		</div>
	);
};

export default NotFoundPage;
