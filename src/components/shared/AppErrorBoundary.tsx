import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; message: string };

/**
 * Catches failures that happen outside the router — router initialisation, or a
 * crash in the provider tree itself. Page-level errors are caught by
 * `RouteError`, which React Router reaches first.
 *
 * Intentionally dependency-free: it must still render when the app around it
 * could not start.
 */
export class AppErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : "Terjadi kesalahan pada aplikasi.",
    };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error("UI error", error, info);
  }

  override render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="grid min-h-screen place-items-center bg-surface-base px-5 py-10">
        <div className="w-full max-w-lg rounded-2xl border border-line-200 bg-white p-7 text-center shadow-overlay">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-danger-50 text-danger-500">
            <i className="ri-error-warning-line text-2xl" aria-hidden />
          </div>
          <h1 className="mt-4 text-lg font-bold text-ink-900">Aplikasi gagal dimuat</h1>
          <p className="mt-2 text-sm leading-6 text-ink-500">
            Silakan muat ulang halaman untuk mencoba lagi.
          </p>
          {import.meta.env.DEV && (
            <p className="mt-3 rounded-lg bg-surface-sunken p-3 text-left text-xs text-ink-500">
              {this.state.message}
            </p>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Muat ulang
          </button>
        </div>
      </main>
    );
  }
}
