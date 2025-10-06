import { SidebarMenuItem, SidebarDropdown } from "../sidebar";

export const SidebarMenu = ({
	items = [],
	currentPath,
	isCollapsed,
	expandedGroups,
	onToggleGroup,
	className = "",
	level,
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
							level={level}
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
						expandedGroups={expandedGroups}
						onToggleGroup={onToggleGroup}
						level={level}
					/>
				);
			})}
		</div>
	);
};
