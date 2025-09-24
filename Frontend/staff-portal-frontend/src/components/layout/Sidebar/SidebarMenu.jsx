import { SidebarMenuItem, SidebarDropdown } from "../Sidebar";

export const SidebarMenu = ({
	items = [],
	currentPath,
	isCollapsed,
	expandedGroups,
	onToggleGroup,
	className = "",
	...props
}) => {
	return (
		<div className={`space-y-1 px-3 ${className}`} {...props}>
			{items.map((item) => {
				if (item.single) {
					return (
						<SidebarMenuItem
							key={item.key}
							item={item}
							currentPath={currentPath}
							isCollapsed={isCollapsed}
						/>
					);
				}

				return (
					<SidebarDropdown
						key={item.key}
						item={item}
						currentPath={currentPath}
						isCollapsed={isCollapsed}
						isExpanded={expandedGroups.has(item.key)}
						onToggle={() => onToggleGroup(item.key)}
					/>
				);
			})}
		</div>
	);
};

