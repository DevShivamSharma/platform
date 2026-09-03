import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Blocks,
  Database,
  Eye,
  EyeOff,
  LayoutTemplate,
  LogIn,
  Rocket,
} from "lucide-react";
import { useAuth } from "./AuthContext";

const highlights = [
  {
    icon: LayoutTemplate,
    title: "Pick a template",
    text: "Landing pages and admin portals, pre-styled and ready to customise.",
  },
  {
    icon: Database,
    title: "Configure the data",
    text: "Describe modules and fields once. Tables, forms, and auth are generated.",
  },
  {
    icon: Rocket,
    title: "Deploy in minutes",
    text: "Get a live URL, a GitHub repo, and a Supabase project in one click.",
  },
];

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect away from login
  const from = location.state?.from?.pathname || "/";
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Small delay so the loading state is perceptible
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error);
        setIsLoading(false);
      }
    }, 400);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b14] px-4 py-10 text-slate-100 antialiased">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black_20%,transparent_100%)]" />
        <div className="absolute left-1/2 top-[-18rem] h-[36rem] w-[56rem] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(56,189,248,0.12),transparent)] blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-[24rem] w-[24rem] rounded-full bg-indigo-500/[0.07] blur-[120px]" />
        <div className="absolute -left-32 bottom-1/4 h-[20rem] w-[20rem] rounded-full bg-sky-500/[0.05] blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative z-10 w-full max-w-5xl"
      >
        <div className="grid overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_32px_80px_-24px_rgba(0,0,0,0.8)] backdrop-blur-xl lg:grid-cols-[1.05fr_1fr]">
          {/* brand panel */}
          <aside className="relative hidden overflow-hidden border-r border-white/[0.06] p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(56,189,248,0.18),transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

            <div className="relative">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-b from-sky-400 via-sky-500 to-indigo-600 shadow-[0_0_24px_-4px_rgba(56,189,248,0.65),0_2px_4px_rgba(0,0,0,0.4)] ring-1 ring-inset ring-white/25">
                  <Blocks className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <span className="text-base font-semibold tracking-tight text-white">
                  Scaffolding
                </span>
              </div>

              <h2 className="mt-12 text-balance text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-white xl:text-4xl">
                Build apps from{" "}
                <span className="bg-gradient-to-r from-sky-300 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
                  configuration
                </span>
                , not boilerplate.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
                Generate landing pages and data-backed admin portals from reusable
                building blocks, then ship them with a live database.
              </p>

              <ul className="mt-10 space-y-5">
                {highlights.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex items-start gap-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-sky-300">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                        {text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="relative mt-10 text-xs text-slate-500">
              Admin access only. Contact the workspace owner for an invite.
            </p>
          </aside>

          {/* form panel */}
          <div className="p-8 sm:p-10 lg:p-12">
            {/* logo (mobile only, since the brand panel is hidden) */}
            <div className="mb-8 flex items-center gap-2.5 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-b from-sky-400 via-sky-500 to-indigo-600 shadow-[0_0_24px_-4px_rgba(56,189,248,0.65),0_2px_4px_rgba(0,0,0,0.4)] ring-1 ring-inset ring-white/25">
                <Blocks className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <span className="text-base font-semibold tracking-tight text-white">
                Scaffolding
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Welcome back
              </h1>
              <p className="mt-1.5 text-sm text-slate-400">
                Sign in to manage templates and portals.
              </p>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* email */}
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={error ? "true" : undefined}
                  className="block w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-sky-400/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-sky-400/20"
                />
              </div>

              {/* password */}
              <div>
                <label
                  htmlFor="login-password"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    aria-invalid={error ? "true" : undefined}
                    className="block w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-sky-400/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-sky-400/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-300"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* error */}
              {error && (
                <motion.div
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm font-medium text-red-300"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-lg bg-gradient-to-b from-sky-400 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(56,189,248,0.45),0_8px_24px_-8px_rgba(14,165,233,0.55)] transition-all duration-200 hover:from-sky-300 hover:to-sky-400 hover:shadow-[0_0_0_1px_rgba(56,189,248,0.6),0_12px_32px_-8px_rgba(14,165,233,0.7)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-slate-600">
              Scaffolding Platform · Admin Access Only
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
