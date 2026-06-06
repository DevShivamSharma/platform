export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5174";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export function createPortal(config) {
  return request("/api/portal/create", {
    method: "POST",
    body: JSON.stringify(config),
  });
}

export function getPortalConfig(slug) {
  return request(`/api/portal/${encodeURIComponent(slug)}/config`);
}

export function listPortals() {
  return request("/api/portals");
}

export function listRecords(slug, entity, params = {}) {
  const url = new URL(`${API_BASE}/api/portal/${slug}/${entity}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  return request(url.pathname + url.search);
}

export function getRecord(slug, entity, id) {
  return request(
    `/api/portal/${encodeURIComponent(slug)}/${encodeURIComponent(
      entity
    )}/${encodeURIComponent(id)}`
  );
}

export function createRecord(slug, entity, record) {
  return request(
    `/api/portal/${encodeURIComponent(slug)}/${encodeURIComponent(entity)}`,
    {
      method: "POST",
      body: JSON.stringify(record),
    }
  );
}

export function updateRecord(slug, entity, id, record) {
  return request(
    `/api/portal/${encodeURIComponent(slug)}/${encodeURIComponent(
      entity
    )}/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(record),
    }
  );
}

export function deleteRecord(slug, entity, id) {
  return request(
    `/api/portal/${encodeURIComponent(slug)}/${encodeURIComponent(
      entity
    )}/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );
}
