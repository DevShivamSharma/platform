import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createRecord,
  getRecord,
  updateRecord,
} from "../lib/dataClient";
import { validateRecord } from "../lib/validation";
import { getFieldDefinition } from "./fieldRegistry";

function defaultValues(module) {
  const values = {};
  for (const field of module.fields || []) {
    const definition = getFieldDefinition(field.type);
    values[field.key] = Array.isArray(definition.defaultValue)
      ? [...definition.defaultValue]
      : definition.defaultValue;
  }
  return values;
}

function widthClass(width) {
  if (width === "half") return "md:col-span-6";
  if (width === "third") return "md:col-span-4";
  return "md:col-span-12";
}

export default function CrudFormRenderer({ slug, module, recordId }) {
  const navigate = useNavigate();
  const isEdit = !!recordId && recordId !== "new";
  const [values, setValues] = useState(() => defaultValues(module));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(isEdit ? "loading" : "idle");
  const [formError, setFormError] = useState("");

  const title = useMemo(
    () => `${isEdit ? "Edit" : "Create"} ${module.singularName}`,
    [isEdit, module.singularName]
  );

  useEffect(() => {
    if (!isEdit) return;
    let ignore = false;
    getRecord(slug, module.id, recordId)
      .then((result) => {
        if (ignore) return;
        setValues({ ...defaultValues(module), ...(result.data || {}) });
        setStatus("idle");
      })
      .catch((error) => {
        if (ignore) return;
        setFormError(error.message);
        setStatus("error");
      });
    return () => {
      ignore = true;
    };
  }, [isEdit, module, recordId, slug]);

  function updateValue(key, value) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    const result = validateRecord(module, values);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setStatus("saving");
    try {
      if (isEdit) {
        await updateRecord(slug, module.id, recordId, result.data);
      } else {
        await createRecord(slug, module.id, result.data);
      }
      navigate(`/portal/${slug}/${module.id}`);
    } catch (error) {
      setFormError(error.message);
      setStatus("idle");
    }
  }

  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link
            to={`/portal/${slug}/${module.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {module.pluralName}
          </Link>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white">
            {title}
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-6"
      >
        {status === "loading" ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-lg bg-white/10"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-12">
            {(module.fields || []).map((field) => {
              const FieldComponent = getFieldDefinition(field.type).component;
              return (
                <div key={field.key} className={widthClass(field.width)}>
                  <FieldComponent
                    field={field}
                    value={values[field.key]}
                    onChange={(value) => updateValue(field.key, value)}
                    error={errors[field.key]}
                    disabled={status === "saving"}
                  />
                </div>
              );
            })}
          </div>
        )}

        {formError && (
          <div className="mt-5 rounded-lg border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100">
            {formError}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Link
            to={`/portal/${slug}/${module.id}`}
            className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-white/20"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={status === "saving" || status === "loading"}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--portal-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "saving" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </button>
        </div>
      </form>
    </section>
  );
}
