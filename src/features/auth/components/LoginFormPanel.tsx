import { BRAND_LOGO } from "@/config/branding";
import { LOGIN_SUBTITLE, LOGIN_TAGLINE, LOGIN_WATERMARK } from "../data";
import { LoginForm } from "./LoginForm";
import { LoginInfoNote } from "./LoginInfoNote";

type Props = {
  email: string;
  password: string;
  showPassword: boolean;
  error: string | null;
  submitting: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (event: React.FormEvent) => void;
};

/** The left half of the login screen: branding, the form, and the footer. The
 * watermark logo replaces what used to be an abstract decorative shape. */
export function LoginFormPanel(props: Props) {
  return (
    <div className="relative flex min-h-screen items-center overflow-hidden px-7 py-10 sm:px-14 lg:px-16">
      <img
        src={LOGIN_WATERMARK}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-20 w-96 opacity-[0.05]"
      />
      <img
        src={LOGIN_WATERMARK}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-20 w-72 opacity-[0.04]"
      />

      <div className="relative mx-auto w-full max-w-[460px]">
        <img
          src={BRAND_LOGO}
          alt="Pertamina"
          width={190}
          height={48}
          className="mb-16 h-12 w-[190px] object-contain object-left"
        />
        <div
          className="mb-3 h-1 w-28 bg-gradient-to-r from-red-500 via-blue-500 to-green-500"
          aria-hidden
        />
        <h1 className="text-4xl font-bold leading-tight text-ink-900">{LOGIN_TAGLINE}</h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-ink-500">{LOGIN_SUBTITLE}</p>

        <LoginForm {...props} />
        <LoginInfoNote />

        <p className="mt-10 text-xs text-ink-400">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </div>
  );
}
