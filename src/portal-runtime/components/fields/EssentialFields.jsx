import { ImageIcon, Upload } from "lucide-react";

function FieldShell({ field, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-sm font-medium text-slate-200">
        {field.label || field.key}
        {field.required && <span className="text-rose-300">*</span>}
      </span>
      {children}
      {field.helpText && !error && (
        <span className="mt-1 block text-xs text-slate-500">
          {field.helpText}
        </span>
      )}
      {error && <span className="mt-1 block text-xs text-rose-300">{error}</span>}
    </label>
  );
}

function baseClass(error) {
  return `w-full rounded-lg border bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60 ${
    error
      ? "border-rose-400/50 focus:border-rose-300"
      : "border-white/10 focus:border-[var(--portal-accent)]"
  }`;
}

function isDisabled(field, disabled) {
  return disabled || field.disabled || field.readOnly;
}

export function TextField({ field, value, onChange, error, disabled }) {
  return (
    <FieldShell field={field} error={error}>
      <input
        type="text"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        disabled={isDisabled(field, disabled)}
        readOnly={field.readOnly}
        className={baseClass(error)}
      />
    </FieldShell>
  );
}

export function EmailField(props) {
  return (
    <FieldShell field={props.field} error={props.error}>
      <input
        type="email"
        value={props.value ?? ""}
        onChange={(event) => props.onChange(event.target.value)}
        placeholder={props.field.placeholder || "name@example.com"}
        disabled={isDisabled(props.field, props.disabled)}
        readOnly={props.field.readOnly}
        className={baseClass(props.error)}
      />
    </FieldShell>
  );
}

export function PasswordField(props) {
  return (
    <FieldShell field={props.field} error={props.error}>
      <input
        type="password"
        value={props.value ?? ""}
        onChange={(event) => props.onChange(event.target.value)}
        placeholder={props.field.placeholder}
        disabled={isDisabled(props.field, props.disabled)}
        readOnly={props.field.readOnly}
        className={baseClass(props.error)}
      />
    </FieldShell>
  );
}

export function TextareaField({ field, value, onChange, error, disabled }) {
  return (
    <FieldShell field={field} error={error}>
      <textarea
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        disabled={isDisabled(field, disabled)}
        readOnly={field.readOnly}
        className={`${baseClass(error)} min-h-28 resize-y`}
      />
    </FieldShell>
  );
}

export function NumberField({ field, value, onChange, error, disabled }) {
  return (
    <FieldShell field={field} error={error}>
      <input
        type="number"
        value={value ?? ""}
        min={field.settings?.min ?? undefined}
        max={field.settings?.max ?? undefined}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        disabled={isDisabled(field, disabled)}
        readOnly={field.readOnly}
        className={baseClass(error)}
      />
    </FieldShell>
  );
}

export function CurrencyField(props) {
  return (
    <FieldShell field={props.field} error={props.error}>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
          INR
        </span>
        <input
          type="number"
          value={props.value ?? ""}
          min={props.field.settings?.min ?? undefined}
          max={props.field.settings?.max ?? undefined}
          onChange={(event) => props.onChange(event.target.value)}
          placeholder={props.field.placeholder}
          disabled={isDisabled(props.field, props.disabled)}
          readOnly={props.field.readOnly}
          className={`${baseClass(props.error)} pl-12`}
        />
      </div>
    </FieldShell>
  );
}

export function SelectField({ field, value, onChange, error, disabled }) {
  return (
    <FieldShell field={field} error={error}>
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        disabled={isDisabled(field, disabled)}
        className={baseClass(error)}
      >
        <option value="">Select...</option>
        {(field.options || []).filter(Boolean).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function MultiSelectField({ field, value, onChange, error, disabled }) {
  const current = Array.isArray(value) ? value : [];
  return (
    <FieldShell field={field} error={error}>
      <div className="grid gap-2 rounded-lg border border-white/10 bg-slate-950 p-3">
        {(field.options || []).filter(Boolean).map((option) => (
          <label key={option} className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={current.includes(option)}
              disabled={isDisabled(field, disabled)}
              onChange={(event) => {
                onChange(
                  event.target.checked
                    ? [...current, option]
                    : current.filter((item) => item !== option)
                );
              }}
              className="h-4 w-4 rounded border-white/20 bg-slate-900 accent-[var(--portal-accent)]"
            />
            {option}
          </label>
        ))}
      </div>
    </FieldShell>
  );
}

export function CheckboxField({ field, value, onChange, error, disabled }) {
  return (
    <FieldShell field={field} error={error}>
      <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(event) => onChange(event.target.checked)}
          disabled={isDisabled(field, disabled)}
          className="h-4 w-4 rounded border-white/20 bg-slate-900 accent-[var(--portal-accent)]"
        />
        Yes
      </label>
    </FieldShell>
  );
}

export function ToggleField(props) {
  return <CheckboxField {...props} />;
}

export function RadioField({ field, value, onChange, error, disabled }) {
  return (
    <FieldShell field={field} error={error}>
      <div className="grid gap-2 rounded-lg border border-white/10 bg-slate-950 p-3 sm:grid-cols-2">
        {(field.options || []).filter(Boolean).map((option) => (
          <label key={option} className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="radio"
              name={field.key}
              value={option}
              checked={value === option}
              disabled={isDisabled(field, disabled)}
              onChange={() => onChange(option)}
              className="h-4 w-4 border-white/20 bg-slate-900 accent-[var(--portal-accent)]"
            />
            {option}
          </label>
        ))}
      </div>
    </FieldShell>
  );
}

export function DateField({ field, value, onChange, error, disabled }) {
  return (
    <FieldShell field={field} error={error}>
      <input
        type="date"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        disabled={isDisabled(field, disabled)}
        readOnly={field.readOnly}
        className={baseClass(error)}
      />
    </FieldShell>
  );
}

export function FileField({ field, value, onChange, error, disabled }) {
  return (
    <FieldShell field={field} error={error}>
      <div className="rounded-lg border border-white/10 bg-slate-950 p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder="File URL or stored filename"
            disabled={isDisabled(field, disabled)}
            readOnly={field.readOnly}
            className={baseClass(error)}
          />
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm font-semibold text-slate-200 hover:border-[var(--portal-accent)]">
            <Upload className="h-4 w-4" />
            Pick
            <input
              type="file"
              accept={field.settings?.accept}
              disabled={isDisabled(field, disabled)}
              onChange={(event) =>
                onChange(event.target.files?.[0]?.name || value || "")
              }
              className="sr-only"
            />
          </label>
        </div>
      </div>
    </FieldShell>
  );
}

export function ImageField({ field, value, onChange, error, disabled }) {
  return (
    <FieldShell field={field} error={error}>
      <div className="grid gap-3 rounded-lg border border-white/10 bg-slate-950 p-3 sm:grid-cols-[72px_1fr]">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-slate-900">
          {value && /^https?:\/\//.test(value) ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-5 w-5 text-slate-500" />
          )}
        </div>
        <input
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Image URL"
          disabled={isDisabled(field, disabled)}
          readOnly={field.readOnly}
          className={baseClass(error)}
        />
      </div>
    </FieldShell>
  );
}

export function TagsField({ field, value, onChange, error, disabled }) {
  const tags = Array.isArray(value) ? value.join(", ") : value ?? "";
  return (
    <FieldShell field={field} error={error}>
      <input
        type="text"
        value={tags}
        onChange={(event) =>
          onChange(
            event.target.value
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          )
        }
        placeholder={field.placeholder || "tag one, tag two"}
        disabled={isDisabled(field, disabled)}
        readOnly={field.readOnly}
        className={baseClass(error)}
      />
    </FieldShell>
  );
}
