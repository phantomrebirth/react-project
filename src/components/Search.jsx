import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { CiSearch } from 'react-icons/ci';
import axios from 'axios';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const Search = ({ token, role, userID, courses }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1); // Track focused item index
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimeout = useRef(null);
  const navigate = useNavigate(); // Get navigate function from useNavigate

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      if (value.length > 0) {
        try {
          const response = await axios.get('https://thankful-ample-shrimp.ngrok-free.app/search', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true',
            },
            params: { term: value },
          });
          setResults(response.data);
          console.log(response.data)
          setError('');
          setFocusedIndex(-1); // Reset focused index when results change
        } catch (error) {
          setError('No results found.');
          setResults([]);
        }
      } else {
        setResults([]);
        setError('');
      }
    }, 100); // Adjust debounce delay as needed
  };

  const clearInput = () => {
    setQuery('');
    setResults([]);
    setError('');
    setFocusedIndex(-1); // Reset focused index when clearing input
  };

  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setResults([]);
    }
  };

  const handleItemClick = (result) => {
    navigate(`/courses/${result.path}`); // Navigate to result.path using useNavigate
    setResults([]); // Clear results after navigating
  };

  const handleKeyDown = (e) => {
    if (results.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = focusedIndex < results.length - 1 ? focusedIndex + 1 : 0;
        setFocusedIndex(nextIndex);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const nextIndex = focusedIndex > 0 ? focusedIndex - 1 : results.length - 1;
        setFocusedIndex(nextIndex);
      } else if (e.key === 'Enter' && focusedIndex !== -1) {
        handleItemClick(results[focusedIndex]);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        clearInput();
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={`searchBar-container ${results.length > 0 ? 'dropdown-search-open' : ''}`} ref={searchRef}>
      <div className="searchIcon-container">
        <CiSearch className="search-icon" />
      </div>
      <div className="search-container">
        <input
          ref={inputRef}
          className={`search ${results.length > 0 ? 'dropdown-search-open' : ''}`}
          type="text"
          placeholder="Search"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <div className="clearIcon-container" onClick={clearInput}>
            <AiOutlineClose className="clear-icon" />
          </div>
        )}
        {results.length > 0 && (
          <div className="dropdown-search">
            {results.map((result, index) => (
              <div
                key={index}
                className={`dropdown-itemSearch ${index === focusedIndex ? 'focused' : ''}`}
                onClick={() => handleItemClick(result)}
              >
                {result.name}
              </div>
            ))}
          </div>
        )}
        {results.length === 0 && error && (
          <div className="dropdown-search">
            <div className="dropdown-itemSearch error-message">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
  role: state.auth.role,
  userID: state.auth.userID,
  courses: state.courses.coursesData,
});

export default connect(mapStateToProps)(Search);