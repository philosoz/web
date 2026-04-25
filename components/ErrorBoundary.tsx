"use client";

import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">😕</div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              出错了
            </h2>
            <p className="text-gray-600 mb-6">
              抱歉，页面加载时遇到了问题
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface AsyncBoundaryProps {
  children: ReactNode;
  loading?: ReactNode;
  errorFallback?: ReactNode;
}

interface AsyncBoundaryState {
  hasError: boolean;
  isLoading: boolean;
}

export class AsyncBoundary extends Component<AsyncBoundaryProps, AsyncBoundaryState> {
  state: AsyncBoundaryState = { hasError: false, isLoading: true };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.errorFallback || (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">😕</div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              加载失败
            </h2>
            <p className="text-gray-600 mb-6">
              抱歉，数据加载时遇到了问题
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      );
    }

    if (this.state.isLoading) {
      return this.props.loading || (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      );
    }

    return this.props.children;
  }
}

export function withAsyncBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  loading?: ReactNode,
  errorFallback?: ReactNode
) {
  return function WithAsyncBoundary(props: P) {
    return (
      <AsyncBoundary loading={loading} errorFallback={errorFallback}>
        <WrappedComponent {...props} />
      </AsyncBoundary>
    );
  };
}