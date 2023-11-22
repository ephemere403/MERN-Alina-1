import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {Col} from "react-bootstrap";

function ErrorFallback({ error }) {
    return (
        <Col role="alert" className="error-field">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
        </Col>
    );
}

export function GlobalErrorBoundary({ children }) {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error, info) => {
                // log
            }}
        >
            {children}
        </ErrorBoundary>
    );
}
