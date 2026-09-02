import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <p className="text-lg font-semibold text-foreground mb-2">
              問題が発生しました
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              ページの表示中にエラーが発生しました。再読み込みをお試しください。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              再読み込み
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
