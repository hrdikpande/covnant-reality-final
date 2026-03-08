"use client";

import React, { Component, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Global error boundary — catches any unhandled render error in the React tree
 * and shows a recovery UI instead of a blank white screen.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        textAlign: "center",
                        background: "#f8fafc",
                        color: "#1e293b",
                    }}
                >
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: "#64748b", marginBottom: "1.5rem", maxWidth: "28rem" }}>
                        We encountered an unexpected error. Please try reloading the page.
                    </p>
                    <button
                        onClick={this.handleReload}
                        style={{
                            padding: "0.75rem 2rem",
                            background: "#4f46e5",
                            color: "#fff",
                            border: "none",
                            borderRadius: "0.75rem",
                            fontSize: "1rem",
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                    >
                        Reload Page
                    </button>
                    {process.env.NODE_ENV === "development" && this.state.error && (
                        <pre
                            style={{
                                marginTop: "2rem",
                                padding: "1rem",
                                background: "#1e293b",
                                color: "#f8d7da",
                                borderRadius: "0.5rem",
                                fontSize: "0.75rem",
                                maxWidth: "90vw",
                                overflow: "auto",
                                textAlign: "left",
                            }}
                        >
                            {this.state.error.message}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
