import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import {
  Eye,
  EyeOff,
  Github,
  Mail,
  Lock,
  User as UserIcon,
  Loader2,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — Northwind" },
      {
        name: "description",
        content:
          "Sign in to Northwind — the modern, fast, opinionated workspace for product teams.",
      },
      { property: "og:title", content: "Sign in — Northwind" },
      {
        property: "og:description",
        content:
          "Sign in to Northwind — the modern, fast, opinionated workspace for product teams.",
      },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "signup";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function scorePassword(pw: string) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4);
}

const strengthMeta = [
  { label: "Too weak", color: "bg-destructive" },
  { label: "Weak", color: "bg-destructive/80" },
  { label: "Okay", color: "bg-amber-400" },
  { label: "Strong", color: "bg-success" },
  { label: "Excellent", color: "bg-success" },
];

function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const emailValid = emailRe.test(email);
  const pwScore = scorePassword(password);
  const pwValid = mode === "login" ? password.length >= 6 : pwScore >= 2;
  const nameValid = mode === "login" ? true : name.trim().length >= 2;
  const formValid = emailValid && pwValid && nameValid;

  const greetName = useMemo(() => {
    if (name.trim()) return name.trim().split(" ")[0];
    if (email.includes("@")) return email.split("@")[0];
    return "friend";
  }, [name, email]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    setServerError(null);
    if (!formValid) return;
    setLoading(true);
    try {
      // Mock backend call
      const endpoint =
        mode === "login"
          ? "http://localhost:3000/api/auth/login"
          : "http://localhost:3000/api/auth/signup";
      try {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
      } catch {
        // Mock: ignore network failure in preview
      }
      await new Promise((r) => setTimeout(r, 900));
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  function handleGithub() {
    setServerError(null);
    setLoading(true);
    window.location.assign("http://localhost:3000/api/auth/github");
  }

  return (
    <div className="bg-aurora relative min-h-screen overflow-hidden text-foreground">
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 80%)",
        }}
      />

      {/* Top nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent shadow-[0_0_20px_-2px_var(--color-primary)]">
            <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold tracking-tight">Northwind</span>
        </div>
        <a
          href="#"
          className="text-xs font-medium text-muted-foreground transition hover:text-foreground"
        >
          Need help?
        </a>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-col px-6 pb-16 pt-6 md:pt-16">
        {success ? (
          <SuccessCard name={greetName} onReset={() => setSuccess(false)} />
        ) : (
          <div
            className="glass-card rounded-2xl p-7 md:p-8"
            style={{ animation: "float-up 0.5s ease-out both" }}
          >
            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-gradient text-2xl font-semibold tracking-tight md:text-[28px]">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {mode === "login"
                  ? "Sign in to continue to your workspace."
                  : "Start your 14-day free trial. No credit card required."}
              </p>
            </div>

            {/* Mode toggle */}
            <div className="relative mb-6 grid grid-cols-2 rounded-lg border border-border bg-input p-1 text-sm">
              <div
                className="absolute inset-y-1 w-[calc(50%-4px)] rounded-md bg-gradient-to-b from-white/10 to-white/5 shadow-[inset_0_1px_0_0_oklch(1_0_0/0.12),0_1px_2px_0_oklch(0_0_0/0.3)] transition-all duration-300 ease-out"
                style={{ left: mode === "login" ? "4px" : "calc(50% + 0px)" }}
              />
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m);
                    setServerError(null);
                  }}
                  className={`relative z-10 rounded-md py-1.5 font-medium transition-colors ${
                    mode === m ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "login" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>

            {/* GitHub */}
            <button
              type="button"
              onClick={handleGithub}
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium transition hover:bg-secondary/70 hover:border-white/15 disabled:opacity-60"
            >
              <Github className="h-4 w-4" />
              Continue with GitHub
            </button>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              or
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {mode === "signup" && (
                <Field
                  label="Full name"
                  icon={<UserIcon className="h-4 w-4" />}
                  error={touched.name && !nameValid ? "Please enter your name" : null}
                >
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    placeholder="Ada Lovelace"
                    autoComplete="name"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                  />
                </Field>
              )}

              <Field
                label="Email"
                icon={<Mail className="h-4 w-4" />}
                error={
                  touched.email && email && !emailValid
                    ? "Enter a valid email address"
                    : touched.email && !email
                      ? "Email is required"
                      : null
                }
                valid={emailValid}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                />
              </Field>

              <Field
                label="Password"
                icon={<Lock className="h-4 w-4" />}
                rightAction={
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="text-muted-foreground transition hover:text-foreground"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                error={
                  touched.password && !pwValid
                    ? mode === "login"
                      ? "Password is required"
                      : "Use 8+ chars with letters & numbers"
                    : null
                }
              >
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  placeholder="••••••••"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                />
              </Field>

              {mode === "signup" && password.length > 0 && (
                <div className="space-y-1.5" style={{ animation: "float-up 0.25s ease-out both" }}>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i < pwScore ? strengthMeta[pwScore].color : "bg-white/8"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Strength:{" "}
                    <span className="text-foreground/90">{strengthMeta[pwScore].label}</span>
                  </p>
                </div>
              )}

              {mode === "login" && (
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-muted-foreground">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-border bg-input accent-primary"
                    />
                    Remember me
                  </label>
                  <a href="#" className="font-medium text-foreground/90 hover:text-primary">
                    Forgot password?
                  </a>
                </div>
              )}

              {serverError && (
                <p className="text-xs text-destructive">{serverError}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary-gradient group flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.99] disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  <>
                    {mode === "login" ? "Sign in" : "Create account"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <a href="#" className="text-foreground/80 hover:text-primary">Terms</a> and{" "}
              <a href="#" className="text-foreground/80 hover:text-primary">Privacy Policy</a>.
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {mode === "login" ? "New to Northwind?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="font-medium text-foreground hover:text-primary"
          >
            {mode === "login" ? "Create an account" : "Sign in instead"}
          </button>
        </p>
      </main>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
  error,
  rightAction,
  valid,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  error?: string | null;
  rightAction?: React.ReactNode;
  valid?: boolean;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        {valid && (
          <span className="flex items-center gap-1 text-[11px] text-success">
            <Check className="h-3 w-3" /> looks good
          </span>
        )}
      </div>
      <div
        className={`group flex items-center gap-2.5 rounded-lg border bg-input px-3 py-2.5 transition focus-within:border-primary/60 focus-within:bg-input/80 focus-within:ring-2 focus-within:ring-ring/40 ${
          error ? "border-destructive/60" : "border-border"
        }`}
      >
        <span className="text-muted-foreground">{icon}</span>
        <div className="flex-1">{children}</div>
        {rightAction}
      </div>
      {error && (
        <p
          className="mt-1.5 text-[11px] text-destructive"
          style={{ animation: "float-up 0.2s ease-out both" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function SuccessCard({ name, onReset }: { name: string; onReset: () => void }) {
  return (
    <div
      className="glass-card flex flex-col items-center rounded-2xl p-8 text-center md:p-10"
      style={{ animation: "float-up 0.5s ease-out both" }}
    >
      <div
        className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--success) 35%, transparent), transparent 70%)",
        }}
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-success/90 to-success shadow-[0_0_40px_-6px_var(--success)]"
          style={{ animation: "pop-in 0.5s cubic-bezier(0.18, 1.25, 0.6, 1) both" }}
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
            <path
              d="M5 12.5l4.2 4.2L19 7"
              stroke="oklch(0.16 0.012 270)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="60"
              strokeDashoffset="60"
              style={{ animation: "check-draw 0.5s ease-out 0.25s forwards" }}
            />
          </svg>
        </div>
      </div>
      <h2
        className="text-gradient text-2xl font-semibold tracking-tight md:text-3xl"
        style={{ animation: "float-up 0.4s ease-out 0.2s both" }}
      >
        Welcome back, {name}!
      </h2>
      <p
        className="mt-2 max-w-xs text-sm text-muted-foreground"
        style={{ animation: "float-up 0.4s ease-out 0.3s both" }}
      >
        You're signed in. Taking you to your workspace…
      </p>

      <div
        className="mt-7 h-1 w-full overflow-hidden rounded-full bg-white/5"
        style={{ animation: "float-up 0.4s ease-out 0.4s both" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-primary), transparent)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.6s linear infinite",
          }}
        />
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 text-xs font-medium text-muted-foreground transition hover:text-foreground"
      >
        Use a different account
      </button>
    </div>
  );
}
