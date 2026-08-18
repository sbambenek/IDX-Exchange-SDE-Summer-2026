import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ListingsPage from './components/ListingsPage';
import PropertyDetailPage from './components/PropertyDetailPage';
import FavoritesPage from './components/FavoritesPage';
import { FavoritesProvider, useFavorites } from './hooks/FavoritesContext';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function AppNav() {
  const { count } = useFavorites();
  return (
    <nav className="app-nav">
      <Link to="/" className="app-nav-brand"><span>IDX</span>Exchange</Link>
      <div className="app-nav-links">
        <Link to="/">Listings</Link>
        <Link to="/favorites">♡ Favorites {count > 0 && <span className="app-nav-badge">{count}</span>}</Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <FavoritesProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="App">
          <AppNav />
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<ListingsPage />} />
              <Route path="/property/:id" element={<PropertyDetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </BrowserRouter>
    </FavoritesProvider>
  );
}

export default App;