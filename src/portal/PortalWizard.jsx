import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Database,
  ExternalLink,
  Loader2,
  Palette,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import StepBranding from "./StepBranding";
import StepModules from "./StepModules";
import StepReview from "./StepReview";
import {
  auditPortalConfig,
  createInitialPortalConfig,
  normalizeModuleIds,
  slugify,
} from "./portalDefaults";
import { provisionPortal } from "./provisionClient";

const steps = [
  { id: "branding", label: "Basics & Branding" },
  { id: "modules", label: "Modules Builder" },
  { id: "review", label: "Review & Generate" },
];

const provisionSteps = [
  { step: 1, label: "Setting up database...", hint: "~60 sec" },
  { step: 2, label: "Creating tables...", hint: "~10 sec" },
  { step: 3, label: "Configuring authentication...", hint: "~5 sec" },
  { step: 4, label: "Creating admin profile...", hint: "~5 sec" },
  { step: 5, label: "Building portal from template...", hint: "~5 sec" },
  { step: 6, label: "Publishing to GitHub...", hint: "~10 sec" },
  { step: 7, label: "Deploying...", hint: "~60 sec" },
];

const slideVariants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -48 : 48 }),
};

function validateStep(stepIndex, config) {
  const errors = {};

  if (stepIndex === 0) {
    if (!config.portalName?.trim()) {
      errors.portalName = "Portal name is required.";
    }
    if (!config.appName?.trim()) {
      errors.appName = "App display name is required.";
    }
    if (!slugify(config.slug)) {
      errors.slug = "A valid slug is required.";
    }
    if (!/^#[0-9a-f]{6}$/i.test(config.themeColor || "")) {
      errors.themeColor = "Use a valid 6-digit hex color.";
    }
    if (!config.loginPage?.headline?.trim()) {
      errors.loginPage = "Login page headline is required.";
    }
    if (!config.loginPage?.description?.trim()) {
      errors.loginPage = "Login page description is required.";
    }
    if (!config.loginPage?.features?.filter((feature) => feature.title?.trim()).length) {
      errors.loginPage = "Add at least one login page feature.";
    }
  }

  if (stepIndex === 1) {
    if (!config.modules?.length) {
      errors.modules = "Add at least one CRUD module.";
    }
    const moduleIds = new Set();
    for (const module of config.modules || []) {
      if (!module.singularName?.trim() || !module.pluralName?.trim()) {
        errors.modules = "Every module needs singular and plural names.";
      }
      if (moduleIds.has(module.id)) {
        errors.modules = "Module slugs must be unique.";
      }
      moduleIds.add(module.id);
      if (!module.fields?.length) {
        errors.modules = "Every module needs at least one field.";
      }
      const fieldKeys = new Set();
      for (const field of module.fields || []) {
        if (!field.label?.trim() || !field.key?.trim()) {
          errors.modules = "Every field needs a label and key.";
        }
        if (fieldKeys.has(field.key)) {
          errors.modules = "Field keys must be unique within each module.";
        }
        fieldKeys.add(field.key);
      }
    }
  }

  return errors;
}

function StepContent({ stepIndex, config, setConfig, errors, reviewProps }) {
  if (stepIndex === 0) {
    return (
      <StepBranding config={config} onChange={setConfig} errors={errors} />
    );
  }
  if (stepIndex === 1) {
    return <StepModules config={config} onChange={setConfig} errors={errors} />;
  }
  return <StepReview config={config} {...reviewProps} />;
}

function createInitialProgress() {
  return provisionSteps.map((step) => ({ ...step, status: "pending" }));
}

function ProgressOverlay({
  status,
  stepsState,
  error,
  result,
  onClose,
}) {
  const tables = result?.tables || [];

  async function copyText(value) {
    await navigator.clipboard.writeText(value || "");
  }

  async function copyAllCredentials() {
    if (!result) return;
    await copyText(
      [
        `Client Link: ${result.liveUrl || ""}`,
        `GitHub: ${result.repoUrl || ""}`,
        `Supabase: ${result.supabaseUrl || ""}`,
        `Admin Email: ${result.adminEmail || ""}`,
        `Admin Password: ${result.adminPassword || ""}`,
        `Tables: ${tables.join(", ")}`,
      ].join("\n")
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 px-4 py-6 text-slate-100 backdrop-blur">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-2xl shadow-black/40 sm:p-7">
        {status === "success" && result ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="text-center sm:text-left">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, delay: 0.1 }}
                className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/40">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </motion.div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
                Portal Ready!
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Save these credentials now. They will not be shown again.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                ["Client Link", result.liveUrl],
                ["GitHub", result.repoUrl],
                ["Supabase", result.supabaseUrl],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-2 rounded-xl border border-white/10 bg-slate-950 p-3 sm:grid-cols-[130px_1fr_auto]"
                >
                  <span className="text-sm font-semibold text-slate-300">
                    {label}
                  </span>
                  <span className="min-w-0 break-all text-sm text-white">
                    {value}
                  </span>
                  <div className="flex gap-2">
                    <a
                      href={value}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs font-semibold text-sky-200 hover:border-sky-300/40"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open
                    </a>
                    <button
                      type="button"
                      onClick={() => copyText(value)}
                      className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs font-semibold text-slate-200 hover:border-sky-300/40"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <section className="rounded-xl border border-white/10 bg-slate-950 p-4">
              <h3 className="text-sm font-semibold text-white">Admin Login</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => copyText(result.adminEmail)}
                  className="rounded-lg border border-white/10 bg-slate-900 p-3 text-left text-sm text-slate-300 hover:border-sky-300/40"
                >
                  <span className="block text-xs uppercase tracking-wider text-slate-500">
                    Email
                  </span>
                  {result.adminEmail}
                </button>
                <button
                  type="button"
                  onClick={() => copyText(result.adminPassword)}
                  className="rounded-lg border border-white/10 bg-slate-900 p-3 text-left text-sm text-slate-300 hover:border-sky-300/40"
                >
                  <span className="block text-xs uppercase tracking-wider text-slate-500">
                    Password
                  </span>
                  {result.adminPassword}
                </button>
              </div>
            </section>

            <div className="rounded-xl border border-white/10 bg-slate-950 p-4 text-sm text-slate-300">
              <p>Tables: {tables.join(", ") || "None"}</p>
              <p className="mt-1">
                Data:{" "}
                {result.sampleDataSummary ||
                  "Business tables start empty"}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={copyAllCredentials}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-sky-300/40"
              >
                <Copy className="h-4 w-4" />
                Copy All Credentials
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
              >
                Back to Gallery
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-sky-300">
                  Provisioning
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                  Building your portal
                </h2>
              </div>
              <div className="relative flex h-12 w-12 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-sky-400/20" />
                <Loader2 className="relative h-6 w-6 animate-spin text-sky-400" />
              </div>
            </div>

            <div className="space-y-3">
              {stepsState.map((item) => {
                const isRunning = item.status === "running";
                const isDone = item.status === "done";
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={item.step}
                    className={`relative overflow-hidden flex items-center justify-between gap-3 rounded-xl border p-4 transition-all duration-500 ${
                      isRunning
                        ? "border-sky-500/50 bg-sky-500/10 shadow-[0_0_20px_rgba(56,189,248,0.15)] scale-[1.02]"
                        : isDone
                          ? "border-emerald-500/20 bg-emerald-500/5 opacity-70"
                          : "border-white/5 bg-slate-900/50 opacity-50"
                    }`}
                  >
                    {isRunning && (
                      <motion.div
                        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-sky-400/10 to-transparent"
                        animate={{ translateX: ["-100%", "200%"] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-4">
                      <div className="relative">
                        {isRunning && (
                          <div className="absolute -inset-1 animate-pulse rounded-full bg-sky-400/20 blur-sm" />
                        )}
                        <span
                          className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-500 ${
                            isRunning
                              ? "bg-sky-500 text-white shadow-lg shadow-sky-500/40"
                              : isDone
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-white/10 text-slate-500"
                          }`}
                        >
                          {isDone ? (
                            <Check className="h-4 w-4" />
                          ) : isRunning ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span className="text-xs font-medium">
                              {item.step}
                            </span>
                          )}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-semibold transition-colors duration-500 ${
                          isRunning
                            ? "text-sky-100"
                            : isDone
                              ? "text-emerald-100/70"
                              : "text-slate-400"
                        }`}
                      >
                        {item.message || item.label}
                      </span>
                    </div>
                    <span
                      className={`relative z-10 text-xs transition-colors duration-500 ${
                        isRunning
                          ? "text-sky-300 font-medium animate-pulse"
                          : isDone
                            ? "text-emerald-500/50"
                            : "text-slate-500"
                      }`}
                    >
                      {isDone ? "Done" : item.hint}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-lg border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100"
              >
                {error}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PortalWizard() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [config, setConfig] = useState(() =>
    createInitialPortalConfig(templateId)
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState({});
  const [generateStatus, setGenerateStatus] = useState("idle");
  const [generateError, setGenerateError] = useState("");
  const [progressState, setProgressState] = useState(createInitialProgress);
  const [provisionResult, setProvisionResult] = useState(null);

  const activeStep = steps[stepIndex];
  
  useEffect(() => {
    const color = config.themeColor || "#2563eb";
    const clean = color.replace("#", "");
    const safe = /^[0-9a-f]{6}$/i.test(clean) ? clean : "2563eb";
    const value = parseInt(safe, 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;

    const root = document.documentElement;
    root.style.setProperty("--portal-accent", color);
    root.style.setProperty("--portal-accent-rgb", `${r} ${g} ${b}`);
  }, [config.themeColor]);
  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / steps.length) * 100),
    [stepIndex]
  );

  function goNext() {
    const nextErrors = validateStep(stepIndex, config);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setDirection(1);
    setStepIndex((value) => Math.min(value + 1, steps.length - 1));
  }

  function goBack() {
    setErrors({});
    setDirection(-1);
    setStepIndex((value) => Math.max(value - 1, 0));
  }

  async function handleGenerate() {
    const normalized = normalizeModuleIds(config);
    const readiness = auditPortalConfig(normalized);
    const allErrors = steps.reduce(
      (acc, _, index) => ({ ...acc, ...validateStep(index, normalized) }),
      readiness.errors.length
        ? { readiness: readiness.errors.join(" ") }
        : {}
    );
    setErrors(allErrors);
    if (Object.keys(allErrors).length) return;

    setGenerateStatus("running");
    setGenerateError("");
    setProvisionResult(null);
    setProgressState(createInitialProgress());
    try {
      const result = await provisionPortal(
        {
          templateId: templateId || normalized.templateId,
          projectName: normalized.slug,
          portalConfig: normalized,
        },
        (event) => {
          if (event.step) {
            setProgressState((current) =>
              current.map((item) =>
                item.step === event.step
                  ? {
                      ...item,
                      status:
                        event.status === "complete" ? "done" : event.status,
                      message: event.message || item.label,
                    }
                  : item.step < event.step
                    ? { ...item, status: "done" }
                    : item
              )
            );
          }
          if (event.status === "complete" && event.data) {
            setProvisionResult(event.data);
          }
        }
      );
      setProgressState((current) =>
        current.map((item) => ({ ...item, status: "done" }))
      );
      setProvisionResult(result);
      setGenerateStatus("success");
    } catch (error) {
      setGenerateError(error.message || "Could not generate portal.");
      setGenerateStatus("error");
      return;
    }
  }

  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100 antialiased overflow-x-hidden">
      {/* Background Ambient glows */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/3 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[rgba(var(--portal-accent-rgb),0.15)] blur-[150px]" />

      {/* Desktop Sidebar Layout */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-slate-950 lg:flex lg:flex-col h-screen">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-white/10 p-5">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Gallery
            </Link>
            
            <div className="mt-5 flex items-center gap-3">
              {config.logoUrl ? (
                <img
                  src={config.logoUrl}
                  alt=""
                  className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/10"
                />
              ) : (
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white font-bold text-sm tracking-wider ring-1 ring-white/10"
                  style={{ backgroundColor: "var(--portal-accent)" }}
                >
                  {config.logoText || "AP"}
                </div>
              )}
              <div className="min-w-0">
                <h1 className="truncate text-sm font-semibold text-white">
                  {config.appName || "My Portal"}
                </h1>
                <p className="truncate text-[10px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Configuring...
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Steps */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
            {steps.map((step, index) => {
              const isActive = index === stepIndex;
              const isDone = index < stepIndex;
              const StepIcon = index === 0 ? Palette : index === 1 ? Database : Sparkles;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (index > stepIndex) {
                      const nextErrors = validateStep(stepIndex, config);
                      setErrors(nextErrors);
                      if (Object.keys(nextErrors).length) return;
                    }
                    setDirection(index > stepIndex ? 1 : -1);
                    setStepIndex(index);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3.5 text-left text-sm font-medium transition duration-200 ${
                    isActive
                      ? "border-[var(--portal-accent)]/30 bg-[rgba(var(--portal-accent-rgb),0.12)] text-white shadow-sm"
                      : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition duration-200 ${
                      isDone
                        ? "bg-emerald-500 text-white"
                        : isActive
                          ? "bg-[var(--portal-accent)] text-white shadow-lg shadow-[var(--portal-accent)]/30"
                          : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {isDone ? <Check className="h-3 w-3" /> : index + 1}
                  </span>
                  <span className="flex-1">{step.label}</span>
                  <StepIcon className={`h-4 w-4 transition duration-200 ${isActive ? "text-[var(--portal-accent)]" : "text-slate-500"}`} />
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-white/10 p-4.5 space-y-4">
            {/* Setup Completion */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>Setup Progress</span>
                <span className="text-[var(--portal-accent)] font-bold">{progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-[var(--portal-accent)] shadow-[0_0_8px_var(--portal-accent)] transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Builder Profile card */}
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <div className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-slate-800 ring-1 ring-white/10">
                <UserRound className="h-4 w-4 text-slate-300" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">App Creator</p>
                <p className="text-[10px] text-slate-400">Workspace Active</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Panel Content (Shifted on Desktop) */}
      <div className="lg:pl-72 min-h-screen flex flex-col pb-24 lg:pb-0">
        {/* Mobile Sticky Top Header */}
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl lg:hidden">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
            <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-xs font-semibold">Gallery</span>
            </Link>
            <span className="text-sm font-bold text-white truncate max-w-[150px]">
              {config.appName}
            </span>
            <div
              className="h-6 w-6 rounded-full"
              style={{ backgroundColor: "var(--portal-accent)" }}
            />
          </div>
        </header>

        {/* Wizard Main Pane */}
        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10 max-w-7xl w-full mx-auto flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header / Subtitle */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-white/5 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[var(--portal-accent)] animate-pulse" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--portal-accent)]">
                    Phase 1: Portal Configurator
                  </p>
                </div>
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {activeStep.label}
                </h2>
                <p className="mt-1 text-sm text-slate-400 max-w-2xl">
                  Configure visual branding, modules metadata, data schema, and generate a live portal database.
                </p>
              </div>
              
              {/* Progress Display on Mobile/Tablet */}
              <div className="min-w-[180px] rounded-xl border border-white/10 bg-white/[0.02] p-3 lg:hidden">
                <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>Progress</span>
                  <span className="text-[var(--portal-accent)]">{progress}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[var(--portal-accent)] shadow-[0_0_8px_var(--portal-accent)] transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Render step card content */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/30 shadow-2xl ring-1 ring-white/5 backdrop-blur-sm p-4 sm:p-6.5">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={activeStep.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <StepContent
                    stepIndex={stepIndex}
                    config={config}
                    setConfig={setConfig}
                    errors={errors}
                    reviewProps={{
                      onConfigReplace: (nextConfig) =>
                        setConfig(normalizeModuleIds(nextConfig)),
                      onGenerate: handleGenerate,
                      generateStatus,
                      generateError,
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Footer Actions */}
          <footer className="mt-8 flex justify-between items-center border-t border-white/5 pt-6">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:border-[var(--portal-accent)]/30 hover:bg-white/10 transition disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {stepIndex < steps.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5.5 py-2.5 text-sm font-semibold text-white shadow-lg active:scale-[0.98] transition cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, var(--portal-accent), #4f46e5)",
                  boxShadow: "0 4px 14px rgba(79, 70, 229, 0.2)"
                }}
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generateStatus === "running"}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {generateStatus === "running" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Generate Portal
              </button>
            )}
          </footer>
        </main>
      </div>

      {/* Mobile Sticky Bottom Tab Bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-slate-950/90 backdrop-blur-lg lg:hidden py-1">
        {steps.map((step, index) => {
          const isActive = index === stepIndex;
          const StepIcon = index === 0 ? Palette : index === 1 ? Database : Sparkles;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                if (index > stepIndex) {
                  const nextErrors = validateStep(stepIndex, config);
                  setErrors(nextErrors);
                  if (Object.keys(nextErrors).length) return;
                }
                setDirection(index > stepIndex ? 1 : -1);
                setStepIndex(index);
              }}
              className={`flex flex-1 flex-col items-center gap-1.5 py-2 text-[10px] font-medium transition ${
                isActive ? "text-white" : "text-slate-500 hover:text-slate-300"
              }`}
              style={isActive ? { color: "var(--portal-accent)" } : undefined}
            >
              <StepIcon className="h-5 w-5" />
              <span>{step.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </nav>

      {/* Generation Progress Overlay */}
      {(generateStatus === "running" ||
        generateStatus === "success" ||
        generateStatus === "error") && (
        <ProgressOverlay
          status={generateStatus}
          stepsState={progressState}
          error={generateError}
          result={provisionResult}
          onClose={() => navigate("/")}
        />
      )}
    </main>
  );
}
