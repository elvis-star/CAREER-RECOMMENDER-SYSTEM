import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error Info:', errorInfo);

    // Optional: Send error to logging service
    this.logErrorToService(error, errorInfo);

    // Update state with detailed error information
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  logErrorToService(error, errorInfo) {
    // Implement your error logging mechanism here
    // Could be sending to a backend service, logging platform, etc.
    const errorLog = {
      message: error.toString(),
      stack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    };

    // Example: Log to console (replace with actual logging service)
    console.log('Error Log:', errorLog);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Alert
          status="error"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Something went wrong
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {this.state.error && this.state.error.toString()}
            <pre style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
              {this.state.errorInfo?.componentStack}
            </pre>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
