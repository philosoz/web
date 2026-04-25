"use client";

import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// 错误边界组件 - 捕获子组件的渲染错误
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // 调用自定义错误处理
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
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

// 异步边界组件 - 处理异步加载状态
interface AsyncBoundaryProps {
  children: ReactNode;
  loading?: ReactNode;
  errorFallback?: ReactNode;
  onRetry?: () => void;
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

  // 重试方法
  retry = () => {
    this.setState({ hasError: false, isLoading: true });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

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
              onClick={this.retry}
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

// 高阶组件包装器
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

// 错误日志钩子
export function useErrorLogging() {
  const logError = (error: Error, context?: string) => {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
    };
    
    console.error('[Error Log]', errorInfo);
    
    // 可以在这里添加错误上报逻辑
    // if (process.env.NODE_ENV === 'production') {
    //   reportError(errorInfo);
    // }
  };

  return { logError };
}