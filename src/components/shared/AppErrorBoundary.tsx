import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : "Terjadi kesalahan pada aplikasi." };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error("UI error", error, info);
  }

  handleReload = () => window.location.reload();

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7fbff] px-5 py-10">
        <section className="w-full max-w-lg rounded-2xl border border-[#dfe9f5] bg-white p-7 text-center shadow-[0_16px_50px_rgba(24,58,100,.09)]">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#fff1f1] text-[#d92d20]"><i className="ri-error-warning-line text-2xl" /></div>
          <h1 className="mt-4 text-lg font-bold text-[#12294d]">Halaman mengalami kendala</h1>
          <p className="mt-2 text-sm leading-6 text-[#657d9d]">Aplikasi tetap aman dijalankan. Silakan muat ulang halaman untuk mencoba lagi.</p>
          {import.meta.env.DEV && <p className="mt-3 rounded-lg bg-[#f7f9fc] p-3 text-left text-xs text-[#7b8da6]">{this.state.message}</p>}
          <button type="button" onClick={this.handleReload} className="mt-5 rounded-xl bg-[#1268ee] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0758d4]">Muat ulang</button>
        </section>
      </main>
    );
  }
}
