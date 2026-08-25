import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import { useFavorites } from '../hooks/FavoritesContext';
import { fetchPropertyDetail } from '../api/client';
import './ListingsPage.css';

function FavoritesPage() {
  const { favorites } = useFavorites();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFavoriteProperties() {
      if (favorites.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const results = await Promise.all(
          favorites.map((id) => fetchPropertyDetail(id).catch(() => null))
        );
        if (isMounted) {
          setProperties(results.filter((p) => p !== null));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadFavoriteProperties();

    return () => {
      isMounted = false;
    };
  }, [favorites]);

  return (
    <div className="listings-page">
      <h1 className="listings-title">Your Favorites</h1>

      {loading && <div className="listings-status">Loading favorites...</div>}

      {!loading && error && (
        <div className="listings-status listings-error">Error: {error}</div>
      )}

      {!loading && !error && (
        <>
          <p className="listings-count">
            {properties.length} favorite{properties.length === 1 ? '' : 's'}
          </p>
          {properties.length === 0 ? (
            <div className="listings-status">
              No favorites yet. Click the heart on any property to save it here.
            </div>
          ) : (
            <div className="listings-grid">
              {properties.map((property) => (
                <PropertyCard key={property.L_ListingID} property={property} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FavoritesPage;