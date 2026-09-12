import { Badge } from "@/components/ui";
import { humanizeEnum } from "@/utils/format";

/**
 * Renders the backend's `status` string as-is rather than inventing copy: the
 * old version hardcoded "Buka 24 jam" for every active station.
 */
export function StatusBadge({ status }: { status: string }) {
  const normalized = status.trim().toLowerCase();
  const isActive = normalized === "aktif" || normalized === "active";

  return (
    <Badge tone={isActive ? "success" : "danger"}>
      {status ? humanizeEnum(status) : "Tidak diketahui"}
    </Badge>
  );
}
