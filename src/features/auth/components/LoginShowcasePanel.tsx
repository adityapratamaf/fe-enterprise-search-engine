import { Icon } from "@/components/ui";
import { LOGIN_HIGHLIGHTS, LOGIN_SPLASH_IMAGE } from "../data";

/** The photo half of the login screen, hidden below `lg` like the old layout. */
export function LoginShowcasePanel() {
  return (
    <div className="relative hidden min-h-screen overflow-hidden lg:block">
      <img
        src={LOGIN_SPLASH_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-surface-inverse/85 via-surface-inverse/10 to-transparent"
        aria-hidden
      />
      <ul className="absolute bottom-10 left-10 right-10 grid grid-cols-3 gap-5 text-white">
        {LOGIN_HIGHLIGHTS.map((item) => (
          <li key={item.title}>
            <Icon name={item.icon} className="text-2xl" />
            <p className="mt-2 text-sm font-bold">{item.title}</p>
            <p className="mt-1 text-[11px] text-white/75">{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
