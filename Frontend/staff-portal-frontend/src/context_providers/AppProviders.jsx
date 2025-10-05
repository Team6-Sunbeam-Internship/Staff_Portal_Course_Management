import { Provider } from "react-redux";
import { store } from "../store";
import { ThemeProvider} from "../context_providers";
import { SessionInitializer } from "../components/features/auth";

export const AppProviders = ({ children }) => {
	return (
		<Provider store={store}>
			<ThemeProvider>
				<SessionInitializer>
					{children}
				</SessionInitializer>	
			</ThemeProvider>
		</Provider>
	);
};

export default AppProviders;
