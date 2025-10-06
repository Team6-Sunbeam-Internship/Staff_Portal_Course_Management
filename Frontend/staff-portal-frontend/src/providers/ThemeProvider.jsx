import { createContext, useEffect, useState } from "react";
import { applyTheme, getStoredTheme, getSystemTheme, THEME_OPTIONS, THEME_STORAGE_KEY } from "../utils/constant/themeConstant";


const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState(() => {
		if (typeof window === "undefined") return THEME_OPTIONS.SYSTEM;
		return getStoredTheme();
	});

	const updateTheme = (newTheme) => {
		if (!Object.values(THEME_OPTIONS).includes(newTheme)) {
			console.warn(`Invalid theme option: ${newTheme}`);
			return;
		}

		setTheme(newTheme);

		try {
			localStorage.setItem(THEME_STORAGE_KEY, newTheme);
		} catch (error) {
			console.warn("Failed to save theme preference:", error);
		}
	};

	const getEffectiveTheme = () => {
		return theme === THEME_OPTIONS.SYSTEM ? getSystemTheme() : theme;
	};

	useEffect(() => {
		applyTheme(theme);
	}, [theme]);

	useEffect(() => {
		if (theme === THEME_OPTIONS.SYSTEM) {
			const mediaQuery = window.matchMedia(
				"(prefers-color-scheme: dark)"
			);

			const handleSystemThemeChange = () => {
				applyTheme(theme);
			};

			mediaQuery.addEventListener("change", handleSystemThemeChange);
			return () =>
				mediaQuery.removeEventListener(
					"change",
					handleSystemThemeChange
				);
		}
	}, [theme]);

	const contextValue = {
		theme,
		effectiveTheme: getEffectiveTheme(),
		setTheme: updateTheme,
		themes: THEME_OPTIONS,
		isSystemTheme: theme === THEME_OPTIONS.SYSTEM,
		isDarkMode: getEffectiveTheme() === THEME_OPTIONS.DARK,
	};

	return (
		<ThemeContext.Provider value={contextValue}>
			{children}
		</ThemeContext.Provider>
	);
};

export default ThemeContext;
