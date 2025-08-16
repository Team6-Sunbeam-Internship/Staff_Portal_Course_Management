package com.staff_portal.user_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.staff_portal.user_service.model.MenuItem;
import com.staff_portal.user_service.service.interfaces.IMenuItemService;

@RestController
@RequestMapping("/api/menu-items")
public class MenuItemController {

	@Autowired
	IMenuItemService menuItemService;
	
	@PostMapping("/createMenuItem")
	public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem request)
	{
		return ResponseEntity.ok(menuItemService.createMenuItem(request));
	}
	
	@PutMapping("/updateMenuItem/{id}")
	public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem request)
	{
		return ResponseEntity.ok(menuItemService.updateMenuItem(id,request));
	}
	
	@DeleteMapping("/deleteMenuItem/{id}")
	public ResponseEntity<String> deleteMenuItem(@PathVariable Long id)
	{
		return ResponseEntity.ok(menuItemService.deleteMenuItem(id));
	}
	
	@GetMapping
	public ResponseEntity<List<MenuItem>> getAllMenuItem()
	{
		List<MenuItem> menuItemDTO = menuItemService.getAllMenuItem();
		
		return ResponseEntity.ok(menuItemDTO);
	}
	
}
