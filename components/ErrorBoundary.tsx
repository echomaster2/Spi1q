import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  isDarkMode?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-6 ${this.props.isDarkMode ? 'bg-stealth-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="w-24 h-24 bg-registry-rose/10 rounded-[2.5rem] flex items-center justify-center mx-auto animate-pulse">
              <AlertTriangle className="w-12 h-12 text-registry-rose" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">Neural Interface Failure</h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                The system encountered a critical synchronization error. Diagnostic data has been logged.
              </p>
              
              <div className={`p-4 rounded-2xl border text-left overflow-auto max-h-40 ${this.props.isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                <code className="text-[11px] font-mono text-registry-rose break-all">
                  {this.state.error?.toString()}
                </code>
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-registry-teal text-stealth-950 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-registry-teal/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-3"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Re-Initialize Core</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
