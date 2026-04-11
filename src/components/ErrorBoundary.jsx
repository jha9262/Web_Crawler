import React from 'react';

/**
 * React Error Boundary — catches render errors and shows a friendly fallback
 * instead of a blank white screen. Wrap any component tree you want to protect.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production, send to your error tracking service (Sentry, etc.)
    console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-inner">
            <div className="error-boundary-icon">⚠️</div>
            <h2 className="error-boundary-title">Something went wrong</h2>
            <p className="error-boundary-desc">
              An unexpected error occurred. The error has been logged and our team will look into it.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="error-boundary-stack">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              className="neo-button primary"
              onClick={this.handleReset}
              style={{ marginTop: '1.5rem' }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
