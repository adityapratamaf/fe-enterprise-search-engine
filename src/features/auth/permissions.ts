import type { ModulePermission } from "@/api";

/**
 * Mirrors the backend's `PermissionHandler`: a grant is a `{module}.{action}`
 * pair matched case-insensitively, and there is no superuser bypass — `role`
 * and `isSuperUser` grant nothing on their own.
 */
export function hasPermission(
  modules: ModulePermission[],
  module: string,
  action: string,
): boolean {
  const wantedModule = module.toLowerCase();
  const wantedAction = action.toLowerCase();

  return modules.some(
    (entry) =>
      entry.moduleId.toLowerCase() === wantedModule &&
      entry.actions.some((granted) => granted.toLowerCase() === wantedAction),
  );
}

/** Permission codes this frontend actually depends on. */
export const PERMISSIONS = {
  searchView: { module: "search", action: "view" },
  searchExecute: { module: "search", action: "execute" },
} as const;
