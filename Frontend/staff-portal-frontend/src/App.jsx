import { Toaster } from "react-hot-toast";
import AppProviders from "./providers/AppProvider";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
	return (
		<AppProviders>
			<div className='relative'>
				<AppRoutes />
			</div>
			<Toaster
				position='top-right'
				gutter={24}
				containerStyle={{
					top: 68, // 👈 push down a bit
					right: 16,
					left: "auto",
					bottom: "auto",
				}}
				toastOptions={{
					style: {
						background: "transparent", // outer wrapper stays transparent
						boxShadow: "none",
					},
				}}
			/>
		</AppProviders>
	);
};

export default App;
