const SearchBox = ({ value, onChange, onSearch, onClear, onFocus, onBlur }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="search-box-container">
      <div className="input-wrapper">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyUp={handleKeyPress}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Try: 'space adventure with aliens' or '80s comedy'"
          aria-label="Movie search input"
        />
        {value && (
          <button 
            onClick={onClear} 
            className="clear-btn"
            aria-label="Clear search"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        )}
      </div>
      <button 
        onClick={onSearch} 
        className="search-btn"
        disabled={!value.trim()}
      >
        Search
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14Z" fill="white"/>
        </svg>
      </button>
    </div>
  );
};

export default SearchBox;