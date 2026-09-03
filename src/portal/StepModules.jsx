import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Columns3,
  Database,
  LayoutDashboard,
  Plus,
  Settings2,
  SlidersHorizontal,
  Trash2,
  UserRound,
} from "lucide-react";

import {
  createField,
  createModule,
  ESSENTIAL_FIELD_TYPES,
  ICON_OPTIONS,
  slugify,
} from "./portalDefaults";

const dashboardTemplates = ["stats-overview", "charts", "minimal"];
const widthOptions = ["full", "half", "third"];
const optionFieldTypes = new Set(["select", "multi-select", "radio"]);
const rangeFieldTypes = new Set(["number", "currency"]);
const textFieldTypes = new Set(["text", "textarea", "email", "phone"]);
const fileFieldTypes = new Set(["file", "image"]);

const inputClass =
  "mt-1 w-full rounded-md border border-white/10 bg-slate-950 px-2.5 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20";
const smallInputClass =
  "mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white outline-none transition hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20";
const iconButtonClass =
  "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-white/10 text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30";

function Switch({ checked, onChange, label }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="relative h-5 w-9 shrink-0 rounded-full bg-white/10 ring-1 ring-white/10 transition duration-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition after:duration-200 peer-checked:bg-[var(--portal-accent)] peer-checked:after:translate-x-4 peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--portal-accent)]/50" />
      {label && <span className="text-xs font-medium text-slate-300">{label}</span>}
    </label>
  );
}

function PillCheckbox({ checked, onChange, children }) {
  return (
    <label
      className={`inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--portal-accent)]/50 ${
        checked
          ? "border-[rgba(var(--portal-accent-rgb),0.5)] bg-[rgba(var(--portal-accent-rgb),0.15)] text-white"
          : "border-white/10 bg-slate-950 text-slate-400 hover:border-white/20 hover:text-slate-200"
      }`}
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      {checked ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
      {children}
    </label>
  );
}

function PageToggleCard({ icon: Icon, title, description, checked, onChange, children }) {
  return (
    <div
      className={`rounded-xl border p-4 transition duration-200 ${
        checked
          ? "border-[rgba(var(--portal-accent-rgb),0.35)] bg-[rgba(var(--portal-accent-rgb),0.06)]"
          : "border-white/10 bg-slate-950/60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 transition ${
              checked
                ? "bg-[rgba(var(--portal-accent-rgb),0.15)] text-[var(--portal-accent)] ring-[rgba(var(--portal-accent-rgb),0.3)]"
                : "bg-white/5 text-slate-400 ring-white/10"
            }`}
          >
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="mt-0.5 text-xs text-slate-400">{description}</p>
          </div>
        </div>
        <Switch checked={checked} onChange={onChange} />
      </div>
      {checked && children}
    </div>
  );
}

function TypeSettings({ field, onChange }) {
  const settings = field.settings || {};

  if (optionFieldTypes.has(field.type)) {
    const options = field.options?.length ? field.options : [""];
    return (
      <div className="grid gap-2 rounded-lg border border-white/10 bg-slate-950 p-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Options
        </p>
        {options.map((option, index) => (
          <div key={`${field.id}-option-${index}`} className="flex gap-2">
            <input
              value={option}
              onChange={(event) => {
                const next = [...options];
                next[index] = event.target.value;
                onChange({ options: next });
              }}
              className="min-w-0 flex-1 rounded-md border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white outline-none transition hover:border-white/20 focus:border-[var(--portal-accent)] focus:ring-2 focus:ring-[var(--portal-accent)]/20"
              placeholder={`Option ${index + 1}`}
              aria-label={`Option ${index + 1}`}
            />
            <button
              type="button"
              onClick={() =>
                onChange({ options: options.filter((_, i) => i !== index) })
              }
              className={iconButtonClass}
              aria-label="Remove option"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange({ options: [...options, ""] })}
          className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-[var(--portal-accent)] transition hover:border-[rgba(var(--portal-accent-rgb),0.4)] hover:bg-[rgba(var(--portal-accent-rgb),0.08)]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add option
        </button>
      </div>
    );
  }

  if (rangeFieldTypes.has(field.type)) {
    return (
      <div className="grid gap-3 rounded-lg border border-white/10 bg-slate-950 p-3 sm:grid-cols-2">
        <label className="text-xs font-medium text-slate-300">
          Min
          <input
            type="number"
            value={settings.min ?? ""}
            onChange={(event) =>
              onChange({
                settings: { ...settings, min: event.target.value },
              })
            }
            className={smallInputClass}
          />
        </label>
        <label className="text-xs font-medium text-slate-300">
          Max
          <input
            type="number"
            value={settings.max ?? ""}
            onChange={(event) =>
              onChange({
                settings: { ...settings, max: event.target.value },
              })
            }
            className={smallInputClass}
          />
        </label>
      </div>
    );
  }

  if (textFieldTypes.has(field.type)) {
    return (
      <div className="grid gap-3 rounded-lg border border-white/10 bg-slate-950 p-3 sm:grid-cols-3">
        <label className="text-xs font-medium text-slate-300">
          Placeholder
          <input
            value={field.placeholder || ""}
            onChange={(event) => onChange({ placeholder: event.target.value })}
            className={smallInputClass}
          />
        </label>
        <label className="text-xs font-medium text-slate-300">
          Min length
          <input
            type="number"
            value={settings.minLength ?? ""}
            onChange={(event) =>
              onChange({
                settings: { ...settings, minLength: event.target.value },
              })
            }
            className={smallInputClass}
          />
        </label>
        <label className="text-xs font-medium text-slate-300">
          Max length
          <input
            type="number"
            value={settings.maxLength ?? ""}
            onChange={(event) =>
              onChange({
                settings: { ...settings, maxLength: event.target.value },
              })
            }
            className={smallInputClass}
          />
        </label>
      </div>
    );
  }

  if (fileFieldTypes.has(field.type)) {
    return (
      <div className="grid gap-3 rounded-lg border border-white/10 bg-slate-950 p-3 sm:grid-cols-2">
        <label className="text-xs font-medium text-slate-300">
          Accept types
          <input
            value={settings.accept || ""}
            onChange={(event) =>
              onChange({ settings: { ...settings, accept: event.target.value } })
            }
            className={smallInputClass}
            placeholder="image/*,.pdf"
          />
        </label>
        <label className="text-xs font-medium text-slate-300">
          Max size MB
          <input
            type="number"
            value={settings.maxSizeMb ?? ""}
            onChange={(event) =>
              onChange({
                settings: { ...settings, maxSizeMb: event.target.value },
              })
            }
            className={smallInputClass}
          />
        </label>
      </div>
    );
  }

  if (field.type === "date") {
    return (
      <div className="rounded-lg border border-white/10 bg-slate-950 p-3">
        <label className="text-xs font-medium text-slate-300">
          Display format
          <input
            value={settings.displayFormat || "dd MMM yyyy"}
            onChange={(event) =>
              onChange({
                settings: { ...settings, displayFormat: event.target.value },
              })
            }
            className={smallInputClass}
          />
        </label>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-white/10 bg-slate-950 p-3 text-xs text-slate-400">
      No extra settings for this field type.
    </div>
  );
}

export default function StepModules({ config, onChange, errors }) {
  const modules = config.modules || [];

  function updateConfig(patch) {
    onChange({ ...config, ...patch });
  }

  function updateModule(index, patch) {
    const nextModules = modules.map((module, moduleIndex) =>
      moduleIndex === index ? { ...module, ...patch } : module
    );
    updateConfig({ modules: nextModules });
  }

  function replaceModule(index, nextModule) {
    const nextModules = modules.map((module, moduleIndex) =>
      moduleIndex === index ? nextModule : module
    );
    updateConfig({ modules: nextModules });
  }

  function addModule() {
    updateConfig({
      modules: [...modules, createModule("Item", "Items")],
    });
  }

  function deleteModule(index) {
    if (!window.confirm("Delete this module and all of its fields?")) return;
    updateConfig({ modules: modules.filter((_, i) => i !== index) });
  }

  function updateField(moduleIndex, fieldIndex, patch) {
    const module = modules[moduleIndex];
    const fields = module.fields.map((field, index) =>
      index === fieldIndex ? { ...field, ...patch } : field
    );
    updateModule(moduleIndex, { fields });
  }

  function deleteField(moduleIndex, fieldIndex) {
    if (!window.confirm("Delete this field?")) return;
    const module = modules[moduleIndex];
    const deletedKey = module.fields[fieldIndex]?.key;
    const fields = module.fields.filter((_, index) => index !== fieldIndex);
    updateModule(moduleIndex, {
      fields,
      listColumns: module.listColumns.filter((key) => key !== deletedKey),
    });
  }

  function moveField(moduleIndex, fieldIndex, direction) {
    const module = modules[moduleIndex];
    const nextIndex = fieldIndex + direction;
    if (nextIndex < 0 || nextIndex >= module.fields.length) return;
    const fields = [...module.fields];
    const [field] = fields.splice(fieldIndex, 1);
    fields.splice(nextIndex, 0, field);
    updateModule(moduleIndex, { fields });
  }

  function handleFieldLabelChange(moduleIndex, fieldIndex, value) {
    const field = modules[moduleIndex].fields[fieldIndex];
    const oldKey = slugify(field.label).replace(/-/g, "_");
    const patch = { label: value };
    if (!field.key || field.key === oldKey) {
      patch.key = slugify(value).replace(/-/g, "_");
    }
    updateField(moduleIndex, fieldIndex, patch);
  }

  return (
    <div className="space-y-8">
      {/* Built-in pages */}
      <section>
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-white">Built-in pages</h3>
          <p className="text-xs text-slate-400">
            Optional pages the runtime ships alongside your modules.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <PageToggleCard
            icon={LayoutDashboard}
            title="Dashboard"
            description="Landing page with stats and charts built from your modules."
            checked={!!config.dashboard?.enabled}
            onChange={() =>
              updateConfig({
                dashboard: {
                  ...config.dashboard,
                  enabled: !config.dashboard?.enabled,
                },
              })
            }
          >
            <label className="mt-4 block text-xs font-medium text-slate-300">
              Dashboard template
              <select
                value={config.dashboard?.template}
                onChange={(event) =>
                  updateConfig({
                    dashboard: {
                      ...config.dashboard,
                      template: event.target.value,
                    },
                  })
                }
                className={inputClass}
              >
                {dashboardTemplates.map((template) => (
                  <option key={template} value={template}>
                    {template}
                  </option>
                ))}
              </select>
            </label>
          </PageToggleCard>

          <PageToggleCard
            icon={UserRound}
            title="Profile"
            description="Lets signed-in users view and edit their own account details."
            checked={!!config.profile?.enabled}
            onChange={() =>
              updateConfig({
                profile: {
                  ...config.profile,
                  enabled: !config.profile?.enabled,
                },
              })
            }
          />
        </div>
      </section>

      {/* CRUD modules */}
      <section>
        <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h3 className="text-sm font-semibold text-white">
              CRUD modules
              <span className="ml-2 rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-medium text-slate-400 ring-1 ring-white/10">
                {modules.length}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Each module becomes a navigation item, a table, and a form in the generated portal.
            </p>
          </div>
          <button
            type="button"
            onClick={addModule}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.98]"
            style={{
              backgroundColor: "var(--portal-accent)",
              boxShadow: "0 4px 12px rgba(var(--portal-accent-rgb), 0.25)",
            }}
          >
            <Plus className="h-4 w-4" />
            Add module
          </button>
        </div>

        {errors.modules && (
          <p className="mb-3 rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
            {errors.modules}
          </p>
        )}

        {modules.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/15 bg-slate-950/40 px-6 py-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-400 ring-1 ring-white/10">
              <Database className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm font-semibold text-white">No modules yet</p>
            <p className="mt-1 max-w-sm text-xs text-slate-400">
              Add your first entity, like Customers or Orders, and describe its fields.
            </p>
            <button
              type="button"
              onClick={addModule}
              className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-[var(--portal-accent)] transition hover:border-[rgba(var(--portal-accent-rgb),0.4)]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add module
            </button>
          </div>
        )}

        <div className="space-y-4">
          {modules.map((module, moduleIndex) => (
            <section
              key={module.id || moduleIndex}
              className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 ring-1 ring-white/5"
            >
              <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
                <button
                  type="button"
                  onClick={() =>
                    updateModule(moduleIndex, { collapsed: !module.collapsed })
                  }
                  aria-expanded={!module.collapsed}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(var(--portal-accent-rgb),0.12)] text-[var(--portal-accent)] ring-1 ring-[rgba(var(--portal-accent-rgb),0.25)]">
                    <Database className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-white">
                        {module.pluralName || "Untitled module"}
                      </span>
                      <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-400 ring-1 ring-white/10">
                        {module.fields?.length || 0} fields
                      </span>
                    </span>
                    <span className="block truncate text-xs text-slate-500">
                      /{module.id}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteModule(moduleIndex)}
                  className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-white/10 text-slate-400 transition hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-300"
                  aria-label={`Delete ${module.pluralName || "module"}`}
                  title="Delete module"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateModule(moduleIndex, { collapsed: !module.collapsed })
                  }
                  className={iconButtonClass}
                  aria-label={module.collapsed ? "Expand module" : "Collapse module"}
                >
                  <ChevronDown
                    className={`h-4 w-4 transition duration-200 ${
                      module.collapsed ? "-rotate-90" : ""
                    }`}
                  />
                </button>
              </div>

              {!module.collapsed && (
                <div className="space-y-6 p-4 sm:p-5">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="text-xs font-medium text-slate-300">
                      Singular name
                      <input
                        value={module.singularName}
                        onChange={(event) => {
                          const singularName = event.target.value;
                          updateModule(moduleIndex, {
                            singularName,
                            id: slugify(module.pluralName || singularName),
                          });
                        }}
                        className={inputClass}
                        placeholder="Customer"
                      />
                    </label>
                    <label className="text-xs font-medium text-slate-300">
                      Plural name
                      <input
                        value={module.pluralName}
                        onChange={(event) => {
                          const pluralName = event.target.value;
                          updateModule(moduleIndex, {
                            pluralName,
                            id: slugify(pluralName || module.singularName),
                          });
                        }}
                        className={inputClass}
                        placeholder="Customers"
                      />
                    </label>
                    <label className="text-xs font-medium text-slate-300">
                      Navigation icon
                      <select
                        value={module.icon}
                        onChange={(event) =>
                          updateModule(moduleIndex, { icon: event.target.value })
                        }
                        className={inputClass}
                      >
                        {ICON_OPTIONS.map((icon) => (
                          <option key={icon} value={icon}>
                            {icon}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Columns3 className="h-4 w-4 text-slate-400" />
                        <h5 className="text-sm font-semibold text-white">Fields</h5>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nextField = createField("New Field", "text");
                          replaceModule(moduleIndex, {
                            ...module,
                            fields: [...module.fields, nextField],
                          });
                        }}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/10 px-3 py-1.5 text-xs font-semibold text-[var(--portal-accent)] transition hover:border-[rgba(var(--portal-accent-rgb),0.45)] hover:bg-[rgba(var(--portal-accent-rgb),0.08)]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add field
                      </button>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/70">
                      <div className="hidden grid-cols-[2rem_1.3fr_1.1fr_1fr_0.7fr_auto_auto] items-center gap-3 border-b border-white/10 bg-white/[0.02] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 md:grid">
                        <span>#</span>
                        <span>Label</span>
                        <span>Key</span>
                        <span>Type</span>
                        <span>Width</span>
                        <span className="w-16">Required</span>
                        <span className="w-[8.5rem] text-right">Actions</span>
                      </div>

                      {module.fields.length === 0 && (
                        <p className="px-4 py-6 text-center text-xs text-slate-500">
                          No fields yet. Add one to get started.
                        </p>
                      )}

                      <div className="divide-y divide-white/5">
                        {module.fields.map((field, fieldIndex) => (
                          <div
                            key={field.id || field.key || fieldIndex}
                            className={`transition ${field.optionsOpen ? "bg-white/[0.02]" : "hover:bg-white/[0.015]"}`}
                          >
                            <div className="grid gap-3 p-3 md:grid-cols-[2rem_1.3fr_1.1fr_1fr_0.7fr_auto_auto] md:items-center">
                              <span className="hidden h-7 w-7 items-center justify-center rounded-md bg-white/5 text-xs font-bold text-slate-400 md:flex">
                                {fieldIndex + 1}
                              </span>
                              <label className="block text-xs font-medium text-slate-300">
                                <span className="md:sr-only">Field label</span>
                                <input
                                  value={field.label}
                                  onChange={(event) =>
                                    handleFieldLabelChange(
                                      moduleIndex,
                                      fieldIndex,
                                      event.target.value
                                    )
                                  }
                                  className={`${inputClass} md:mt-0`}
                                  placeholder="Label"
                                  aria-label="Field label"
                                />
                              </label>
                              <label className="block text-xs font-medium text-slate-300">
                                <span className="md:sr-only">Field key</span>
                                <input
                                  value={field.key}
                                  onChange={(event) =>
                                    updateField(moduleIndex, fieldIndex, {
                                      key: slugify(event.target.value).replace(
                                        /-/g,
                                        "_"
                                      ),
                                    })
                                  }
                                  className={`${inputClass} font-mono text-xs md:mt-0`}
                                  placeholder="key"
                                  aria-label="Field key"
                                />
                              </label>
                              <label className="block text-xs font-medium text-slate-300">
                                <span className="md:sr-only">Type</span>
                                <select
                                  value={field.type}
                                  onChange={(event) =>
                                    updateField(moduleIndex, fieldIndex, {
                                      type: event.target.value,
                                    })
                                  }
                                  className={`${inputClass} md:mt-0`}
                                  aria-label="Field type"
                                >
                                  {ESSENTIAL_FIELD_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                      {type.label}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <label className="block text-xs font-medium text-slate-300">
                                <span className="md:sr-only">Width</span>
                                <select
                                  value={field.width || "full"}
                                  onChange={(event) =>
                                    updateField(moduleIndex, fieldIndex, {
                                      width: event.target.value,
                                    })
                                  }
                                  className={`${inputClass} capitalize md:mt-0`}
                                  aria-label="Field width"
                                >
                                  {widthOptions.map((width) => (
                                    <option key={width} value={width}>
                                      {width}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <div className="flex h-9 w-16 items-center">
                                <Switch
                                  checked={!!field.required}
                                  onChange={(event) =>
                                    updateField(moduleIndex, fieldIndex, {
                                      required: event.target.checked,
                                    })
                                  }
                                  label={<span className="md:sr-only">Required</span>}
                                />
                              </div>
                              <div className="flex items-center justify-end gap-1 md:w-[8.5rem]">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateField(moduleIndex, fieldIndex, {
                                      optionsOpen: !field.optionsOpen,
                                    })
                                  }
                                  className={`${iconButtonClass} ${
                                    field.optionsOpen
                                      ? "border-[rgba(var(--portal-accent-rgb),0.5)] bg-[rgba(var(--portal-accent-rgb),0.15)] text-white"
                                      : ""
                                  }`}
                                  aria-label="Field settings"
                                  aria-expanded={!!field.optionsOpen}
                                  title="Field settings"
                                >
                                  <Settings2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveField(moduleIndex, fieldIndex, -1)}
                                  disabled={fieldIndex === 0}
                                  className={iconButtonClass}
                                  aria-label="Move field up"
                                  title="Move up"
                                >
                                  <ArrowUp className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveField(moduleIndex, fieldIndex, 1)}
                                  disabled={fieldIndex === module.fields.length - 1}
                                  className={iconButtonClass}
                                  aria-label="Move field down"
                                  title="Move down"
                                >
                                  <ArrowDown className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteField(moduleIndex, fieldIndex)}
                                  className={`${iconButtonClass} hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-300`}
                                  aria-label="Delete field"
                                  title="Delete field"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            {field.optionsOpen && (
                              <div className="px-3 pb-3 md:pl-[3.25rem]">
                                <TypeSettings
                                  field={field}
                                  onChange={(patch) =>
                                    updateField(moduleIndex, fieldIndex, patch)
                                  }
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
                      <div className="flex items-center gap-2">
                        <Columns3 className="h-4 w-4 text-slate-400" />
                        <h5 className="text-sm font-semibold text-white">List columns</h5>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Fields shown as columns in the table view.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {module.fields.map((field) => (
                          <PillCheckbox
                            key={field.key}
                            checked={module.listColumns.includes(field.key)}
                            onChange={(event) => {
                              const listColumns = event.target.checked
                                ? [...module.listColumns, field.key]
                                : module.listColumns.filter(
                                    (key) => key !== field.key
                                  );
                              updateModule(moduleIndex, { listColumns });
                            }}
                          >
                            {field.label || field.key}
                          </PillCheckbox>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                        <h5 className="text-sm font-semibold text-white">Table features</h5>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Behaviours available on the list page.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.keys(module.tableFeatures).map((feature) => (
                          <PillCheckbox
                            key={feature}
                            checked={!!module.tableFeatures[feature]}
                            onChange={(event) =>
                              updateModule(moduleIndex, {
                                tableFeatures: {
                                  ...module.tableFeatures,
                                  [feature]: event.target.checked,
                                },
                              })
                            }
                          >
                            <span className="capitalize">{feature}</span>
                          </PillCheckbox>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
