import { Component, ErrorInfo, ReactNode } from "react";
import { Typography } from '@mui/material';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Typography variant="h5" gutterBottom component="div">
          Something went wrong. Is your config.js file correct?
        </Typography>
      );

    }
    return this.props.children;
  }
}

export default ErrorBoundary;
