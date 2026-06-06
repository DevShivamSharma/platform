import { KeyRound, Mail, UserPlus } from "lucide-react";

const screenOptions = [
  { key: "login", label: "Login", icon: KeyRound },
  { key: "signup", label: "Signup", icon: UserPlus },
  { key: "forgotPassword", label: "Forgot Password", icon: Mail },
];

export default function StepAuth({ config, onChange, errors }) {
  const auth = config.auth || {};
  const screens = auth.screens || {};

  function updateAuth(nextAuth) {
    onChange({ ...config, auth: { ...auth, ...nextAuth } });
  }

  function toggleScreen(key) {
    updateAuth({
      screens: {
        ...screens,
        [key]: !screens[key],
      },
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Screens to include
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {screenOptions.map(({ key, label, icon: Icon }) => (
              <label
                key={key}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                  screens[key]
                    ? "border-sky-400/50 bg-sky-500/10"
                    : "border-white/10 bg-slate-950"
                }`}
              >
                <input
                  checked={!!screens[key]}
                  onChange={() => toggleScreen(key)}
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-slate-900 accent-sky-500"
                />
                <Icon className="h-4 w-4 text-slate-300" />
                <span className="text-sm text-slate-200">{label}</span>
              </label>
            ))}
          </div>
          {errors.authScreens && (
            <span className="mt-2 block text-xs text-rose-300">
              {errors.authScreens}
            </span>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Auth method</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              ["email-password", "Email + Password"],
              ["magic-link", "Magic Link"],
            ].map(([value, label]) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                  auth.method === value
                    ? "border-sky-400/50 bg-sky-500/10"
                    : "border-white/10 bg-slate-950"
                }`}
              >
                <input
                  checked={auth.method === value}
                  onChange={() => updateAuth({ method: value })}
                  type="radio"
                  name="auth-method"
                  className="h-4 w-4 border-white/20 bg-slate-900 accent-sky-500"
                />
                <span className="text-sm text-slate-200">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <aside className="rounded-xl border border-white/10 bg-slate-950/70 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Screen preview</h3>
          <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-slate-300">
            UI only
          </span>
        </div>
        <div className="grid gap-3">
          {screenOptions
            .filter(({ key }) => screens[key])
            .map(({ key, label }) => (
              <div
                key={key}
                className="rounded-lg border border-white/10 bg-slate-900 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-3 w-24 rounded bg-white/20" />
                  <span className="text-xs text-slate-500">{label}</span>
                </div>
                <div className="space-y-2">
                  <div className="h-8 rounded border border-white/10 bg-slate-950" />
                  {key !== "forgotPassword" && (
                    <div className="h-8 rounded border border-white/10 bg-slate-950" />
                  )}
                  <div
                    className="h-8 rounded"
                    style={{ backgroundColor: config.themeColor }}
                  />
                </div>
              </div>
            ))}
          {!screenOptions.some(({ key }) => screens[key]) && (
            <div className="rounded-lg border border-dashed border-white/15 p-6 text-center text-sm text-slate-400">
              Select at least one auth screen.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
