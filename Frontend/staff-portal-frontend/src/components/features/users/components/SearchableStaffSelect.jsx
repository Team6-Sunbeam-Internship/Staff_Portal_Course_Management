import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { searchStaffByName } from "../../../../services/api/StaffMenuAccess";
import { toast } from "react-toastify";

const SearchableStaffSelect = ({
  onChange,
  placeholder = "Search and select staff...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (searchTerm.length >= 2) {
      timeoutRef.current = setTimeout(() => {
        handleSearch(searchTerm);
      }, 300);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleSearch = async (searchValue) => {
    const trimmed = searchValue.trim();
    if (!trimmed || trimmed.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const results = await searchStaffByName(trimmed);
      setSearchResults(results || []);
    } catch (error) {
      console.error("Staff search failed:", error);

      setSearchResults([]);

      if (error?.response?.status === 500) {
        toast.error("Server error occurred. Please try a simpler search term.");
        setSearchTerm("");
        setIsOpen(false);
      } else if (error?.response?.status === 404) {
        console.log("404 - No staff found for:", trimmed);
      } else if (error?.response?.status === 400) {
        toast.error("Invalid search input");
      } else if (error?.code === "NETWORK_ERROR" || !error?.response) {
        toast.error("Network error - please check your connection");
      } else {
        console.log("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
  };

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff);
    setSearchTerm(`${staff.firstName} ${staff.lastName}`);
    onChange(staff.staffId);
    setIsOpen(false);
    setSearchResults([]);
  };

  const clearSelection = () => {
    setSelectedStaff(null);
    setSearchTerm("");
    onChange("");
    setSearchResults([]);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (searchTerm.length >= 2) {
      handleSearch(searchTerm);
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
        {selectedStaff && (
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
          style={{
            zIndex: 1050,
            maxHeight: "250px",
            overflowY: "auto",
          }}
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
              {searchResults.map((staff) => (
                <button
                  key={staff.staffId}
                  type="button"
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  onClick={() => handleStaffSelect(staff)}
                >
                  <div>
                    <div className="fw-medium">
                      {staff.firstName} {staff.lastName}
                    </div>
                    <small className="text-muted">
                      {staff.designation} • {staff.email}
                    </small>
                  </div>
                  <FaPlus className="text-primary" />
                </button>
              ))}
            </div>
          ) : searchTerm.length >= 2 ? (
            <div className="p-3 text-center text-muted">
              No staff found for "{searchTerm}"
            </div>
          ) : (
            <div className="p-3 text-center text-muted">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      )}

      {selectedStaff && (
        <div className="mt-2 p-2 bg-light rounded border">
          <small className="text-muted">Selected:</small>
          <div className="fw-medium">
            {selectedStaff.firstName} {selectedStaff.lastName}
          </div>
          <small className="text-muted">
            {selectedStaff.designation} • {selectedStaff.email}
          </small>
        </div>
      )}
    </div>
  );
};

export default SearchableStaffSelect;
