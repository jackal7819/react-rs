'use client';

import ErrorBoundary from './ErrorBoundry';

interface ErrorBoundaryWrapperProps {
	children: React.ReactNode;
}

export default function ErrorBoundaryWrapper({ children }: ErrorBoundaryWrapperProps) {
	return <ErrorBoundary>{children}</ErrorBoundary>;
}
