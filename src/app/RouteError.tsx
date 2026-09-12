import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";
import { isApiError } from "@/api";
import { Button, Icon } from "@/components/ui";
import { ROUTES } from "@/config/routes";

function describe(error: unknown): { title: string; detail: string } {
  if (isRouteErrorResponse(error)) {
    return {
      title: error.status === 404 ? "Halaman tidak ditemukan" : "Halaman tidak dapat dimuat",
      detail: error.statusText || "Rute yang diminta tidak tersedia.",
    };
  }

  if (isApiError(error)) {
    return {
      title: error.isNetwork ? "Tidak dapat menghubungi server" : "Permintaan gagal",
      detail: error.message,
    };
  }

  return {
    title: "Halaman mengalami kendala",
    detail: error instanceof Error ? error.message : "Terjadi kesalahan yang tidak dapat dikenali.",
  };
}

/**
 * Route-level boundary. React Router catches render and loader errors itself and
 * never lets them reach a boundary placed outside `RouterProvider`, so this is
 * the one that actually runs for page failures.
 */
export function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { title, detail } = describe(error);

  return (
    <main className="grid min-h-screen place-items-center bg-surface-base px-5 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-line-200 bg-white p-7 text-center shadow-overlay">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-danger-50 text-danger-500">
          <Icon name="error-warning-line" className="text-2xl" />
        </div>
        <h1 className="mt-4 text-lg font-bold text-ink-900">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-ink-500">{detail}</p>
        <div className="mt-5 flex justify-center gap-2">
          <Button onClick={() => navigate(ROUTES.search, { replace: true })}>
            Kembali ke pencarian
          </Button>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Muat ulang
          </Button>
        </div>
      </div>
    </main>
  );
}
