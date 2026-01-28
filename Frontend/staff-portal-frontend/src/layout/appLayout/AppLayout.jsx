import { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router";
import { Header } from "../header";
import { Footer } from "../footer";
import { MainContent } from "../mainContent";
import { Sidebar } from "../../components/features";
import { useFilteredMenu } from "../../hooks";
import { ModalProvider } from "../../providers";

const AppLayout = () => {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	const { filteredMenu } = useFilteredMenu();
	const memoizedMenu = useMemo(() => filteredMenu, [filteredMenu]);
	useEffect(() => {
		const handleResize = () => {
			const innerWidth = window.innerWidth;
			const isMobileScreen = innerWidth < 1024;
			setIsMobile(isMobileScreen);
			if (isMobileScreen) {
				setIsSidebarCollapsed(true);
				setIsMobileMenuOpen(false);
			} else {
				setIsSidebarCollapsed(false);
				setIsMobileMenuOpen(false);
			}
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// Toggle sidebar collapse state
	const handleToggleSidebar = () => {
		if (isMobile) {
			setIsMobileMenuOpen(!isMobileMenuOpen);
		} else {
			// On desktop, just toggle collapsed state
			setIsSidebarCollapsed(!isSidebarCollapsed);
		}
	};
	console.log("window.innerWidth: ", window.innerWidth);
	// Close mobile menu (called from backdrop click)
	const handleCloseMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	// Open mobile menu (called from header menu button)
	const handleOpenMobileMenu = () => {
		setIsMobileMenuOpen(true);
	};
	// const getMainContentMargin = () => {
	// 	if (isMobile) {
	// 		return "";
	// 	}
	// 	return isSidebarCollapsed ? "lg:ml-[88px]" : "lg:ml-[280px]";
	// };

	// const getMainContentLength = () => {
	// 	if (isMobile) return "";
	// 	return isSidebarCollapsed ? "md:ml-16":""
	// };

	return (
		<div className='flex h-screen overflow-hidden md:flex-row'>
			{/* Sidebar */}
			<Sidebar
				filteredMenu={memoizedMenu}
				isCollapsed={isSidebarCollapsed}
				isMobileMenuOpen={isMobileMenuOpen}
				isMobile={isMobile}
				onToggleSidebar={handleToggleSidebar}
				onCloseMobileMenu={handleCloseMobileMenu}
			/>

			{/* Main Content Area */}

			<div className={`z-10 flex flex-1 flex-col transition-all duration-300`}>
				{/* Header */}
				<Header onSidebarToggle={handleOpenMobileMenu} isMobile={isMobile} />

				{/* <Profile /> */}
				{/* Main Content */}
				<ModalProvider>
					<MainContent className='scrollbar-none'>
						<Outlet />
					</MainContent>
					{/* Footer */}
				</ModalProvider>
				<Footer />
			</div>
		</div>
	);
};

export default AppLayout;
