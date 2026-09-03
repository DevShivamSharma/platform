import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clipboard,
  Code2,
  Copy,
  Database,
  LayoutDashboard,
  Palette,
  Upload,
  Wand2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { auditPortalConfig } from "./portalDefaults";

const schemaReference = `{
  "version": 1,
  "templateId": "portal-admin",
  "slug": "acme-admin",
  "portalName": "acme-admin",
  "appName": "Acme Admin",
  "industry": "crm",
  "themePreset": "red",
  "themeColor": "#dc2626",
  "logoUrl": "",
  "logoText": "AA",
  "loginPage": {
    "portalName": "Acme Admin",
    "badge": "Customer Management",
    "headline": "Manage your customers with ease",
    "highlightText": "customers",
    "description": "Manage records, workflows, and operations from one place.",
    "features": [
      {
        "title": "Secure Access",
        "description": "Enterprise-grade authentication."
      },
      {
        "title": "Self Service",
        "description": "Manage everything from one dashboard."
      }
    ],
    "footerText": "Powered by Acme"
  },
  "footer": { "text": "Powered by Acme" },
  "company": {
    "name": "Acme Pvt Ltd",
    "website": "https://acme.example",
    "supportEmail": "support@acme.example"
  },
  "dashboard": { "enabled": true, "template": "stats-overview", "style": "crm" },
  "profile": { "enabled": true },
  "modules": [
    {
      "id": "customers",
      "singularName": "Customer",
      "pluralName": "Customers",
      "icon": "Users",
      "fields": [
        {
          "label": "Email",
          "key": "email",
          "type": "email",
          "required": true,
          "width": "half",
          "options": [],
          "features": { "filter": true }
        }
      ],
      "listColumns": ["email"],
      "tableFeatures": {
        "sort": true,
        "filter": true,
        "search": true,
        "pagination": true,
        "export": true
      }
    }
  ]
}`;

const aiPrompt = `Create a customer-specific portal-config.json for a Supabase-backed admin portal. Use this schema exactly. Choose one industry from healthcare, crm, hrms, school, inventory, erp, generic. Every visible title, subtitle, feature, footer, module, icon, and field must match the selected industry and customer. Do not include healthcare terms unless industry is healthcare. Include modules with fields using these field types only: text, email, number, select, date, textarea, toggle, phone, currency, multi-select, radio, file, image, tags, checkbox. Return valid JSON only.`;

const toolButtonClass =
  "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-[rgba(var(--portal-accent-rgb),0.45)] hover:bg-white/5";

function SummaryCard({ icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 ring-1 ring-white/5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function StepReview({
  config,
  onConfigReplace,
  onGenerate,
  generateStatus,
  generateError,
}) {
  const prettyJson = useMemo(() => JSON.stringify(config, null, 2), [config]);
  const readiness = useMemo(() => auditPortalConfig(config), [config]);
  const [showJson, setShowJson] = useState(false);
  const [jsonDraft, setJsonDraft] = useState(prettyJson);
  const [jsonError, setJsonError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [showSchema, setShowSchema] = useState(false);

  const modules = config.modules || [];
  const fieldCount = modules.reduce(
    (total, module) => total + (module.fields?.length || 0),
    0
  );
  const loginFeatures = (config.loginPage?.features || []).filter((feature) =>
    feature.title?.trim()
  );
  const authScreens = Object.entries(config.auth?.screens || {})
    .filter(([, enabled]) => enabled)
    .map(([screen]) => screen);

  useEffect(() => {
    setJsonDraft(prettyJson);
  }, [prettyJson]);

  function applyJsonDraft() {
    try {
      const parsed = JSON.parse(jsonDraft);
      setJsonError("");
      onConfigReplace(parsed);
    } catch (error) {
      setJsonError(error.message);
    }
  }

  async function copyConfig() {
    await navigator.clipboard.writeText(prettyJson);
    setCopyStatus("Copied");
    window.setTimeout(() => setCopyStatus(""), 1400);
  }

  async function copySchemaReference() {
    await navigator.clipboard.writeText(`${aiPrompt}\n\nSchema:\n${schemaReference}`);
    setCopyStatus("Schema copied");
    window.setTimeout(() => setCopyStatus(""), 1400);
  }

  return (
    <div className="space-y-6">
      {/* Readiness banner */}
      <section
        className={`rounded-2xl border p-4 ring-1 ring-white/5 ${
          readiness.errors.length
            ? "border-rose-400/30 bg-rose-500/10"
            : "border-emerald-400/20 bg-emerald-500/10"
        }`}
      >
        <div className="flex items-start gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              readiness.errors.length
                ? "bg-rose-500/15 text-rose-300"
                : "bg-emerald-500/15 text-emerald-300"
            }`}
          >
            {readiness.errors.length ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <CheckCircle2 className="h-5 w-5" />
            )}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white">
              {readiness.errors.length
                ? "Fix these before generating"
                : "Ready to generate"}
            </h3>
            {readiness.errors.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-rose-100">
                {readiness.errors.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-emerald-100/90">
                No blocking branding, login page, module, or industry leakage issues found.
              </p>
            )}
            {readiness.warnings.length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-amber-100">
                {readiness.warnings.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={Palette} title="Branding">
          <div className="flex items-center gap-3">
            {config.logoUrl ? (
              <img
                src={config.logoUrl}
                alt=""
                className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
              />
            ) : (
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold uppercase text-white ring-1 ring-white/10"
                style={{ backgroundColor: config.themeColor }}
              >
                {(config.logoText || "AP").slice(0, 3)}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{config.appName}</p>
              <p className="truncate text-xs text-slate-400">/{config.slug}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-md bg-white/5 px-2 py-1 text-xs capitalize text-slate-300">
              {config.industry || "generic"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 font-mono text-xs text-slate-300">
              <span
                className="h-2.5 w-2.5 rounded-full ring-1 ring-white/20"
                style={{ backgroundColor: config.themeColor }}
              />
              {config.themeColor}
            </span>
          </div>
        </SummaryCard>

        <SummaryCard icon={Wand2} title="Login page">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--portal-accent)]">
            {config.loginPage?.badge || "Portal"}
          </p>
          <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-white">
            {config.loginPage?.headline || "No headline set"}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            {loginFeatures.length} feature highlight{loginFeatures.length === 1 ? "" : "s"}
          </p>
        </SummaryCard>

        <SummaryCard icon={Database} title="Modules">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">{modules.length}</span>
            <span className="text-sm text-slate-400">
              module{modules.length === 1 ? "" : "s"}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {fieldCount} field{fieldCount === 1 ? "" : "s"} in total
          </p>
        </SummaryCard>

        <SummaryCard icon={LayoutDashboard} title="Pages">
          <ul className="space-y-1.5 text-sm text-slate-300">
            <li className="flex items-center justify-between gap-2">
              <span>Dashboard</span>
              <span className={`text-xs font-semibold ${config.dashboard?.enabled ? "text-emerald-300" : "text-slate-500"}`}>
                {config.dashboard?.enabled ? config.dashboard.template || "on" : "off"}
              </span>
            </li>
            <li className="flex items-center justify-between gap-2">
              <span>Profile</span>
              <span className={`text-xs font-semibold ${config.profile?.enabled ? "text-emerald-300" : "text-slate-500"}`}>
                {config.profile?.enabled ? "on" : "off"}
              </span>
            </li>
            <li className="flex items-center justify-between gap-2">
              <span>Auth</span>
              <span className="truncate text-xs font-semibold capitalize text-slate-300">
                {authScreens.length ? authScreens.join(", ") : "none"}
              </span>
            </li>
          </ul>
        </SummaryCard>
      </div>

      {/* Modules summary */}
      <section className="rounded-2xl border border-white/10 bg-slate-900/40 ring-1 ring-white/5">
        <header className="flex items-center gap-2 border-b border-white/5 px-5 py-4">
          <Database className="h-4 w-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-white">Modules summary</h3>
        </header>
        <div className="grid gap-3 p-5 lg:grid-cols-2">
          {modules.map((module) => (
            <div
              key={module.id}
              className="rounded-xl border border-white/10 bg-slate-950/60 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{module.pluralName}</p>
                  <p className="truncate text-xs text-slate-500">/{module.id}</p>
                </div>
                <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-300 ring-1 ring-white/10">
                  {module.fields?.length || 0} fields
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(module.fields || []).map((field) => (
                  <span
                    key={field.key}
                    className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300"
                  >
                    {field.label}
                    <span className="text-slate-500"> · {field.type}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
          {modules.length === 0 && (
            <p className="text-sm text-slate-500">No modules configured.</p>
          )}
        </div>
      </section>

      {/* Config tools */}
      <section className="rounded-2xl border border-white/10 bg-slate-900/40 ring-1 ring-white/5">
        <header className="flex flex-col gap-3 border-b border-white/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-white">Config JSON</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setJsonDraft(prettyJson);
                setShowJson((value) => !value);
              }}
              className={toolButtonClass}
            >
              <Code2 className="h-4 w-4" />
              {showJson ? "Hide JSON" : "View JSON"}
            </button>
            <button
              type="button"
              onClick={() => {
                setJsonDraft("");
                setShowJson(true);
              }}
              className={toolButtonClass}
            >
              <Upload className="h-4 w-4" />
              Paste JSON
            </button>
            <button
              type="button"
              onClick={() => setShowSchema((value) => !value)}
              className={toolButtonClass}
            >
              <BookOpen className="h-4 w-4" />
              Schema reference
            </button>
            <button type="button" onClick={copyConfig} className={toolButtonClass}>
              <Copy className="h-4 w-4" />
              {copyStatus || "Copy config"}
            </button>
          </div>
        </header>

        {!showJson && !showSchema && (
          <p className="px-5 py-4 text-xs text-slate-500">
            View or paste the raw portal config, or copy an AI-ready schema prompt.
          </p>
        )}

        {showJson && (
          <div className="space-y-3 p-5">
            <div className="flex items-center justify-between gap-3">
              <h4 className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                <Clipboard className="h-4 w-4" />
                Portal config JSON
              </h4>
              <button
                type="button"
                onClick={applyJsonDraft}
                className="cursor-pointer rounded-md px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
                style={{ backgroundColor: "var(--portal-accent)" }}
              >
                Apply JSON
              </button>
            </div>
            <textarea
              value={jsonDraft}
              onChange={(event) => setJsonDraft(event.target.value)}
              spellCheck="false"
              className="h-[360px] w-full resize-y rounded-lg border border-white/10 bg-slate-950 p-3 font-mono text-xs leading-relaxed text-slate-100 outline-none transition focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
              placeholder="Paste portal-config.json here"
            />
            {jsonError && (
              <p className="text-xs text-rose-300">{jsonError}</p>
            )}
          </div>
        )}

        {showSchema && (
          <div className="space-y-3 border-t border-white/5 p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <h4 className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                <BookOpen className="h-4 w-4" />
                Schema reference
              </h4>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copySchemaReference}
                  className="cursor-pointer rounded-md border border-white/10 px-3 py-1.5 text-xs font-semibold text-[var(--portal-accent)] transition hover:border-[rgba(var(--portal-accent-rgb),0.45)]"
                >
                  Copy prompt
                </button>
                <button
                  type="button"
                  onClick={() => setShowSchema(false)}
                  className="cursor-pointer rounded-md border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-white/20"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-950 p-3">
              <p className="mb-3 text-xs leading-relaxed text-slate-300">
                {aiPrompt}
              </p>
              <pre className="max-h-[360px] overflow-auto text-xs leading-relaxed text-slate-100">
                {schemaReference}
              </pre>
            </div>
          </div>
        )}
      </section>

      {generateError && (
        <div className="rounded-lg border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
          {generateError}
        </div>
      )}
    </div>
  );
}
