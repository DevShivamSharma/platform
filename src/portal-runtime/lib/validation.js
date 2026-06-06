import { z } from "zod";

function numberSetting(value) {
  if (value === "" || value === undefined || value === null) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function optional(schema) {
  return z.preprocess(
    (value) => (value === "" ? undefined : value),
    schema.optional().nullable()
  );
}

function optionsFor(field) {
  return (field.options || []).map(String).filter(Boolean);
}

export function schemaForField(field) {
  const settings = field.settings || {};
  let schema;

  switch (field.type) {
    case "email":
      schema = z.string().email(`${field.label} must be a valid email.`);
      break;
    case "number":
    case "currency": {
      schema = z.coerce.number();
      const min = numberSetting(settings.min);
      const max = numberSetting(settings.max);
      if (min !== undefined) schema = schema.min(min);
      if (max !== undefined) schema = schema.max(max);
      break;
    }
    case "select":
    case "radio": {
      const options = optionsFor(field);
      schema = z.string();
      if (options.length) {
        schema = schema.refine((value) => options.includes(value), {
          message: `${field.label} must match a configured option.`,
        });
      }
      break;
    }
    case "multi-select":
    case "tags":
      schema = z.preprocess((value) => {
        if (Array.isArray(value)) return value;
        if (typeof value === "string") {
          return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
        return [];
      }, z.array(z.string()));
      break;
    case "checkbox":
    case "toggle":
      schema = z.boolean();
      break;
    case "date":
    case "file":
    case "image":
    case "password":
    case "textarea":
    case "text":
    default: {
      schema = z.string();
      const minLength = numberSetting(settings.minLength);
      const maxLength = numberSetting(settings.maxLength);
      if (minLength !== undefined) schema = schema.min(minLength);
      if (maxLength !== undefined) schema = schema.max(maxLength);
      break;
    }
  }

  if (field.required) {
    if (field.type === "multi-select" || field.type === "tags") {
      return schema.refine((value) => value.length > 0, {
        message: `${field.label} is required.`,
      });
    }
    if (field.type === "checkbox" || field.type === "toggle") {
      return schema;
    }
    return schema.refine((value) => value !== undefined && value !== "", {
      message: `${field.label} is required.`,
    });
  }

  return optional(schema);
}

export function buildRecordSchema(module) {
  const shape = {};
  for (const field of module.fields || []) {
    shape[field.key] = schemaForField(field);
  }
  return z.object(shape).strip();
}

export function validateRecord(module, record) {
  const result = buildRecordSchema(module).safeParse(record);
  if (result.success) return { success: true, data: result.data, errors: {} };

  const errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (key) errors[key] = issue.message;
  }
  return { success: false, data: null, errors };
}
