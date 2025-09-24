import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "../../common";
import { useTheme } from "../../../hooks";

export const ThemeToggle = ({ className = "" }) => {
	const { theme, setTheme, themes } = useTheme();

	const cycleTheme = () => {
		const themeOrder = [themes.LIGHT, themes.DARK, themes.SYSTEM];
		const currentIndex = themeOrder.indexOf(theme);
		const nextIndex = (currentIndex + 1) % themeOrder.length;
		setTheme(themeOrder[nextIndex]);
	};

	const getThemeIcon = () => {
		switch (theme) {
			case themes.LIGHT:
				return <Sun className='w-5 h-5' />;
			case themes.DARK:
				return <Moon className='w-5 h-5' />;
			case themes.SYSTEM:
				return <Monitor className='w-5 h-5' />;
			default:
				return <Sun className='w-5 h-5' />;
		}
	};

	const getThemeLabel = () => {
		switch (theme) {
			case themes.LIGHT:
				return "Light mode";
			case themes.DARK:
				return "Dark mode";
			case themes.SYSTEM:
				return "System mode";
			default:
				return "Light mode";
		}
	};

	return (
		<Button
			variant='ghost'
			size='sm'
			onClick={cycleTheme}
			className={className}
			title={getThemeLabel()}
			aria-label={`Current theme: ${getThemeLabel()}. Click to cycle themes.`}
		>
			{getThemeIcon()}
		</Button>
	);
};