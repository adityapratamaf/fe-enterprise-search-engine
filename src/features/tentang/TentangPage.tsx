import { TentangCoverage } from "./components/TentangCoverage";
import { TentangFeatureList } from "./components/TentangFeatureList";
import { TentangFooter } from "./components/TentangFooter";
import { TentangHero } from "./components/TentangHero";
import { TentangPillars } from "./components/TentangPillars";
import { TentangTechStack } from "./components/TentangTechStack";

/**
 * Orchestration only, same as every other feature page: a hero, then the
 * content grid, then the footer.
 */
export function TentangPage() {
  return (
    <div className="min-h-[calc(100vh-58px)]">
      <TentangHero />

      <div className="mx-auto max-w-[1540px] px-4 py-5 sm:px-5 lg:px-7">
        <TentangPillars />

        <div className="mt-5 grid grid-cols-1 gap-3.5 lg:grid-cols-[1fr_1fr_360px]">
          <TentangFeatureList />
          <TentangTechStack />
          <TentangCoverage />
        </div>
      </div>

      <TentangFooter />
    </div>
  );
}
