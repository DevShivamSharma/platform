import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clipboard,
  Code2,
  Copy,
  Loader2,
  Upload,
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
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Branding
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span
              className="h-10 w-10 rounded-lg border border-white/10"
              style={{ backgroundColor: config.themeColor }}
            />
            <div>
              <h3 className="font-semibold text-white">{config.appName}</h3>
              <p className="text-xs text-slate-400">/{config.slug}</p>
              <p className="mt-1 text-xs capitalize text-slate-500">
                {config.industry || "generic"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Auth
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>{config.auth?.method === "magic-link" ? "Magic Link" : "Email + Password"}</p>
            <p>
              {Object.entries(config.auth?.screens || {})
                .filter(([, enabled]) => enabled)
                .map(([screen]) => screen)
                .join(", ") || "No screens selected"}
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Runtime
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>{config.modules?.length || 0} CRUD modules</p>
            <p>
              Dashboard {config.dashboard?.enabled ? "enabled" : "disabled"} ·
              Profile {config.profile?.enabled ? "enabled" : "disabled"}
            </p>
          </div>
        </section>
      </div>

      <section
        className={`rounded-xl border p-4 ${
          readiness.errors.length
            ? "border-rose-400/30 bg-rose-500/10"
            : "border-emerald-400/20 bg-emerald-500/10"
        }`}
      >
        <div className="flex items-start gap-3">
          {readiness.errors.length ? (
            <AlertTriangle className="mt-0.5 h-5 w-5 text-rose-300" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
          )}
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white">
              Production Readiness
            </h3>
            {readiness.errors.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-rose-100">
                {readiness.errors.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-emerald-100">
                No blocking branding, login-page, module, or industry leakage issues found in this config.
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

      <section className="rounded-xl border border-white/10 bg-slate-950 p-4">
        <h3 className="text-sm font-semibold text-white">Modules summary</h3>
        <div className="mt-4 grid gap-3">
          {(config.modules || []).map((module) => (
            <div
              key={module.id}
              className="rounded-lg border border-white/10 bg-slate-900 p-3"
            >
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <p className="font-semibold text-white">{module.pluralName}</p>
                  <p className="text-xs text-slate-500">/{module.id}</p>
                </div>
                <span className="w-fit rounded-full border border-white/10 px-2 py-1 text-xs text-slate-300">
                  {module.fields?.length || 0} fields
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(module.fields || []).map((field) => (
                  <span
                    key={field.key}
                    className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300"
                  >
                    {field.label} · {field.type}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setJsonDraft(prettyJson);
              setShowJson((value) => !value);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-[var(--portal-accent)]/45"
          >
            <Code2 className="h-4 w-4" />
            View JSON
          </button>
          <button
            type="button"
            onClick={() => {
              setJsonDraft("");
              setShowJson(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-[var(--portal-accent)]/45"
          >
            <Upload className="h-4 w-4" />
            Paste JSON
          </button>
          <button
            type="button"
            onClick={() => setShowSchema(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-[var(--portal-accent)]/45"
          >
            <BookOpen className="h-4 w-4" />
            Schema Reference
          </button>
          <button
            type="button"
            onClick={copyConfig}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-[var(--portal-accent)]/45"
          >
            <Copy className="h-4 w-4" />
            {copyStatus || "Copy Config"}
          </button>
        </div>

        {/* Generate Portal button is in the wizard footer — no duplicate here */}
      </div>

      {generateError && (
        <div className="rounded-lg border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
          {generateError}
        </div>
      )}

      {showJson && (
        <section className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-white">
              <Clipboard className="h-4 w-4" />
              Portal config JSON
            </h3>
            <button
              type="button"
              onClick={applyJsonDraft}
              className="rounded-md border border-white/10 px-3 py-1.5 text-xs font-semibold text-[var(--portal-accent)] hover:border-[var(--portal-accent)]/45"
            >
              Apply JSON
            </button>
          </div>
          <textarea
            value={jsonDraft}
            onChange={(event) => setJsonDraft(event.target.value)}
            spellCheck="false"
            className="h-[360px] w-full resize-y rounded-lg border border-white/10 bg-slate-900 p-3 font-mono text-xs leading-relaxed text-slate-100 outline-none focus:border-[var(--portal-accent)]"
            placeholder="Paste portal-config.json here"
          />
          {jsonError && (
            <p className="mt-2 text-xs text-rose-300">{jsonError}</p>
          )}
        </section>
      )}

      {showSchema && (
        <section className="rounded-xl border border-[var(--portal-accent)]/20 bg-slate-950 p-4">
          <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-white">
              <BookOpen className="h-4 w-4" />
              Schema Reference
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copySchemaReference}
                className="rounded-md border border-white/10 px-3 py-1.5 text-xs font-semibold text-[var(--portal-accent)] hover:border-[var(--portal-accent)]/45"
              >
                Copy prompt
              </button>
              <button
                type="button"
                onClick={() => setShowSchema(false)}
                className="rounded-md border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-[var(--portal-accent)]/45"
              >
                Close
              </button>
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-900 p-3">
            <p className="mb-3 text-xs leading-relaxed text-slate-300">
              {aiPrompt}
            </p>
            <pre className="max-h-[360px] overflow-auto text-xs leading-relaxed text-slate-100">
              {schemaReference}
            </pre>
          </div>
        </section>
      )}
    </div>
  );
}
