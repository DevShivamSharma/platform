import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Code2,
  Database,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Mail,
  Zap,
} from "lucide-react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import GenerateModal from "./components/GenerateModal";
import PortalWizard from "./portal/PortalWizard";
import PortalApp from "./portal-runtime/PortalApp";
import { templateCategories } from "./templates";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import LoginPage from "./auth/LoginPage";

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
};

const sectionReveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } },
};

function isHexAccent(accent) {
  return typeof accent === "string";
}

function TemplateCard({ template, onUse }) {
  const { name, description, tags, type, accent, needsSupabase } = template;
  const isPortal = type === "portal";
  const Icon = isPortal ? LayoutDashboard : LayoutTemplate;
  const accentColor = isHexAccent(accent) ? accent : undefined;

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_8px_32px_-12px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-white/[0.16] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_24px_48px_-12px_rgba(0,0,0,0.65)]"
    >
      {/* hover accent glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120% 90% at 50% 0%, ${
            accentColor ? `${accentColor}2e` : "rgba(56,189,248,0.16)"
          }, transparent 62%)`,
        }}
      />

      {/* preview */}
      <div className="relative m-2 aspect-[16/10] overflow-hidden rounded-xl">
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          style={{
            background: accentColor
              ? `linear-gradient(135deg, ${accentColor}cc 0%, ${accentColor}55 38%, #0b1120 78%)`
              : "linear-gradient(135deg, #475569cc 0%, #33415555 38%, #0b1120 78%)",
          }}
        />
        {/* sheen + fine grid */}
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18),transparent_36%),linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100%_100%,26px_26px,26px_26px]" />
        {/* bottom fade into card body */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0b1120]/80 to-transparent" />

        {/* mock browser window */}
        <div className="absolute inset-x-6 top-6 bottom-0 rounded-t-lg border border-white/15 bg-slate-950/55 shadow-2xl backdrop-blur-[2px] transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="ml-2 h-2 w-20 rounded-full bg-white/10" />
          </div>
          <div className="flex h-full items-center justify-center pb-8">
            <Icon
              className="h-10 w-10 text-white/70 transition duration-300 group-hover:scale-110 group-hover:text-white"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* badges */}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md ${
            isPortal
              ? "border border-sky-300/30 bg-sky-950/70 text-sky-200"
              : "border border-white/15 bg-black/45 text-white/90"
          }`}
        >
          {isPortal ? "Portal" : type}
        </span>
        {needsSupabase && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-950/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-200 backdrop-blur-md">
            <Database className="h-3 w-3" />
            Database
          </span>
        )}
      </div>

      {/* body */}
      <div className="relative flex flex-1 flex-col gap-4 p-5 pt-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-white">
            {name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-slate-300 transition-colors duration-300 group-hover:border-white/[0.14]"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onUse(template)}
          className={`mt-auto inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
            isPortal
              ? "bg-gradient-to-b from-sky-400 to-sky-500 text-white shadow-[0_0_0_1px_rgba(56,189,248,0.45),0_8px_24px_-8px_rgba(14,165,233,0.55)] hover:from-sky-300 hover:to-sky-400 hover:shadow-[0_0_0_1px_rgba(56,189,248,0.6),0_12px_32px_-8px_rgba(14,165,233,0.7)]"
              : "bg-white text-slate-950 shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_8px_24px_-8px_rgba(255,255,255,0.25)] hover:bg-slate-100 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_12px_32px_-8px_rgba(255,255,255,0.35)]"
          }`}
        >
          {isPortal ? "Build portal" : "Use this template"}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </motion.article>
  );
}

function Gallery() {
  const [activeTemplate, setActiveTemplate] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleUseTemplate(template) {
    if (template.inputMode === "wizard") {
      navigate(`/portal/new/${template.id}`);
      return;
    }
    setActiveTemplate(template);
  }

  const templateCount = templateCategories.reduce(
    (total, category) => total + category.templates.length,
    0
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b14] text-slate-100 antialiased">
      {/* ambient background: grid + beams + glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_90%_55%_at_50%_0%,black_35%,transparent_100%)]" />
        <div className="absolute left-1/2 top-[-22rem] h-[44rem] w-[72rem] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(56,189,248,0.14),transparent)] blur-3xl" />
        <div className="absolute -right-48 top-48 h-[30rem] w-[30rem] rounded-full bg-indigo-500/[0.07] blur-[140px]" />
        <div className="absolute -left-48 top-[36rem] h-[26rem] w-[26rem] rounded-full bg-sky-500/[0.05] blur-[140px]" />
      </div>

      {/* navbar */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#070b14]/65 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#070b14]/55">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3.5 sm:px-10">
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-[9px] bg-gradient-to-b from-sky-400 via-sky-500 to-indigo-600 shadow-[0_0_20px_-4px_rgba(56,189,248,0.6),0_1px_2px_rgba(0,0,0,0.4)] ring-1 ring-inset ring-white/25 transition-shadow duration-300 group-hover:shadow-[0_0_28px_-4px_rgba(56,189,248,0.85),0_1px_2px_rgba(0,0,0,0.4)]">
              <Blocks className="h-[18px] w-[18px] text-white" strokeWidth={2} />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">
              Scaffolding
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm text-slate-400 sm:gap-2">
            <a
              className="hidden rounded-md px-3 py-1.5 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white sm:block"
              href="#templates"
            >
              Templates
            </a>
            <Link
              className="hidden rounded-md px-3 py-1.5 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white sm:block"
              to="/portal/demo-admin"
            >
              Demo portal
            </Link>
            <a
              className="hidden items-center gap-1 rounded-md px-3 py-1.5 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white sm:inline-flex"
              href="https://github.com"
            >
              GitHub
              <ArrowUpRight className="h-3 w-3 opacity-60" />
            </a>
            <a
              href="#templates"
              className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_24px_-8px_rgba(255,255,255,0.3)] transition-all duration-200 hover:bg-slate-100 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_12px_28px_-8px_rgba(255,255,255,0.4)] active:scale-[0.98]"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              onClick={logout}
              className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-slate-400 transition-all duration-200 hover:border-red-400/30 hover:bg-red-500/[0.08] hover:text-red-300 active:scale-[0.98]"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </nav>
        </div>
      </header>

      {/* hero */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-8 pt-24 sm:px-10 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-500/[0.08] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-200 shadow-[0_0_24px_-8px_rgba(56,189,248,0.5)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-400" />
            </span>
            App Builder
          </span>

          <h1 className="mt-7 text-balance text-5xl font-bold leading-[1.03] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl">
            What do you want to{" "}
            <span className="bg-gradient-to-r from-sky-300 via-indigo-300 to-sky-300 bg-clip-text text-transparent [text-shadow:0_0_48px_rgba(56,189,248,0.25)]">
              build
            </span>
            ?
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-slate-400 sm:text-lg">
            Generate static landing pages or assemble data-backed admin
            portals from reusable configuration.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
            {[
              { icon: LayoutTemplate, label: `${templateCount} templates` },
              { icon: Zap, label: "Config-driven" },
              { icon: Database, label: "Database ready" },
            ].map(({ icon: BadgeIcon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-sm text-slate-300 backdrop-blur-sm transition-colors duration-200 hover:border-white/[0.16] hover:text-white"
              >
                <BadgeIcon className="h-3.5 w-3.5 text-sky-300" />
                {label}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* templates */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 sm:px-10">
        <div id="templates" className="mt-20 space-y-24 scroll-mt-24">
          {templateCategories.map((category) => (
            <motion.section
              key={category.id}
              aria-labelledby={`${category.id}-title`}
              variants={sectionReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
            >
              <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <div className="mb-3 h-px w-12 bg-gradient-to-r from-sky-400 to-transparent" />
                  <h2
                    id={`${category.id}-title`}
                    className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                  >
                    {category.title}
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
                    {category.description}
                  </p>
                </div>
                {category.id === "portals" && (
                  <Link
                    to="/portal/demo-admin"
                    className="group inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-semibold text-sky-300 transition-all duration-200 hover:border-sky-400/30 hover:bg-sky-500/[0.08] hover:text-sky-200"
                  >
                    Open demo-admin
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>

              <motion.div
                variants={gridVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
              >
                {category.templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onUse={handleUseTemplate}
                  />
                ))}
              </motion.div>
            </motion.section>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#05080f]/80 backdrop-blur-xl">
        {/* top hairline glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10">
          <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
            {/* Brand */}
            <div className="max-w-sm">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-gradient-to-b from-sky-400 via-sky-500 to-indigo-600 shadow-[0_0_20px_-4px_rgba(56,189,248,0.6),0_1px_2px_rgba(0,0,0,0.4)] ring-1 ring-inset ring-white/25">
                  <Blocks className="h-[18px] w-[18px] text-white" strokeWidth={2} />
                </div>
                <span className="text-[15px] font-semibold tracking-tight text-white">
                  Scaffolding
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Build apps from config. Generate landing pages or assemble
                data-backed admin portals from reusable building blocks.
              </p>
              <div className="mt-6 flex items-center gap-2.5">
                <a
                  href="https://github.com"
                  aria-label="GitHub"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-400 transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-white"
                >
                  <Code2 className="h-4 w-4" />
                </a>
                <a
                  href="mailto:hello@myplatform.dev"
                  aria-label="Email"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-400 transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Link columns */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Product
              </h3>
              <ul className="mt-5 space-y-3.5 text-sm text-slate-400">
                <li>
                  <a
                    className="transition-colors duration-200 hover:text-white"
                    href="#templates"
                  >
                    Templates
                  </a>
                </li>
                <li>
                  <Link
                    className="transition-colors duration-200 hover:text-white"
                    to="/portal/demo-admin"
                  >
                    Demo portal
                  </Link>
                </li>
                <li>
                  <a
                    className="transition-colors duration-200 hover:text-white"
                    href="#templates"
                  >
                    Get started
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Resources
              </h3>
              <ul className="mt-5 space-y-3.5 text-sm text-slate-400">
                <li>
                  <a
                    className="inline-flex items-center gap-1 transition-colors duration-200 hover:text-white"
                    href="https://github.com"
                  >
                    Documentation
                    <ArrowUpRight className="h-3 w-3 opacity-50" />
                  </a>
                </li>
                <li>
                  <a
                    className="inline-flex items-center gap-1 transition-colors duration-200 hover:text-white"
                    href="https://github.com"
                  >
                    GitHub
                    <ArrowUpRight className="h-3 w-3 opacity-50" />
                  </a>
                </li>
                <li>
                  <a
                    className="inline-flex items-center gap-1 transition-colors duration-200 hover:text-white"
                    href="https://shivamshharma.netlify.app/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Meet the developer
                    <ArrowUpRight className="h-3 w-3 opacity-50" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-7 text-sm text-slate-500 sm:flex-row">
            <span>
              © {new Date().getFullYear()} Scaffolding. All rights reserved.
            </span>
            <a
              href="https://shivamshharma.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 transition-colors duration-200 hover:text-white"
            >
              <Zap className="h-3.5 w-3.5 text-sky-300" />
              Built by Shivam Sharma
              <ArrowUpRight className="h-3 w-3 opacity-50 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {activeTemplate && (
          <GenerateModal
            template={activeTemplate}
            onClose={() => setActiveTemplate(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
          <Route path="/portal/new/:templateId" element={<ProtectedRoute><PortalWizard /></ProtectedRoute>} />
          <Route path="/portal/:slug/*" element={<ProtectedRoute><PortalApp /></ProtectedRoute>} />
          <Route path="/p/:slug/*" element={<ProtectedRoute><PortalApp /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
