import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isApiError } from "@/api";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/contexts/AuthContext";
import { LoginFormPanel } from "./components/LoginFormPanel";
import { LoginShowcasePanel } from "./components/LoginShowcasePanel";
import type { RedirectState } from "./types";

/**
 * Orchestration only, the same split every other page in this app uses: form
 * state and the submit handler live here, the two halves of the screen render
 * from them.
 */
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      <LoginFormPanel
        email={email}
        password={password}
        showPassword={showPassword}
        error={error}
        submitting={submitting}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onTogglePassword={() => setShowPassword((value) => !value)}
        onSubmit={submit}
      />
      <LoginShowcasePanel />
    </div>
  );
}
