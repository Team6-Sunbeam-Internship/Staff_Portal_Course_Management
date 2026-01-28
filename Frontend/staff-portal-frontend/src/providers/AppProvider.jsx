import { Provider } from "react-redux";
import { SessionInitializer } from "../components/features";
import { store } from "../store";
import { ThemeProvider } from "./ThemeProvider";

export const AppProviders = ({ children }) => {
	return (
		<Provider store={store}>
			<ThemeProvider>
				<SessionInitializer>{children}</SessionInitializer>
			</ThemeProvider>
		</Provider>
	);
};

export default AppProviders;
