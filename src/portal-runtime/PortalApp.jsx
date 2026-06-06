import { AlertTriangle, ArrowRight, Loader2, LockKeyhole } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AppShell from "./engine/AppShell";
import CrudFormRenderer from "./engine/CrudFormRenderer";
import CrudListRenderer from "./engine/CrudListRenderer";
import { getPortalConfig, listRecords } from "./lib/dataClient";
import { applyPortalTheme } from "./lib/theme";

function PortalHome({ config, slug }) {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    let ignore = false;
    Promise.all(
      (config.modules || []).map((module) =>
        listRecords(slug, module.id, { page: 1, pageSize: 1 }).then((result) => [
          module.id,
          result.total || 0,
        ])
      )
    )
      .then((entries) => {
        if (!ignore) setCounts(Object.fromEntries(entries));
      })
      .catch(() => {
        if (!ignore) setCounts({});
      });
    return () => {
      ignore = true;
    };
  }, [config.modules, slug]);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Dashboard</p>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {config.appName}
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {(config.modules || []).map((module) => (
          <Link
            key={module.id}
            to={`/portal/${slug}/${module.id}`}
            className="group rounded-2xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-[var(--portal-accent)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-400">{module.pluralName}</p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {counts[module.id] ?? "-"}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <h2 className="text-sm font-semibold text-white">Configuration</h2>
        <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
          <div className="rounded-lg bg-white/5 p-3">
            Type: <span className="capitalize text-white">{config.type}</span>
          </div>
          <div className="rounded-lg bg-white/5 p-3">
            Auth:{" "}
            <span className="text-white">
              {config.auth?.method === "magic-link"
                ? "Magic Link"
                : "Email + Password"}
            </span>
          </div>
          <div className="rounded-lg bg-white/5 p-3">
            Modules: <span className="text-white">{config.modules?.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function AuthPlaceholder({ config }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
        <div
          className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-white"
          style={{ backgroundColor: "var(--portal-accent)" }}
        >
          <LockKeyhole className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-bold text-white">{config.appName}</h1>
        <p className="mt-2 text-sm text-slate-400">
          Auth screens are configured now and become fully interactive in Phase 2.
        </p>
        <Link
          to={`/portal/${config.slug}`}
          className="mt-6 inline-flex w-full justify-center rounded-lg bg-[var(--portal-accent)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Continue to portal
        </Link>
      </section>
    </main>
  );
}

export default function PortalApp() {
  const params = useParams();
  const slug = params.slug;
  const tail = params["*"] || "";
  const [state, setState] = useState({
    status: "loading",
    config: null,
    error: "",
  });

  useEffect(() => {
    let ignore = false;
    getPortalConfig(slug)
      .then((result) => {
        if (ignore) return;
        applyPortalTheme(result.config);
        setState({ status: "success", config: result.config, error: "" });
      })
      .catch((error) => {
        if (ignore) return;
        setState({ status: "error", config: null, error: error.message });
      });
    return () => {
      ignore = true;
    };
  }, [slug]);

  const route = useMemo(() => tail.split("/").filter(Boolean), [tail]);

  if (state.status === "loading") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-100">
        <div className="flex items-center gap-3 text-slate-300">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading portal
        </div>
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 px-4 text-slate-100">
        <section className="max-w-md rounded-2xl border border-rose-400/20 bg-rose-500/10 p-6 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-rose-200" />
          <h1 className="mt-3 text-lg font-semibold text-white">
            Portal not available
          </h1>
          <p className="mt-2 text-sm text-rose-100">{state.error}</p>
          <Link
            to="/"
            className="mt-5 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950"
          >
            Back to gallery
          </Link>
        </section>
      </main>
    );
  }

  const config = state.config;
  if (route[0] === "login") {
    return <AuthPlaceholder config={config} />;
  }

  const entity = route[0];
  const recordId = route[1];
  const module = entity
    ? (config.modules || []).find((item) => item.id === entity)
    : null;

  let content;
  if (!entity) {
    content = <PortalHome config={config} slug={slug} />;
  } else if (!module) {
    content = (
      <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <h1 className="text-lg font-semibold text-white">Module not found</h1>
        <p className="mt-2 text-sm text-slate-400">
          The config does not include a module named {entity}.
        </p>
      </section>
    );
  } else if (recordId) {
    content = (
      <CrudFormRenderer
        key={`${module.id}-${recordId}`}
        slug={slug}
        module={module}
        recordId={recordId}
      />
    );
  } else {
    content = <CrudListRenderer slug={slug} module={module} />;
  }

  return (
    <AppShell config={config} slug={slug}>
      {content}
    </AppShell>
  );
}
