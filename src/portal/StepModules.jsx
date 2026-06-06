import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  GripVertical,
  Plus,
  Settings,
  Trash2,
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

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950 p-4">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-white/20 bg-slate-900 accent-[var(--portal-accent)]"
      />
    </label>
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
              className="min-w-0 flex-1 rounded-md border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white outline-none focus:border-[var(--portal-accent)]"
              placeholder={`Option ${index + 1}`}
            />
            <button
              type="button"
              onClick={() =>
                onChange({ options: options.filter((_, i) => i !== index) })
              }
              className="rounded-md border border-white/10 px-2 text-slate-400 hover:text-white"
              aria-label="Remove option"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange({ options: [...options, ""] })}
          className="inline-flex w-fit items-center gap-2 rounded-md border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-[var(--portal-accent)] hover:border-[var(--portal-accent)]/40"
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
            className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white outline-none focus:border-[var(--portal-accent)]"
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
            className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white outline-none focus:border-[var(--portal-accent)]"
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
            className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white outline-none focus:border-[var(--portal-accent)]"
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
            className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white outline-none focus:border-[var(--portal-accent)]"
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
            className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white outline-none focus:border-[var(--portal-accent)]"
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
            className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white outline-none focus:border-[var(--portal-accent)]"
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
            className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white outline-none focus:border-[var(--portal-accent)]"
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
            className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-2 py-1.5 text-sm text-white outline-none focus:border-[var(--portal-accent)]"
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
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <Toggle
            checked={!!config.dashboard?.enabled}
            onChange={() =>
              updateConfig({
                dashboard: {
                  ...config.dashboard,
                  enabled: !config.dashboard?.enabled,
                },
              })
            }
            label="Dashboard"
          />
          {config.dashboard?.enabled && (
            <label className="mt-3 block text-xs font-medium text-slate-300">
              Dashboard template
              <select
                value={config.dashboard.template}
                onChange={(event) =>
                  updateConfig({
                    dashboard: {
                      ...config.dashboard,
                      template: event.target.value,
                    },
                  })
                }
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-[var(--portal-accent)]"
              >
                {dashboardTemplates.map((template) => (
                  <option key={template} value={template}>
                    {template}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <Toggle
          checked={!!config.profile?.enabled}
          onChange={() =>
            updateConfig({
              profile: {
                ...config.profile,
                enabled: !config.profile?.enabled,
              },
            })
          }
          label="Profile"
        />
      </div>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">CRUD Modules</h3>
          <p className="text-sm text-slate-400">
            Add any number of entities. The runtime builds navigation, tables,
            and forms from this config.
          </p>
          {errors.modules && (
            <span className="mt-1 block text-xs text-rose-300">
              {errors.modules}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() =>
            updateConfig({
              modules: [...modules, createModule("Item", "Items")],
            })
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg hover:opacity-95 transition"
          style={{
            backgroundColor: "var(--portal-accent)",
            boxShadow: "0 4px 12px rgba(var(--portal-accent-rgb), 0.25)"
          }}
        >
          <Plus className="h-4 w-4" />
          Add Module
        </button>
      </div>

      <div className="space-y-4">
        {modules.map((module, moduleIndex) => (
          <section
            key={module.id || moduleIndex}
            className="overflow-hidden rounded-xl border border-white/10 bg-slate-950"
          >
            <button
              type="button"
              onClick={() =>
                updateModule(moduleIndex, { collapsed: !module.collapsed })
              }
              className="flex w-full items-center justify-between gap-4 border-b border-white/10 px-4 py-3 text-left"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-300">
                    {module.fields?.length || 0} fields
                  </span>
                  <h4 className="font-semibold text-white">
                    {module.pluralName || "Untitled Module"}
                  </h4>
                </div>
                <p className="mt-1 text-xs text-slate-500">/{module.id}</p>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-slate-400 transition ${
                  module.collapsed ? "-rotate-90" : ""
                }`}
              />
            </button>

            {!module.collapsed && (
              <div className="space-y-5 p-4">
                <div className="grid gap-3 md:grid-cols-4">
                  <label className="text-xs font-medium text-slate-300">
                    Singular
                    <input
                      value={module.singularName}
                      onChange={(event) => {
                        const singularName = event.target.value;
                        updateModule(moduleIndex, {
                          singularName,
                          id: slugify(module.pluralName || singularName),
                        });
                      }}
                      className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-2 py-2 text-sm text-white outline-none focus:border-[var(--portal-accent)]"
                    />
                  </label>
                  <label className="text-xs font-medium text-slate-300">
                    Plural
                    <input
                      value={module.pluralName}
                      onChange={(event) => {
                        const pluralName = event.target.value;
                        updateModule(moduleIndex, {
                          pluralName,
                          id: slugify(pluralName || module.singularName),
                        });
                      }}
                      className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-2 py-2 text-sm text-white outline-none focus:border-[var(--portal-accent)]"
                    />
                  </label>
                  <label className="text-xs font-medium text-slate-300">
                    Icon
                    <select
                      value={module.icon}
                      onChange={(event) =>
                        updateModule(moduleIndex, { icon: event.target.value })
                      }
                      className="mt-1 w-full rounded-md border border-white/10 bg-slate-900 px-2 py-2 text-sm text-white outline-none focus:border-[var(--portal-accent)]"
                    >
                      {ICON_OPTIONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => deleteModule(moduleIndex)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-rose-400/20 px-3 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete module
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-semibold text-white">
                      Fields Builder
                    </h5>
                    <button
                      type="button"
                      onClick={() => {
                        const nextField = createField("New Field", "text");
                        replaceModule(moduleIndex, {
                          ...module,
                          fields: [...module.fields, nextField],
                        });
                      }}
                      className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-1.5 text-xs font-semibold text-[var(--portal-accent)] hover:border-[var(--portal-accent)]/45"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Field
                    </button>
                  </div>

                  {module.fields.map((field, fieldIndex) => (
                    <div
                      key={field.id || field.key || fieldIndex}
                      className="rounded-lg border border-white/10 bg-slate-900/80 p-3"
                    >
                      <div className="grid gap-3 xl:grid-cols-[28px_1fr_1fr_150px_100px_90px_140px]">
                        <div className="flex items-center text-slate-500">
                          <GripVertical className="h-4 w-4" />
                        </div>
                        <label className="text-xs font-medium text-slate-300">
                          Field label
                          <input
                            value={field.label}
                            onChange={(event) =>
                              handleFieldLabelChange(
                                moduleIndex,
                                fieldIndex,
                                event.target.value
                              )
                            }
                            className="mt-1 w-full rounded-md border border-white/10 bg-slate-950 px-2 py-2 text-sm text-white outline-none focus:border-[var(--portal-accent)]"
                          />
                        </label>
                        <label className="text-xs font-medium text-slate-300">
                          Field key
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
                            className="mt-1 w-full rounded-md border border-white/10 bg-slate-950 px-2 py-2 text-sm text-white outline-none focus:border-[var(--portal-accent)]"
                          />
                        </label>
                        <label className="text-xs font-medium text-slate-300">
                          Type
                          <select
                            value={field.type}
                            onChange={(event) =>
                              updateField(moduleIndex, fieldIndex, {
                                type: event.target.value,
                              })
                            }
                            className="mt-1 w-full rounded-md border border-white/10 bg-slate-950 px-2 py-2 text-sm text-white outline-none focus:border-[var(--portal-accent)]"
                          >
                            {ESSENTIAL_FIELD_TYPES.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="flex items-end gap-2 pb-2 text-xs font-medium text-slate-300">
                          <input
                            type="checkbox"
                            checked={!!field.required}
                            onChange={(event) =>
                              updateField(moduleIndex, fieldIndex, {
                                required: event.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-white/20 bg-slate-900 accent-sky-500"
                          />
                          Required
                        </label>
                        <label className="text-xs font-medium text-slate-300">
                          Width
                          <select
                            value={field.width || "full"}
                            onChange={(event) =>
                              updateField(moduleIndex, fieldIndex, {
                                width: event.target.value,
                              })
                            }
                            className="mt-1 w-full rounded-md border border-white/10 bg-slate-950 px-2 py-2 text-sm text-white outline-none focus:border-[var(--portal-accent)]"
                          >
                            {widthOptions.map((width) => (
                              <option key={width} value={width}>
                                {width}
                              </option>
                            ))}
                          </select>
                        </label>
                        <div className="flex items-end gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateField(moduleIndex, fieldIndex, {
                                optionsOpen: !field.optionsOpen,
                              })
                            }
                            className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-white/10 px-2 py-2 text-xs font-semibold text-slate-200 hover:border-[var(--portal-accent)]/40"
                          >
                            <Settings className="h-3.5 w-3.5" />
                            Options
                          </button>
                          <button
                            type="button"
                            onClick={() => moveField(moduleIndex, fieldIndex, -1)}
                            className="rounded-md border border-white/10 px-2 py-2 text-slate-400 hover:text-white"
                            aria-label="Move field up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveField(moduleIndex, fieldIndex, 1)}
                            className="rounded-md border border-white/10 px-2 py-2 text-slate-400 hover:text-white"
                            aria-label="Move field down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteField(moduleIndex, fieldIndex)}
                            className="rounded-md border border-white/10 px-2 py-2 text-rose-300 hover:bg-rose-500/10"
                            aria-label="Delete field"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {field.optionsOpen && (
                        <div className="mt-3">
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

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-slate-900/60 p-3">
                    <h5 className="text-sm font-semibold text-white">
                      List Columns
                    </h5>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {module.fields.map((field) => (
                        <label
                          key={field.key}
                          className="flex items-center gap-2 text-sm text-slate-300"
                        >
                          <input
                            type="checkbox"
                            checked={module.listColumns.includes(field.key)}
                            onChange={(event) => {
                              const listColumns = event.target.checked
                                ? [...module.listColumns, field.key]
                                : module.listColumns.filter(
                                    (key) => key !== field.key
                                  );
                              updateModule(moduleIndex, { listColumns });
                            }}
                            className="h-4 w-4 rounded border-white/20 bg-slate-900 accent-[var(--portal-accent)]"
                          />
                          {field.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-slate-900/60 p-3">
                    <h5 className="text-sm font-semibold text-white">
                      Table Features
                    </h5>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {Object.keys(module.tableFeatures).map((feature) => (
                        <label
                          key={feature}
                          className="flex items-center gap-2 text-sm capitalize text-slate-300"
                        >
                          <input
                            type="checkbox"
                            checked={!!module.tableFeatures[feature]}
                            onChange={(event) =>
                              updateModule(moduleIndex, {
                                tableFeatures: {
                                  ...module.tableFeatures,
                                  [feature]: event.target.checked,
                                },
                              })
                            }
                            className="h-4 w-4 rounded border-white/20 bg-slate-900 accent-[var(--portal-accent)]"
                          />
                          {feature}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
