import { Button, Icon, Input, Spinner } from "@/components/ui";

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

/** The credentials form itself — kept apart from `LoginFormPanel` so the panel's
 * branding and layout can change without touching field logic, and vice versa. */
export function LoginForm({
  email,
  password,
  showPassword,
  error,
  submitting,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-4" noValidate>
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
          onChange={(event) => onEmailChange(event.target.value)}
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
          onChange={(event) => onPasswordChange(event.target.value)}
          placeholder="Masukkan password"
          leading={<Icon name="lock-line" className="text-lg text-ink-500" />}
          trailing={
            <button
              type="button"
              onClick={onTogglePassword}
              className="rounded-lg p-1 text-ink-500 hover:text-ink-700"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              <Icon name={showPassword ? "eye-off-line" : "eye-line"} className="text-lg" />
            </button>
          }
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? <Spinner size="sm" label="Memproses" /> : null}
        {submitting ? "Memproses..." : "Masuk"}
        {!submitting && <Icon name="arrow-right-line" />}
      </Button>
    </form>
  );
}
