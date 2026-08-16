import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Blocks, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "./AuthContext";

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b14] px-4 text-slate-100 antialiased">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-18rem] h-[36rem] w-[56rem] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(56,189,248,0.10),transparent)] blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-[24rem] w-[24rem] rounded-full bg-indigo-500/[0.06] blur-[120px]" />
        <div className="absolute -left-32 bottom-1/4 h-[20rem] w-[20rem] rounded-full bg-sky-500/[0.04] blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* card */}
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_24px_64px_-16px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-10">
          {/* logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-b from-sky-400 via-sky-500 to-indigo-600 shadow-[0_0_24px_-4px_rgba(56,189,248,0.65),0_2px_4px_rgba(0,0,0,0.4)] ring-1 ring-inset ring-white/25">
              <Blocks className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-semibold tracking-tight text-white">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Sign in to access the platform
              </p>
            </div>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="block w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-sky-400/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-sky-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
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
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-red-500/20 bg-red-500/[0.08] px-4 py-2.5 text-sm font-medium text-red-300"
              >
                {error}
              </motion.div>
            )}

            {/* submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-lg bg-gradient-to-b from-sky-400 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(56,189,248,0.45),0_8px_24px_-8px_rgba(14,165,233,0.55)] transition-all duration-200 hover:from-sky-300 hover:to-sky-400 hover:shadow-[0_0_0_1px_rgba(56,189,248,0.6),0_12px_32px_-8px_rgba(14,165,233,0.7)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
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
        </div>

        {/* subtle footer */}
        <p className="mt-6 text-center text-xs text-slate-600">
          Scaffolding Platform · Admin Access Only
        </p>
      </motion.div>
    </div>
  );
}
