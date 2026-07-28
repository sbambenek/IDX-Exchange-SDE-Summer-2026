import React, { useState } from 'react';
import './PropertyFilters.css';

const EMPTY_FILTERS = {
  city: '',
  zipcode: '',
  minPrice: '',
  maxPrice: '',
  beds: '',
  baths: ''
};

function PropertyFilters({ onSearch, onClear }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Remove empty values before sending to the API
    const cleanedFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '') {
        cleanedFilters[key] = value;
      }
    });

    onSearch(cleanedFilters);
  }

  function handleClear() {
    setFilters(EMPTY_FILTERS);
    onClear();
  }

  return (
    <form className="property-filters" onSubmit={handleSubmit}>
      <input
        type="text"
        name="city"
        placeholder="City"
        value={filters.city}
        onChange={handleChange}
      />
      <input
        type="text"
        name="zipcode"
        placeholder="ZIP code"
        value={filters.zipcode}
        onChange={handleChange}
      />
      <input
        type="number"
        name="minPrice"
        placeholder="Min price"
        value={filters.minPrice}
        onChange={handleChange}
      />
      <input
        type="number"
        name="maxPrice"
        placeholder="Max price"
        value={filters.maxPrice}
        onChange={handleChange}
      />
      <select name="beds" value={filters.beds} onChange={handleChange}>
        <option value="">Beds (any)</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
        <option value="5">5+</option>
      </select>
      <select name="baths" value={filters.baths} onChange={handleChange}>
        <option value="">Baths (any)</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
      </select>
      <div className="property-filters-buttons">
        <button type="submit">Search</button>
        <button type="button" onClick={handleClear}>
          Clear Filters
        </button>
      </div>
    </form>
  );
}

export default PropertyFilters;