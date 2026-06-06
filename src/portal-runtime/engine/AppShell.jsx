import * as Icons from "lucide-react";
import { Link, NavLink } from "react-router-dom";

function ModuleIcon({ name }) {
  const Icon = Icons[name] || Icons.Database;
  return <Icon className="h-4 w-4" />;
}

export default function AppShell({ config, slug, children }) {
  const modules = config.modules || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-slate-950 lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 p-5">
            <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-slate-300">
              My Platform
            </Link>
            <div className="mt-4 flex items-center gap-3">
              {config.logoUrl ? (
                <img
                  src={config.logoUrl}
                  alt=""
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: "var(--portal-accent)" }}
                >
                  <Icons.LayoutDashboard className="h-5 w-5" />
                </div>
              )}
              <div className="min-w-0">
                <h1 className="truncate text-sm font-semibold text-white">
                  {config.appName}
                </h1>
                <p className="truncate text-xs capitalize text-slate-500">
                  {config.type} portal
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {config.dashboard?.enabled && (
              <NavLink
                to={`/portal/${slug}`}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-[rgb(var(--portal-accent-rgb)/0.18)] text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icons.ChartNoAxesColumn className="h-4 w-4" />
                Dashboard
              </NavLink>
            )}

            {modules.map((module) => (
              <NavLink
                key={module.id}
                to={`/portal/${slug}/${module.id}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-[rgb(var(--portal-accent-rgb)/0.18)] text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <ModuleIcon name={module.icon} />
                {module.pluralName}
              </NavLink>
            ))}
          </nav>

          {config.profile?.enabled && (
            <div className="border-t border-white/10 p-4">
              <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800">
                  <Icons.UserRound className="h-4 w-4 text-slate-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-slate-500">Profile enabled</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Portal</p>
              <h2 className="truncate text-sm font-semibold text-white">
                {config.appName}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/portal/${slug}/login`}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-white/20"
              >
                Login
              </Link>
              <Link
                to="/"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-400 hover:text-white"
              >
                Gallery
              </Link>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto border-t border-white/5 px-4 py-2 lg:hidden">
            {config.dashboard?.enabled && (
              <NavLink
                to={`/portal/${slug}`}
                end
                className={({ isActive }) =>
                  `shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    isActive
                      ? "bg-[var(--portal-accent)] text-white"
                      : "bg-white/5 text-slate-300"
                  }`
                }
              >
                Dashboard
              </NavLink>
            )}
            {modules.map((module) => (
              <NavLink
                key={module.id}
                to={`/portal/${slug}/${module.id}`}
                className={({ isActive }) =>
                  `shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    isActive
                      ? "bg-[var(--portal-accent)] text-white"
                      : "bg-white/5 text-slate-300"
                  }`
                }
              >
                {module.pluralName}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
