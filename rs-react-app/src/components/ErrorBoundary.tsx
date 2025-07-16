import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen gap-5 p-4 text-lg text-rose-500 bg-slate-900">
          <p>Something went wrong</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="bg-amber-600 font-medium rounded-lg text-xl px-5 py-2.5  inline-flex items-center text-black hover:bg-amber-500 duration-500 cursor-pointer justify-center"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
