import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AgriCart Error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border-2 border-rose-300 shadow-xl text-center space-y-4">
            <span className="text-5xl block">🌾⚠️</span>
            <h2 className="text-xl font-black text-slate-900">Something went wrong</h2>
            <p className="text-sm font-semibold text-slate-600">
              The application encountered an issue while loading.
            </p>
            <div className="bg-slate-50 p-3 rounded-xl text-left border border-slate-200 text-xs font-mono text-rose-800 break-words max-h-40 overflow-y-auto">
              {this.state.error?.message || 'Unknown error occurred'}
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full h-14 bg-green-700 hover:bg-green-800 text-white font-black text-base rounded-2xl shadow-lg border-2 border-green-950 transition-all active:scale-95"
            >
              🔄 Reload AgriCart
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
