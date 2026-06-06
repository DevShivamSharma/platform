import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Database,
  LayoutDashboard,
  LayoutTemplate,
  Sparkles,
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

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
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
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border backdrop-blur-sm transition-colors duration-300 ${
        isPortal
          ? "border-sky-300/15 bg-sky-950/20 hover:border-sky-300/40"
          : "border-white/10 bg-white/[0.03] hover:border-white/25"
      }`}
    >
      {/* hover glow */}
      <div
        className={`pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
          isPortal
            ? "bg-[radial-gradient(120%_120%_at_50%_0%,rgba(56,189,248,0.18),transparent_60%)]"
            : "bg-[radial-gradient(120%_120%_at_50%_0%,rgba(255,255,255,0.10),transparent_60%)]"
        }`}
      />

      <div
        className="relative aspect-[16/10] overflow-hidden"
        style={
          accentColor
            ? {
                background: `linear-gradient(135deg, ${accentColor}, #0f172a 72%)`,
              }
            : {
                background: "linear-gradient(135deg, #334155, #0f172a 72%)",
              }
        }
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),transparent_32%),linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:100%_100%,28px_28px,28px_28px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            className="h-12 w-12 text-white/75 transition duration-300 group-hover:scale-110 group-hover:text-white"
            strokeWidth={1.5}
          />
        </div>
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur ${
            isPortal ? "bg-sky-100 text-sky-950" : "bg-black/40 text-white/90"
          }`}
        >
          {isPortal ? "PORTAL" : type}
        </span>
        {needsSupabase && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-950/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-100 backdrop-blur">
            <Database className="h-3 w-3" />
            Includes Database
          </span>
        )}
      </div>

      <div className="relative flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onUse(template)}
          className={`mt-auto inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-lg transition active:scale-[0.98] ${
            isPortal
              ? "bg-sky-500 text-white shadow-sky-500/20 hover:bg-sky-400"
              : "bg-white text-slate-900 shadow-orange-500/20 hover:bg-slate-100"
          }`}
        >
          {isPortal ? "Build portal" : "Use this template"}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </button>
      </div>
    </motion.article>
  );
}

function Gallery() {
  const [activeTemplate, setActiveTemplate] = useState(null);
  const navigate = useNavigate();

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
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 antialiased">
      {/* grid + ambient glows */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-sky-500/20 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 top-40 h-[28rem] w-[28rem] rounded-full bg-indigo-500/10 blur-[130px]" />

      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 shadow-lg shadow-sky-500/30">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              My Platform
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-400 sm:flex">
            <a className="transition hover:text-white" href="#templates">
              Templates
            </a>
            <Link className="transition hover:text-white" to="/portal/demo-admin">
              Demo portal
            </Link>
            <a className="transition hover:text-white" href="https://github.com">
              GitHub
            </a>
            <a
              href="#templates"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3.5 py-1.5 font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/15"
            >
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </nav>
        </div>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-200">
            <Database className="h-3 w-3" />
            App Builder
          </span>
          <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            What do you want to{" "}
            <span className="bg-gradient-to-r from-sky-300 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
              build
            </span>
            ?
          </h1>
          <p className="mt-5 max-w-2xl text-balance text-base text-slate-400 sm:text-lg">
            Generate static landing pages or assemble data-backed admin portals
            from reusable configuration.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2">
              <LayoutTemplate className="h-4 w-4 text-sky-300" />
              {templateCount} templates
            </span>
            <span className="inline-flex items-center gap-2">
              <Zap className="h-4 w-4 text-sky-300" />
              Config-driven
            </span>
            <span className="inline-flex items-center gap-2">
              <Database className="h-4 w-4 text-sky-300" />
              Database ready
            </span>
          </div>
        </motion.div>

        <div id="templates" className="mt-16 space-y-16">
          {templateCategories.map((category) => (
            <section key={category.id} aria-labelledby={`${category.id}-title`}>
              <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <h2
                    id={`${category.id}-title`}
                    className="text-2xl font-semibold tracking-tight text-white"
                  >
                    {category.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {category.description}
                  </p>
                </div>
                {category.id === "portals" && (
                  <Link
                    to="/portal/demo-admin"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200"
                  >
                    Open demo-admin
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>

              <motion.div
                variants={gridVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {category.templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onUse={handleUseTemplate}
                  />
                ))}
              </motion.div>
            </section>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:px-10">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-sky-400 to-indigo-500">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span>My Platform — build apps from config.</span>
          </div>
          <span>© {new Date().getFullYear()} My Platform</span>
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
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/portal/new/:templateId" element={<PortalWizard />} />
        <Route path="/portal/:slug/*" element={<PortalApp />} />
        <Route path="/p/:slug/*" element={<PortalApp />} />
      </Routes>
    </BrowserRouter>
  );
}
