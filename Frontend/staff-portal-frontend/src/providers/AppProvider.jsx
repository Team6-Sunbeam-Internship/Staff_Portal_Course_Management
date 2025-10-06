import { Provider } from "react-redux";
import { store } from "../store";
import { SessionInitializer } from "../initializer";
import { ModalProvider } from "./ModalProvider";
import { ThemeProvider } from "./ThemeProvider";

export const AppProviders = ({ children }) => {
	return (
		<Provider store={store}>
			<SessionInitializer>
				<ModalProvider>
					<ThemeProvider>{children}</ThemeProvider>
				</ModalProvider>
			</SessionInitializer>
		</Provider>
	);
};

export default AppProviders;
