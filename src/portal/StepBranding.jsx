import { Image, Palette, Plus, Trash2, Wand2 } from "lucide-react";

import {
  applyIndustryPreset,
  deriveLogoText,
  INDUSTRY_OPTIONS,
  slugify,
  THEME_PRESETS,
} from "./portalDefaults";

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-300">{error}</span>}
    </label>
  );
}

export default function StepBranding({ config, onChange, errors }) {
  const loginPage = config.loginPage || {};
  const features = loginPage.features?.length
    ? loginPage.features
    : [{ title: "", description: "" }];
  const company = config.company || {};

  function update(key, value) {
    const next = { ...config, [key]: value };
    if (key === "portalName") {
      next.slug = slugify(value);
    }
    if (key === "appName") {
      next.company = { ...(config.company || {}), name: value };
      if (!config.logoText) next.logoText = deriveLogoText(value);
      next.loginPage = {
        ...(config.loginPage || {}),
        portalName: value,
      };
    }
    onChange(next);
  }

  function updateLogin(key, value) {
    onChange({
      ...config,
      loginPage: {
        ...loginPage,
        [key]: value,
      },
    });
  }

  function updateCompany(key, value) {
    onChange({
      ...config,
      company: {
        ...company,
        [key]: value,
      },
    });
  }

  function updateFooter(value) {
    onChange({
      ...config,
      footer: { ...(config.footer || {}), text: value },
      loginPage: { ...loginPage, footerText: value },
    });
  }

  function updateFeature(index, patch) {
    const nextFeatures = features.map((feature, featureIndex) =>
      featureIndex === index ? { ...feature, ...patch } : feature
    );
    updateLogin("features", nextFeatures);
  }

  function addFeature() {
    updateLogin("features", [...features, { title: "", description: "" }]);
  }

  function removeFeature(index) {
    const nextFeatures = features.filter((_, featureIndex) => featureIndex !== index);
    updateLogin("features", nextFeatures.length ? nextFeatures : [{ title: "", description: "" }]);
  }

  function handleIndustryChange(industry) {
    onChange(applyIndustryPreset(config, industry));
  }

  function handleThemePresetChange(value) {
    const preset = THEME_PRESETS.find((item) => item.value === value);
    onChange({
      ...config,
      themePreset: value,
      themeColor: preset?.color || config.themeColor,
    });
  }

  function handleLogoFile(file) {
    if (!file) return;
    if (file.size > 750 * 1024) {
      window.alert("Logo image must be under 750 KB for config-based embedding.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      update("logoUrl", String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  }

  const logoPreview = config.logoUrl ? (
    <img
      src={config.logoUrl}
      alt=""
      className="h-11 w-11 rounded-lg object-cover"
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  ) : (
    <span className="text-sm font-bold uppercase">
      {(config.logoText || deriveLogoText(config.appName)).slice(0, 3)}
    </span>
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Project name" error={errors.portalName}>
            <input
              value={config.portalName}
              onChange={(event) => update("portalName", event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
              placeholder="acme-admin"
            />
          </Field>

          <Field label="Auto-generated slug" error={errors.slug}>
            <input
              value={config.slug}
              onChange={(event) => update("slug", slugify(event.target.value))}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-slate-300 outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
              placeholder="portal-slug"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="App display name" error={errors.appName}>
            <input
              value={config.appName}
              onChange={(event) => update("appName", event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
              placeholder="Acme Admin"
            />
          </Field>

          <Field label="Industry">
            <select
              value={config.industry || "generic"}
              onChange={(event) => handleIndustryChange(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
            >
              {INDUSTRY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Theme preset">
            <select
              value={config.themePreset || "custom"}
              onChange={(event) => handleThemePresetChange(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
            >
              {THEME_PRESETS.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
              <option value="custom">Custom</option>
            </select>
          </Field>

          <Field label="Theme color" error={errors.themeColor}>
            <div className="mt-2 flex rounded-lg border border-white/10 bg-slate-950 p-1 focus-within:border-sky-400">
              <input
                type="color"
                value={config.themeColor}
                onChange={(event) =>
                  onChange({
                    ...config,
                    themePreset: "custom",
                    themeColor: event.target.value,
                  })
                }
                className="h-9 w-12 cursor-pointer border-0 bg-transparent"
                aria-label="Theme color"
              />
              <input
                value={config.themeColor}
                onChange={(event) =>
                  onChange({
                    ...config,
                    themePreset: "custom",
                    themeColor: event.target.value,
                  })
                }
                className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none"
                placeholder="#2563eb"
              />
            </div>
          </Field>

          <Field label="Logo URL">
            <input
              value={config.logoUrl || ""}
              onChange={(event) => update("logoUrl", event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
              placeholder="https://..."
            />
          </Field>

          <Field label="Fallback logo text">
            <input
              value={config.logoText || ""}
              onChange={(event) => update("logoText", event.target.value.toUpperCase())}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
              placeholder={deriveLogoText(config.appName)}
              maxLength={8}
            />
          </Field>
        </div>

        <Field label="Logo upload">
          <input
            type="file"
            accept="image/*"
            onChange={(event) => handleLogoFile(event.target.files?.[0])}
            className="mt-2 w-full rounded-lg border border-dashed border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-[var(--portal-accent)] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:border-[var(--portal-accent)]/40"
          />
          <span className="mt-1 block text-xs text-slate-500">
            Uploading stores the image in the generated portal config as a data URL.
          </span>
        </Field>

        <section className="rounded-xl border border-white/10 bg-slate-950/80 p-4 ring-1 ring-white/5">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--portal-accent)]/20 to-indigo-500/20 ring-1 ring-[var(--portal-accent)]/30">
              <Wand2 className="h-4 w-4 text-[var(--portal-accent)]" />
            </span>
            <h3 className="text-sm font-semibold text-white">Login Page Content</h3>
          </div>
          {errors.loginPage && (
            <p className="mb-3 rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
              {errors.loginPage}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Badge">
              <input
                value={loginPage.badge || ""}
                onChange={(event) => updateLogin("badge", event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
                placeholder="Customer Management"
              />
            </Field>
            <Field label="Highlight text">
              <input
                value={loginPage.highlightText || ""}
                onChange={(event) => updateLogin("highlightText", event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
                placeholder="customers"
              />
            </Field>
          </div>
          <Field label="Headline">
            <input
              value={loginPage.headline || ""}
              onChange={(event) => updateLogin("headline", event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
              placeholder="Manage your customers with ease"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={loginPage.description || ""}
              onChange={(event) => updateLogin("description", event.target.value)}
              className="mt-2 min-h-[88px] w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
              placeholder="Manage records, workflows, and operations from one place."
            />
          </Field>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-200">Features list</p>
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-[var(--portal-accent)] hover:border-[var(--portal-accent)]/40"
              >
                <Plus className="h-3.5 w-3.5" />
                Add feature
              </button>
            </div>
            {features.map((feature, index) => (
              <div key={`feature-${index}`} className="grid gap-2 rounded-lg border border-white/10 bg-slate-900 p-3 sm:grid-cols-[1fr_1.4fr_auto]">
                <input
                  value={feature.title || ""}
                  onChange={(event) => updateFeature(index, { title: event.target.value })}
                  className="rounded-md border border-white/10 bg-slate-950 px-2.5 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
                  placeholder="Secure Access"
                />
                <input
                  value={feature.description || ""}
                  onChange={(event) => updateFeature(index, { description: event.target.value })}
                  className="rounded-md border border-white/10 bg-slate-950 px-2.5 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
                  placeholder="Enterprise-grade authentication."
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="inline-flex items-center justify-center rounded-md border border-white/10 px-2.5 text-rose-300 hover:bg-rose-500/10"
                  aria-label="Remove feature"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 rounded-xl border border-white/10 bg-slate-950/80 p-4 ring-1 ring-white/5 sm:grid-cols-2">
          <Field label="Footer text">
            <input
              value={config.footer?.text || loginPage.footerText || ""}
              onChange={(event) => updateFooter(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
              placeholder="Powered by Acme"
            />
          </Field>
          <Field label="Company name">
            <input
              value={company.name || ""}
              onChange={(event) => updateCompany("name", event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
              placeholder="Acme Pvt Ltd"
            />
          </Field>
          <Field label="Company website">
            <input
              value={company.website || ""}
              onChange={(event) => updateCompany("website", event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
              placeholder="https://acme.example"
            />
          </Field>
          <Field label="Support email">
            <input
              value={company.supportEmail || ""}
              onChange={(event) => updateCompany("supportEmail", event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
              placeholder="support@acme.example"
            />
          </Field>
        </section>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <section className="rounded-xl border border-white/10 bg-gradient-to-b from-slate-900/60 to-slate-950/70 p-5 shadow-xl shadow-black/20 ring-1 ring-white/5">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg text-white"
              style={{ backgroundColor: config.themeColor }}
            >
              {logoPreview}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{config.appName}</p>
              <p className="truncate text-xs text-slate-400">/{config.slug || "portal"}</p>
            </div>
          </div>
          <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
            <div className="h-2" style={{ backgroundColor: config.themeColor }} />
            <div className="space-y-3 p-4">
              <div className="h-3 w-2/3 rounded bg-white/15" />
              <div className="h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-4/5 rounded bg-white/10" />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-gradient-to-b from-slate-900/60 to-slate-950/70 p-5 shadow-xl shadow-black/20 ring-1 ring-white/5">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Image className="h-4 w-4" />
            Login Preview
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--portal-accent)]">
            {loginPage.badge || "Portal"}
          </p>
          <h3 className="mt-3 text-2xl font-bold leading-tight text-white">
            {loginPage.headline || "Manage your operations with ease"}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            {loginPage.description || "Manage records and workflows from one dashboard."}
          </p>
          <div className="mt-4 grid gap-2">
            {features.slice(0, 2).map((feature, index) => (
              <div key={`preview-${index}`} className="rounded-lg border border-white/10 bg-slate-900 p-3">
                <p className="text-sm font-semibold text-white">{feature.title || "Feature title"}</p>
                <p className="mt-1 text-xs text-slate-400">{feature.description || "Feature description"}</p>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
