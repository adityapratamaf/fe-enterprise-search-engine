import { Badge } from "../ui";

export function StatusBadge({ active }: { active: boolean }) {
  return <Badge className={active ? "bg-[#e8fbf0] text-[#15945a]" : "bg-[#fff0f0] text-[#d33b3b]"}>{active ? "Buka 24 jam" : "Tidak aktif"}</Badge>;
}
