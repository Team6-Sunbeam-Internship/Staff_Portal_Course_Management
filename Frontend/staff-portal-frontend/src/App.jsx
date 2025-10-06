import AppProviders from "./providers/AppProvider";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
	return (
		<AppProviders>
			<div className='relative'>
				<AppRoutes />
			</div>
		</AppProviders>
	);
};

export default App;
