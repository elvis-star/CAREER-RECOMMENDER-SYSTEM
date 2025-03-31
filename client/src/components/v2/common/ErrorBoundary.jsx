'use client';

import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <ErrorFallback
          error={this.state.error}
          resetError={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}

// Separate component for the error UI
const ErrorFallback = ({ error, resetError }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Result
        status="error"
        title="Something went wrong"
        subTitle={
          error?.message || "We're sorry, but an unexpected error occurred."
        }
        extra={[
          <Button type="primary" key="home" onClick={() => navigate('/')}>
            Go Home
          </Button>,
          <Button key="retry" onClick={resetError}>
            Try Again
          </Button>,
        ]}
      />
    </div>
  );
};

export default ErrorBoundary;
