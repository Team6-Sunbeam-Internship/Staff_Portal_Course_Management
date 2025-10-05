package com.staff_portal.user_service.service.interfaces;

import java.util.List;

import com.staff_portal.user_service.model.MenuItem;

public interface IMenuItemService {

	MenuItem createMenuItem(MenuItem request);

	MenuItem updateMenuItem(Long id, MenuItem request);

	String deleteMenuItem(Long id);

	List<MenuItem> getAllMenuItem();
	
	List<MenuItem> searchMenuItems(String title);

}
