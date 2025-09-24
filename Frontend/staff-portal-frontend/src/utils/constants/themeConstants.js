export const THEME_STORAGE_KEY = "staff-portal-theme";

export const THEME_OPTIONS = {
	LIGHT: "light",
	DARK: "dark",
	SYSTEM: "system",
};

export const getSystemTheme = () => {
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? THEME_OPTIONS.DARK
		: THEME_OPTIONS.LIGHT;
};

export const getStoredTheme = () => {
	try {
		return localStorage.getItem(THEME_STORAGE_KEY) || THEME_OPTIONS.SYSTEM;
	} catch {
		return THEME_OPTIONS.SYSTEM;
	}
};

export const applyTheme = (theme) => {
	const root = document.documentElement;
	const effectiveTheme =
		theme === THEME_OPTIONS.SYSTEM ? getSystemTheme() : theme;

	root.classList.remove("light", "dark");
	root.classList.add(effectiveTheme);

	// Update meta theme-color for mobile browsers
	const metaThemeColor = document.querySelector('meta[name="theme-color"]');
	if (metaThemeColor) {
		const isDark = effectiveTheme === THEME_OPTIONS.DARK;
		metaThemeColor.setAttribute("content", isDark ? "#0f172a" : "#f8fafc");
	}
};
