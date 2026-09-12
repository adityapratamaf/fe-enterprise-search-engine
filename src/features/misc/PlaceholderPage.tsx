import { Link } from "react-router-dom";
import { Card, CardBody, Icon } from "@/components/ui";
import { ROUTES } from "@/config/routes";

/**
 * Shared shell for screens that are routed but not built yet. The copy lives in
 * each page module rather than inline in the router, which the router file used
 * to carry as long single-line strings.
 */
export function PlaceholderPage({
  title,
  description,
  icon = "dashboard-3-line",
}: {
  title: string;
  description: string;
  icon?: string;
}) {
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-10">
      <Card>
        <CardBody className="py-16 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <Icon name={icon} className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-ink-500">{description}</p>
          <Link
            to={ROUTES.search}
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <Icon name="arrow-left-line" />
            Kembali ke SPBU Search
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
