import {
  Building2,
  Check,
  Eye,
  Fingerprint,
  Palette,
  Plus,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";

import {
  applyIndustryPreset,
  deriveLogoText,
  INDUSTRY_OPTIONS,
  slugify,
  THEME_PRESETS,
} from "./portalDefaults";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20";

function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-300">{label}</span>
      {children}
      {hint && !error && (
        <span className="mt-1 block text-xs text-slate-500">{hint}</span>
      )}
      {error && <span className="mt-1 block text-xs text-rose-300">{error}</span>}
    </label>
  );
}

function Section({ icon: Icon, title, description, error, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 ring-1 ring-white/5">
      <header className="flex items-start gap-3 border-b border-white/5 px-5 py-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[rgba(var(--portal-accent-rgb),0.12)] text-[var(--portal-accent)] ring-1 ring-[rgba(var(--portal-accent-rgb),0.25)]">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="mt-0.5 text-xs text-slate-400">{description}</p>
        </div>
      </header>
      <div className="space-y-4 p-5">
        {error && (
          <p className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
            {error}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

function renderHeadline(headline, highlightText) {
  const text = headline || "Manage your operations with ease";
  const highlight = (highlightText || "").trim();
  if (!highlight) return text;
  const index = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span style={{ color: "var(--portal-accent)" }}>
        {text.slice(index, index + highlight.length)}
      </span>
      {text.slice(index + highlight.length)}
    </>
  );
}

export default function StepBranding({ config, onChange, errors }) {
  const loginPage = config.loginPage || {};
  const features = loginPage.features?.length
    ? loginPage.features
    : [{ title: "", description: "" }];
  const company = config.company || {};
  const activePreset = THEME_PRESETS.some(
    (preset) => preset.value === config.themePreset
  )
    ? config.themePreset
    : "custom";

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

  function handleThemeColorChange(value) {
    onChange({
      ...config,
      themePreset: "custom",
      themeColor: value,
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

  const logoText = (config.logoText || deriveLogoText(config.appName)).slice(0, 3);
  const logoPreview = config.logoUrl ? (
    <img
      src={config.logoUrl}
      alt=""
      className="h-full w-full object-cover"
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  ) : (
    <span className="text-lg font-bold uppercase tracking-wider">{logoText}</span>
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        <Section
          icon={Fingerprint}
          title="Identity"
          description="How the portal is named internally and what users will see."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Project name" error={errors.portalName}>
              <input
                value={config.portalName}
                onChange={(event) => update("portalName", event.target.value)}
                className={inputClass}
                placeholder="acme-admin"
              />
            </Field>

            <Field
              label="URL slug"
              error={errors.slug}
              hint="Generated from the project name. Edit to override."
            >
              <div className="mt-1.5 flex items-center rounded-lg border border-white/10 bg-slate-950 transition hover:border-white/20 focus-within:border-[var(--portal-accent)] focus-within:ring-2 focus-within:ring-[var(--portal-accent)]/20">
                <span className="pl-3 text-sm text-slate-500">/</span>
                <input
                  value={config.slug}
                  onChange={(event) => update("slug", slugify(event.target.value))}
                  className="min-w-0 flex-1 bg-transparent px-1.5 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-500"
                  placeholder="portal-slug"
                />
              </div>
            </Field>

            <Field label="App display name" error={errors.appName}>
              <input
                value={config.appName}
                onChange={(event) => update("appName", event.target.value)}
                className={inputClass}
                placeholder="Acme Admin"
              />
            </Field>

            <Field
              label="Industry"
              hint="Changing the industry reloads preset modules and login copy."
            >
              <select
                value={config.industry || "generic"}
                onChange={(event) => handleIndustryChange(event.target.value)}
                className={inputClass}
              >
                {INDUSTRY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        <Section
          icon={Palette}
          title="Appearance"
          description="Pick an accent color and a logo. The whole runtime is themed from these."
          error={errors.themeColor}
        >
          <div>
            <span className="text-xs font-semibold text-slate-300">Theme color</span>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2" role="radiogroup" aria-label="Theme preset">
                {THEME_PRESETS.map((preset) => {
                  const isActive = activePreset === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      aria-label={preset.label}
                      title={preset.label}
                      onClick={() => handleThemePresetChange(preset.value)}
                      className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-slate-950 transition duration-200 hover:scale-105 ${
                        isActive ? "ring-white" : "ring-transparent hover:ring-white/40"
                      }`}
                      style={{ backgroundColor: preset.color }}
                    >
                      {isActive && <Check className="h-4 w-4 text-white" />}
                    </button>
                  );
                })}
              </div>
              <div
                className={`flex items-center rounded-lg border bg-slate-950 p-1 transition focus-within:border-[var(--portal-accent)] ${
                  activePreset === "custom"
                    ? "border-[var(--portal-accent)]"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <input
                  type="color"
                  value={config.themeColor}
                  onChange={(event) => handleThemeColorChange(event.target.value)}
                  className="h-8 w-10 cursor-pointer rounded-md border-0 bg-transparent"
                  aria-label="Custom theme color"
                />
                <input
                  value={config.themeColor}
                  onChange={(event) => handleThemeColorChange(event.target.value)}
                  className="w-24 bg-transparent px-2 font-mono text-sm text-white outline-none"
                  placeholder="#2563eb"
                  aria-label="Theme color hex"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start">
            <div>
              <span className="text-xs font-semibold text-slate-300">Logo</span>
              <div
                className="mt-1.5 flex h-[5.5rem] w-[5.5rem] items-center justify-center overflow-hidden rounded-xl text-white shadow-lg ring-1 ring-white/10"
                style={{ backgroundColor: config.themeColor }}
              >
                {logoPreview}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Logo URL">
                <input
                  value={config.logoUrl || ""}
                  onChange={(event) => update("logoUrl", event.target.value)}
                  className={inputClass}
                  placeholder="https://..."
                />
              </Field>
              <Field label="Fallback logo text" hint="Shown when no logo is set.">
                <input
                  value={config.logoText || ""}
                  onChange={(event) => update("logoText", event.target.value.toUpperCase())}
                  className={inputClass}
                  placeholder={deriveLogoText(config.appName)}
                  maxLength={8}
                />
              </Field>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-white/15 bg-slate-950 px-4 py-3 transition hover:border-[rgba(var(--portal-accent-rgb),0.5)] hover:bg-[rgba(var(--portal-accent-rgb),0.05)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--portal-accent)]/40 sm:col-span-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-300 ring-1 ring-white/10">
                  <Upload className="h-4 w-4" />
                </span>
                <span className="min-w-0 text-sm">
                  <span className="font-semibold text-white">Upload a logo</span>
                  <span className="block text-xs text-slate-500">
                    PNG, SVG or JPG under 750 KB. Stored in the config as a data URL.
                  </span>
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleLogoFile(event.target.files?.[0])}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </Section>

        <Section
          icon={Wand2}
          title="Login page content"
          description="The copy shown next to the sign-in form. Mirrored in the preview on the right."
          error={errors.loginPage}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Badge">
              <input
                value={loginPage.badge || ""}
                onChange={(event) => updateLogin("badge", event.target.value)}
                className={inputClass}
                placeholder="Customer Management"
              />
            </Field>
            <Field label="Highlight word" hint="A word in the headline to color with the accent.">
              <input
                value={loginPage.highlightText || ""}
                onChange={(event) => updateLogin("highlightText", event.target.value)}
                className={inputClass}
                placeholder="customers"
              />
            </Field>
          </div>
          <Field label="Headline">
            <input
              value={loginPage.headline || ""}
              onChange={(event) => updateLogin("headline", event.target.value)}
              className={inputClass}
              placeholder="Manage your customers with ease"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={loginPage.description || ""}
              onChange={(event) => updateLogin("description", event.target.value)}
              className={`${inputClass} min-h-[88px] resize-y`}
              placeholder="Manage records, workflows, and operations from one place."
            />
          </Field>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-300">Feature highlights</p>
                <p className="text-xs text-slate-500">Short benefit bullets. The first two are shown on the login page.</p>
              </div>
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-[var(--portal-accent)] transition hover:border-[rgba(var(--portal-accent-rgb),0.4)] hover:bg-[rgba(var(--portal-accent-rgb),0.08)]"
              >
                <Plus className="h-3.5 w-3.5" />
                Add feature
              </button>
            </div>
            {features.map((feature, index) => (
              <div
                key={`feature-${index}`}
                className="grid gap-2 rounded-lg border border-white/10 bg-slate-950/70 p-2.5 sm:grid-cols-[auto_1fr_1.4fr_auto] sm:items-center"
              >
                <span className="hidden h-8 w-8 items-center justify-center rounded-md bg-white/5 text-xs font-bold text-slate-400 sm:flex">
                  {index + 1}
                </span>
                <input
                  value={feature.title || ""}
                  onChange={(event) => updateFeature(index, { title: event.target.value })}
                  className="rounded-md border border-white/10 bg-slate-950 px-2.5 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
                  placeholder="Secure Access"
                  aria-label={`Feature ${index + 1} title`}
                />
                <input
                  value={feature.description || ""}
                  onChange={(event) => updateFeature(index, { description: event.target.value })}
                  className="rounded-md border border-white/10 bg-slate-950 px-2.5 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
                  placeholder="Enterprise-grade authentication."
                  aria-label={`Feature ${index + 1} description`}
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-white/10 text-slate-400 transition hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-300"
                  aria-label={`Remove feature ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Section>

        <Section
          icon={Building2}
          title="Company & footer"
          description="Contact details used in the footer and support links."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company name">
              <input
                value={company.name || ""}
                onChange={(event) => updateCompany("name", event.target.value)}
                className={inputClass}
                placeholder="Acme Pvt Ltd"
              />
            </Field>
            <Field label="Footer text">
              <input
                value={config.footer?.text || loginPage.footerText || ""}
                onChange={(event) => updateFooter(event.target.value)}
                className={inputClass}
                placeholder="Powered by Acme"
              />
            </Field>
            <Field label="Company website">
              <input
                value={company.website || ""}
                onChange={(event) => updateCompany("website", event.target.value)}
                className={inputClass}
                placeholder="https://acme.example"
              />
            </Field>
            <Field label="Support email">
              <input
                value={company.supportEmail || ""}
                onChange={(event) => updateCompany("supportEmail", event.target.value)}
                className={inputClass}
                placeholder="support@acme.example"
              />
            </Field>
          </div>
        </Section>
      </div>

      <aside className="space-y-3 xl:sticky xl:top-8 xl:self-start">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
          <span className="inline-flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Live preview
          </span>
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium normal-case tracking-normal text-slate-400">
            Login page
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/40 ring-1 ring-white/5">
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 border-b border-white/10 bg-slate-900/80 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-slate-500">
              /{config.slug || "portal"}/login
            </span>
          </div>

          {/* Brand panel */}
          <div
            className="relative overflow-hidden p-5"
            style={{
              background: `linear-gradient(160deg, ${config.themeColor} 0%, rgba(2, 6, 23, 0.96) 78%)`,
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
            <div className="relative">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-white/15 text-white ring-1 ring-white/25">
                  {config.logoUrl ? (
                    <img src={config.logoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-[11px] font-bold uppercase">{logoText}</span>
                  )}
                </div>
                <span className="truncate text-sm font-semibold text-white">
                  {config.appName || "My Portal"}
                </span>
              </div>
              <p className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                {loginPage.badge || "Portal"}
              </p>
              <h3 className="mt-3 text-xl font-bold leading-tight text-white">
                {renderHeadline(loginPage.headline, loginPage.highlightText)}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-200/80">
                {loginPage.description || "Manage records and workflows from one dashboard."}
              </p>
              <ul className="mt-4 space-y-2">
                {features.slice(0, 2).map((feature, index) => (
                  <li key={`preview-${index}`} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold text-white">
                        {feature.title || "Feature title"}
                      </span>
                      <span className="block text-[11px] text-slate-300/80">
                        {feature.description || "Feature description"}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form panel */}
          <div className="space-y-3 border-t border-white/10 p-5">
            <div>
              <div className="h-3 w-24 rounded bg-white/20" />
              <div className="mt-1.5 h-2 w-36 rounded bg-white/10" />
            </div>
            <div className="space-y-2">
              <div className="h-2 w-10 rounded bg-white/10" />
              <div className="h-8 rounded-md border border-white/10 bg-slate-900" />
            </div>
            <div className="space-y-2">
              <div className="h-2 w-14 rounded bg-white/10" />
              <div className="h-8 rounded-md border border-white/10 bg-slate-900" />
            </div>
            <div
              className="flex h-8 items-center justify-center rounded-md text-xs font-semibold text-white"
              style={{ backgroundColor: config.themeColor }}
            >
              Sign in
            </div>
            <p className="pt-1 text-center text-[10px] text-slate-500">
              {config.footer?.text || loginPage.footerText || "Powered by your company"}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
