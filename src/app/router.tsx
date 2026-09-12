import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { SearchPage } from "../pages/search/SearchPage";
import { PlaceholderPage } from "../pages/PlaceholderPage";
import { LoginPage } from "../pages/login/LoginPage";
import { ROUTES } from "../config/routes";

export const router = createBrowserRouter([
  { path: ROUTES.login, element: <LoginPage /> },
  {
    element: <MainLayout><SearchPage /></MainLayout>,
    path: ROUTES.search,
  },
  {
    element: <MainLayout><PlaceholderPage title="Peta SPBU" description="Halaman peta siap dikembangkan dengan Leaflet, clustering, radius search, dan layer lokasi." /></MainLayout>,
    path: ROUTES.map,
  },
  {
    element: <MainLayout><PlaceholderPage title="Benchmark" description="Ruang perbandingan Elasticsearch vs SQL: latency, throughput, hasil pencarian, min/median/p95, dan dataset." /></MainLayout>,
    path: ROUTES.benchmark,
  },
  {
    element: <MainLayout><PlaceholderPage title="Analitik" description="Halaman analitik untuk pertanyaan bisnis, agregasi, tren, dan breakdown data SPBU." /></MainLayout>,
    path: ROUTES.analytics,
  },
  {
    element: <MainLayout><PlaceholderPage title="Tentang" description="Informasi platform Enterprise Search dan kemampuan pencarian SPBU." /></MainLayout>,
    path: ROUTES.about,
  },
  { path: "*", element: <Navigate to={ROUTES.search} replace /> },
]);
