package com.staff_portal.user_service.service.implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.staff_portal.user_service.exception.DuplicateResourceException;
import com.staff_portal.user_service.exception.ResourceNotFoundException;
import com.staff_portal.user_service.model.MenuItem;
import com.staff_portal.user_service.repository.MenuItemRepository;
import com.staff_portal.user_service.service.interfaces.IMenuItemService;

@Service
public class MenuItemServiceImpl implements IMenuItemService {

	@Autowired
	MenuItemRepository menuItemRepository;
	
	@Override
	public MenuItem createMenuItem(MenuItem request)
	{
		if(menuItemRepository.existsByTitle(request.getTitle()))
		{
			throw new DuplicateResourceException("Menu Item with title '"+request.getTitle() +"' already exists");
		}
		
		MenuItem menuItem = MenuItem.builder()
				.title(request.getTitle())
				.description(request.getDescription())
				.path(request.getPath())
				.build();
		
		MenuItem saved = menuItemRepository.save(menuItem);
		
		return saved;
	}

	@Override
	public MenuItem updateMenuItem(Long id, MenuItem request) {
		
		MenuItem menuItem = menuItemRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Menu item not found with ID : "+ id));
		
		menuItem.setTitle(request.getTitle());
	    menuItem.setDescription(request.getDescription());
	    menuItem.setPath(request.getPath());
		
		MenuItem updated = menuItemRepository.save(menuItem);		
		
		return updated;	
	}

	@Override
	public String deleteMenuItem(Long id) {
		
		 if (!menuItemRepository.existsById(id)) {
	            throw new ResourceNotFoundException("MenuItem not found with ID : "+id);
	        }
		 
		menuItemRepository.deleteById(id);
		
		return "Menu item deleted successfully with ID: " + id;
	}

	@Override
	public List<MenuItem> getAllMenuItem() {
		List<MenuItem> menuItems = menuItemRepository.findAll();
		
		if(menuItems.isEmpty())
		{
			throw new ResourceNotFoundException("No menu items found");
		}
				
		return menuItems.stream()
			.map(menuItem -> MenuItem.builder()
					.menuItemId(menuItem.getMenuItemId())
					.title(menuItem.getTitle())
					.description(menuItem.getDescription())
					.path(menuItem.getPath())
					.build()
					)
			.collect(Collectors.toList());
	}
	
	@Override
    public List<MenuItem> searchMenuItems(String title) {
        List<MenuItem> results = menuItemRepository.searchByTitle(title);
        if (results.isEmpty()) {
            throw new ResourceNotFoundException("No menu items found for title: " + title);
        }
        return results;
    }
}
