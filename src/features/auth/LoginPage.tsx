import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isApiError } from "@/api";
import { Button, Checkbox, Icon, Input, Spinner } from "@/components/ui";
import { BRAND_LOGO } from "@/config/branding";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/contexts/AuthContext";
import {
  LOGIN_HIGHLIGHTS,
  LOGIN_NOTE,
  LOGIN_PHOTO_CAPTION,
  LOGIN_SPLASH_IMAGE,
  LOGIN_SUBTITLE,
  LOGIN_TAGLINE,
  LOGIN_WATERMARK,
} from "./data";
import type { RedirectState } from "./types";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = (location.state as RedirectState | null)?.from?.pathname ?? ROUTES.search;

  /**
   * Navigates on submit rather than reacting to `isAuthenticated`. With the app
   * unguarded, a session already exists on arrival, and a mount-time redirect
   * would bounce straight back out before the screen could be seen.
   */
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (cause) {
      setError(
        isApiError(cause) ? cause.message : "Tidak dapat masuk. Silakan coba beberapa saat lagi.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[42%_58%]">
      <div className="relative flex min-h-screen items-center overflow-hidden px-7 py-10 sm:px-14 lg:px-16">
        {/* Oversized, barely-there brand mark rather than an abstract shape —
            the same logo the header uses, just huge and faded into the ground. */}
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

          <form onSubmit={submit} className="mt-9 space-y-4" noValidate>
            {error && (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-xl bg-danger-50 px-3 py-2.5 text-sm text-danger-600"
              >
                <Icon name="error-warning-line" className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-ink-800">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                inputSize="lg"
                frameClassName="mt-1.5"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Masukkan email Anda"
                leading={<Icon name="mail-line" className="text-lg text-ink-500" />}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-ink-800">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                inputSize="lg"
                frameClassName="mt-1.5"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Masukkan password"
                leading={<Icon name="lock-line" className="text-lg text-ink-500" />}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="rounded-lg p-1 text-ink-500 hover:text-ink-700"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    <Icon name={showPassword ? "eye-off-line" : "eye-line"} className="text-lg" />
                  </button>
                }
              />
            </div>

            <label
              htmlFor="remember-me"
              className="flex items-center gap-2 text-xs font-medium text-ink-700"
            >
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Ingat saya
            </label>

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? <Spinner size="sm" label="Memproses" /> : null}
              {submitting ? "Memproses..." : "Masuk"}
              {!submitting && <Icon name="arrow-right-line" />}
            </Button>
          </form>

          <div className="mt-6 flex items-start gap-3 rounded-xl bg-surface-sunken p-4">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-brand-600">
              <Icon name="bar-chart-2-line" />
            </div>
            <p className="text-xs leading-5 text-ink-600">{LOGIN_NOTE}</p>
          </div>

          <p className="mt-10 text-xs text-ink-400">
            © {new Date().getFullYear()} PT Pertamina (Persero). All rights reserved.
          </p>
        </div>
      </div>

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
        <p className="absolute right-10 top-10 max-w-[240px] border-l border-white/60 pl-4 text-sm leading-5 text-white">
          {LOGIN_PHOTO_CAPTION.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
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
    </div>
  );
}
