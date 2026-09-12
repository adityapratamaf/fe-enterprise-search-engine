import { ROUTES, type RoutePath } from "./routes";

export type NavItem = {
  label: string;
  to: RoutePath;
  icon: string;
};

/** Single source for the desktop top bar and the mobile drawer alike. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Search", to: ROUTES.search, icon: "search-line" },
  { label: "Map", to: ROUTES.map, icon: "map-2-line" },
  { label: "Benchmark", to: ROUTES.benchmark, icon: "speed-up-line" },
  { label: "Analitik", to: ROUTES.analytics, icon: "bar-chart-grouped-line" },
  { label: "Tentang", to: ROUTES.about, icon: "information-line" },
];
