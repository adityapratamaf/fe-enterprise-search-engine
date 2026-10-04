import { BRAND_TAGLINE } from "@/config/branding";
import { APP_VERSION } from "../data";

export function TentangFooter() {
  return (
    <footer className="border-t border-line-100 px-4 py-4 sm:px-5 lg:px-7">
      <div className="mx-auto flex max-w-[1540px] flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <img
            src="/pertamina-icon.png"
            alt=""
            aria-hidden
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
          />
          <div>
            <p className="text-[12.5px] font-bold text-ink-900">
              SPBU Search <span className="font-normal text-ink-400">{APP_VERSION}</span>
            </p>
            <p className="text-[11px] text-ink-500">{BRAND_TAGLINE}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11.5px] text-ink-500">
          <span>Kebijakan Privasi</span>
          <span>Syarat dan Ketentuan</span>
        </div>
      </div>
    </footer>
  );
}
