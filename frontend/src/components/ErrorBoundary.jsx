import React from 'react';

class ErrorBoundary extends React.Component {
  // 1. Initialize state
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // 2. Update state when error is caught
  static getDerivedStateFromError(error) {
    return { hasError: true }; // Triggers re-render with fallback UI
  }

  // 3. Log error information
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by Error Boundary:", error, errorInfo);
    // Can also send to error tracking service here
  }

  // 4. Render either fallback UI or children
  render() {
    if (this.state.hasError) {
      // Fallback UI when error occurs
      return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Something went wrong
          </h2>
          <button 
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    // Normal children when no error
    return this.props.children; 
  }
}

export default ErrorBoundary;