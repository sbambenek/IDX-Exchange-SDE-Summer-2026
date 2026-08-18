import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We hit an unexpected error while loading this page.</p>
          <div className="error-boundary-actions">
            <button onClick={this.handleReset}>Try Again</button>
            <a href="/">Back to Listings</a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;