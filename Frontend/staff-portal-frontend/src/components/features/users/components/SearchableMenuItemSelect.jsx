import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import {
  getAllMenuItems,
  searchMenuItems,
} from "../../../../services/api/MenuItemService";
import { toast } from "react-toastify";

const SearchableMenuItemSelect = ({
  onChange,
  placeholder = "Search and select menu item...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (searchTerm.length >= 2) {
      timeoutRef.current = setTimeout(() => {
        handleSearch(searchTerm);
      }, 300);
    } else {
      setSearchResults([]);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [searchTerm]);

  const handleSearch = async (term) => {
    const trimmed = term.trim();
    if (!trimmed || trimmed.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      setLoading(true);
      const results = await searchMenuItems(trimmed);
      setSearchResults(results || []);
    } catch (error) {
      if (error?.response?.status === 404) {
        toast.info(error.response.data);
        setSearchResults([]);
      } else {
        toast.error("Failed to search menu items");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setSearchTerm(item.title);
    onChange(item.menuItemId);
    setIsOpen(false);
    setSearchResults([]);
  };

  const clearSelection = () => {
    setSelectedItem(null);
    setSearchTerm("");
    onChange("");
    setSearchResults([]);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (searchTerm.length >= 2) {
      handleSearch(searchTerm);
    } else if (!searchTerm) {
      preloadMenuItems();
    }
  };

  const preloadMenuItems = async () => {
    try {
      setLoading(true);
      const items = await getAllMenuItems();
      setSearchResults(items);
    } catch (err) {
      toast.error("Failed to load menu items");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      <div className="input-group">
        <span className="input-group-text">
          <FaSearch />
        </span>
        <input
          ref={inputRef}
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          autoComplete="off"
        />
        {selectedItem && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={clearSelection}
            title="Clear selection"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className="position-absolute w-100 bg-white border rounded shadow-lg mt-1"
          style={{ zIndex: 1050, maxHeight: "250px", overflowY: "auto" }}
        >
          {loading ? (
            <div className="p-3 text-center">
              <div
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></div>
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="list-group list-group-flush">
              {searchResults.map((item) => (
                <button
                  key={item.menuItemId}
                  type="button"
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  onClick={() => handleItemSelect(item)}
                >
                  <div>
                    <div className="fw-medium">{item.title}</div>
                    <small className="text-muted">{item.path}</small>
                  </div>
                  <FaPlus className="text-primary" />
                </button>
              ))}
            </div>
          ) : searchTerm.length >= 2 ? (
            <div className="p-3 text-center text-muted">
              No menu items found
            </div>
          ) : (
            <div className="p-3 text-center text-muted">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      )}

      {selectedItem && (
        <div className="mt-2 p-2 bg-light rounded border">
          <small className="text-muted">Selected:</small>
          <div className="fw-medium">{selectedItem.title}</div>
          <small className="text-muted">{selectedItem.path}</small>
        </div>
      )}
    </div>
  );
};

export default SearchableMenuItemSelect;
