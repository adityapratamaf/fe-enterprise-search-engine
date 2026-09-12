import { describe, expect, it } from "vitest";
import { hasPermission } from "./utils";
import type { ModulePermission } from "@/api";

const MODULES: ModulePermission[] = [
  { moduleId: "search", moduleName: "Pencarian", modulePath: "/", actions: ["view", "execute"] },
];

describe("hasPermission", () => {
  it("grants a module/action pair that was granted", () => {
    expect(hasPermission(MODULES, "search", "view")).toBe(true);
  });

  it("matches case-insensitively, like the backend's PermissionHandler", () => {
    expect(hasPermission(MODULES, "SEARCH", "View")).toBe(true);
  });

  it("denies an action that was not granted", () => {
    expect(hasPermission(MODULES, "search", "delete")).toBe(false);
  });

  it("denies an unknown module", () => {
    expect(hasPermission(MODULES, "users", "view")).toBe(false);
  });

  it("denies everything when the session carries no grants", () => {
    expect(hasPermission([], "search", "view")).toBe(false);
  });
});
