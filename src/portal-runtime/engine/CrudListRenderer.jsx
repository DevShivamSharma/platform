import {
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  deleteRecord,
  listRecords,
} from "../lib/dataClient";
import { formatCurrency, formatDate } from "../lib/utils";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { useTableEngine } from "./TableEngine";

function displayValue(field, value) {
  if (value === undefined || value === null || value === "") return "-";
  if (field.type === "currency") return formatCurrency(value);
  if (field.type === "date") return formatDate(value);
  if (field.type === "checkbox" || field.type === "toggle") {
    return value ? "Yes" : "No";
  }
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

export default function CrudListRenderer({ slug, module }) {
  const table = useTableEngine(10);
  const [state, setState] = useState({
    status: "loading",
    rows: [],
    total: 0,
    totalPages: 1,
    error: "",
  });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const columns = useMemo(() => {
    const selected = module.listColumns?.length
      ? module.listColumns
      : module.fields.slice(0, 5).map((field) => field.key);
    return selected
      .map((key) => module.fields.find((field) => field.key === key))
      .filter(Boolean);
  }, [module.fields, module.listColumns]);

  useEffect(() => {
    let ignore = false;
    setState((current) => ({ ...current, status: "loading", error: "" }));
    listRecords(slug, module.id, table.params)
      .then((result) => {
        if (ignore) return;
        setState({
          status: "success",
          rows: result.data || [],
          total: result.total || 0,
          totalPages: result.totalPages || 1,
          error: "",
        });
      })
      .catch((error) => {
        if (ignore) return;
        setState({
          status: "error",
          rows: [],
          total: 0,
          totalPages: 1,
          error: error.message,
        });
      });
    return () => {
      ignore = true;
    };
  }, [module.id, slug, table.params]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    try {
      await deleteRecord(slug, module.id, deleteTarget.id);
      setDeleteTarget(null);
      const result = await listRecords(slug, module.id, table.params);
      setState({
        status: "success",
        rows: result.data || [],
        total: result.total || 0,
        totalPages: result.totalPages || 1,
        error: "",
      });
    } catch (error) {
      setState((current) => ({ ...current, error: error.message }));
    } finally {
      setDeleteBusy(false);
    }
  }

  function exportRows() {
    const blob = new Blob([JSON.stringify(state.rows, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${module.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">{module.singularName} records</p>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {module.pluralName}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {module.tableFeatures?.export && (
            <button
              type="button"
              onClick={exportRows}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-white/20"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          )}
          <Link
            to={`/portal/${slug}/${module.id}/new`}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--portal-accent)] px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-black/20"
          >
            <Plus className="h-4 w-4" />
            Add {module.singularName}
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/70">
        <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          {module.tableFeatures?.search ? (
            <label className="relative block max-w-md flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={table.search}
                onChange={(event) => table.setSearch(event.target.value)}
                placeholder={`Search ${module.pluralName.toLowerCase()}`}
                className="w-full rounded-lg border border-white/10 bg-slate-950 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-[var(--portal-accent)]"
              />
            </label>
          ) : (
            <span className="text-sm text-slate-500">Search disabled</span>
          )}
          <div className="text-sm text-slate-400">{state.total} total</div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-slate-950/60">
              <tr>
                {columns.map((field) => (
                  <th
                    key={field.key}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
                  >
                    {module.tableFeatures?.sort ? (
                      <button
                        type="button"
                        onClick={() => table.toggleSort(field.key)}
                        className="inline-flex items-center gap-1 hover:text-white"
                      >
                        {field.label}
                        {table.sort === field.key && (
                          <span>{table.dir === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    ) : (
                      field.label
                    )}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {state.status === "loading" &&
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={`loading-${index}`}>
                    <td
                      colSpan={columns.length + 1}
                      className="px-4 py-4"
                    >
                      <div className="h-5 animate-pulse rounded bg-white/10" />
                    </td>
                  </tr>
                ))}

              {state.status === "error" && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-8 text-center text-sm text-rose-300"
                  >
                    {state.error}
                  </td>
                </tr>
              )}

              {state.status === "success" && state.rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-10 text-center text-sm text-slate-400"
                  >
                    No records yet.
                  </td>
                </tr>
              )}

              {state.status === "success" &&
                state.rows.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.03]">
                    {columns.map((field) => (
                      <td
                        key={field.key}
                        className="max-w-[280px] truncate px-4 py-3 text-sm text-slate-200"
                      >
                        {displayValue(field, row[field.key])}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          to={`/portal/${slug}/${module.id}/${row.id}`}
                          className="rounded-md p-2 text-slate-400 hover:bg-white/10 hover:text-white"
                          aria-label="Edit record"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(row)}
                          className="rounded-md p-2 text-rose-300 hover:bg-rose-500/10"
                          aria-label="Delete record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {module.tableFeatures?.pagination && (
          <div className="flex flex-col justify-between gap-3 border-t border-white/10 p-4 sm:flex-row sm:items-center">
            <label className="text-sm text-slate-400">
              Page size{" "}
              <select
                value={table.pageSize}
                onChange={(event) => table.setPageSize(Number(event.target.value))}
                className="ml-2 rounded-md border border-white/10 bg-slate-950 px-2 py-1 text-white outline-none"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => table.setPage(Math.max(1, table.page - 1))}
                disabled={table.page <= 1}
                className="rounded-md border border-white/10 p-2 text-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-slate-400">
                Page {table.page} of {state.totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  table.setPage(Math.min(state.totalPages, table.page + 1))
                }
                disabled={table.page >= state.totalPages}
                className="rounded-md border border-white/10 p-2 text-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {deleteTarget && (
        <DeleteConfirmModal
          title={`Delete ${module.singularName}?`}
          description={`Delete record ${deleteTarget.id}. This cannot be undone.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          busy={deleteBusy}
        />
      )}
    </section>
  );
}
