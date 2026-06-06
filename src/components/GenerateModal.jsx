import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  Clipboard,
  Code2,
  Copy,
  ExternalLink,
  FileJson,
  Globe,
  Loader2,
  Mail,
  PencilLine,
  RefreshCw,
  Rocket,
  Sparkles,
  Wand2,
  Wrench,
  X,
} from "lucide-react";

const API_BASE = "http://localhost:5174";

const INPUT_MODES = [
  { id: "ai", label: "✨ AI Generate", icon: Sparkles, accent: "violet" },
  { id: "json", label: "📋 Paste JSON", icon: FileJson, accent: "emerald" },
  { id: "manual", label: "📝 Manual Form", icon: PencilLine, accent: "amber" },
];

const JSON_PLACEHOLDER = `Paste your content.json here...

{
  "siteName": "Your Name",
  "profile": {
    "firstName": "Your",
    "fullName": "Your Name",
    "role": "Frontend Developer",
    "heroHeadline": "Building polished web apps",
    "heroSummary": "Frontend developer focused on clean React interfaces."
  },
  "skills": {
    "Frontend": ["React", "Tailwind CSS"]
  },
  "projects": [
    {
      "id": "project-1",
      "title": "Portfolio Builder",
      "description": "A tool for generating clean portfolio websites.",
      "tech": ["React", "Node.js"],
      "type": "web",
      "featured": true
    }
  ]
}`;

// Inline GitHub mark - lucide-react does not include brand icons.
function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.73.5.99 5.24.99 11.51c0 4.85 3.14 8.96 7.5 10.42.55.1.75-.24.75-.53 0-.26-.01-.95-.02-1.87-3.05.66-3.69-1.47-3.69-1.47-.5-1.27-1.22-1.61-1.22-1.61-1-.68.08-.67.08-.67 1.1.08 1.69 1.13 1.69 1.13.98 1.68 2.58 1.2 3.21.92.1-.71.39-1.2.7-1.48-2.44-.28-5-1.22-5-5.43 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.93 0 0 .92-.29 3.02 1.12a10.5 10.5 0 0 1 5.5 0c2.1-1.41 3.02-1.12 3.02-1.12.6 1.53.22 2.65.11 2.93.7.77 1.13 1.75 1.13 2.95 0 4.22-2.57 5.15-5.02 5.42.4.34.76 1.02.76 2.05 0 1.48-.01 2.67-.01 3.03 0 .29.2.64.76.53A11.02 11.02 0 0 0 23 11.51C23 5.24 18.26.5 12 .5z" />
    </svg>
  );
}

async function generateConfig({ description, templateId }) {
  const res = await fetch(`${API_BASE}/api/generate-config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, templateId }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return { config: data.config, warnings: data.warnings || [] };
}

async function validateConfig(config) {
  const res = await fetch(`${API_BASE}/api/validate-config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ config }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return { config: data.config, warnings: data.warnings || [] };
}

async function fetchSchemaReference() {
  const res = await fetch(`${API_BASE}/api/schema`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data.schema;
}

async function generateProject({ templateId, projectName, config }) {
  const res = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ templateId, projectName, config }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

async function pushToGithub({ projectName, repoName, description, isPrivate }) {
  const res = await fetch(`${API_BASE}/api/push`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectName, repoName, description, private: isPrivate }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

async function deployToVercel({ repoName, owner }) {
  const res = await fetch(`${API_BASE}/api/deploy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repoName, owner }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

export default function GenerateModal({ template, onClose }) {
  const [screen, setScreen] = useState("describe");
  const [direction, setDirection] = useState(1);
  const [activeMode, setActiveMode] = useState("ai");
  const [sourceMode, setSourceMode] = useState("ai");

  const [projectName, setProjectName] = useState(
    () => `${template.id}-${Date.now().toString().slice(-5)}`
  );
  const [description, setDescription] = useState("");
  const [pasteJson, setPasteJson] = useState("");
  const [siteName, setSiteName] = useState("My New Site");
  const [siteDescription, setSiteDescription] = useState(
    "Built with the platform builder"
  );

  const [aiStatus, setAiStatus] = useState("idle");
  const [aiError, setAiError] = useState(null);
  const [pasteStatus, setPasteStatus] = useState("idle");
  const [pasteError, setPasteError] = useState(null);
  const [manualStatus, setManualStatus] = useState("idle");
  const [manualError, setManualError] = useState(null);

  const [config, setConfig] = useState(null);
  const [validationWarnings, setValidationWarnings] = useState([]);
  const [editingJson, setEditingJson] = useState(false);
  const [jsonDraft, setJsonDraft] = useState("");
  const [jsonError, setJsonError] = useState(null);
  const [jsonSaving, setJsonSaving] = useState(false);

  const [schemaOpen, setSchemaOpen] = useState(false);
  const [schemaStatus, setSchemaStatus] = useState("idle");
  const [schema, setSchema] = useState(null);
  const [schemaError, setSchemaError] = useState(null);
  const [copyStatus, setCopyStatus] = useState("");

  const [genStatus, setGenStatus] = useState("idle");
  const [genResult, setGenResult] = useState(null);
  const [genError, setGenError] = useState(null);

  const [pushStatus, setPushStatus] = useState("idle");
  const [pushResult, setPushResult] = useState(null);
  const [pushError, setPushError] = useState(null);

  const [deployStatus, setDeployStatus] = useState("idle");
  const [deployResult, setDeployResult] = useState(null);
  const [deployError, setDeployError] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (schemaOpen) {
        setSchemaOpen(false);
      } else {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, schemaOpen]);

  function goTo(next, dir = 1) {
    setDirection(dir);
    setScreen(next);
  }

  function setValidatedResult(nextConfig, warnings, mode) {
    setConfig(nextConfig);
    setValidationWarnings(warnings || []);
    setJsonDraft(JSON.stringify(nextConfig, null, 2));
    setJsonError(null);
    setEditingJson(false);
    setSourceMode(mode);
    goTo("review", 1);
  }

  async function openSchemaReference() {
    setSchemaOpen(true);
    if (schema || schemaStatus === "loading") return;
    setSchemaStatus("loading");
    setSchemaError(null);
    try {
      const nextSchema = await fetchSchemaReference();
      setSchema(nextSchema);
      setSchemaStatus("idle");
    } catch (err) {
      setSchemaError(err.message);
      setSchemaStatus("error");
    }
  }

  async function handleGenerateAI() {
    if (!description.trim()) {
      setAiError("Please describe yourself first.");
      return;
    }
    setAiStatus("loading");
    setAiError(null);
    try {
      const { config: nextConfig, warnings } = await generateConfig({
        description: description.trim(),
        templateId: template.id,
      });
      setAiStatus("idle");
      setValidatedResult(nextConfig, warnings, "ai");
    } catch (err) {
      console.error("[builder] AI config failed:", err);
      setAiError(err.message);
      setAiStatus("error");
    }
  }

  async function handleValidateJson() {
    if (!pasteJson.trim()) {
      setPasteError("Invalid JSON - check syntax: nothing pasted.");
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(pasteJson);
    } catch (err) {
      setPasteError(formatJsonParseError(err, pasteJson));
      return;
    }

    setPasteStatus("loading");
    setPasteError(null);
    try {
      const { config: nextConfig, warnings } = await validateConfig(parsed);
      setPasteStatus("idle");
      setValidatedResult(nextConfig, warnings, "json");
    } catch (err) {
      setPasteError(err.message);
      setPasteStatus("error");
    }
  }

  async function handleManualPreview(e) {
    e.preventDefault();
    setManualStatus("loading");
    setManualError(null);
    try {
      const manualConfig = buildManualConfig(siteName, siteDescription);
      const { config: nextConfig, warnings } = await validateConfig(manualConfig);
      setManualStatus("idle");
      setValidatedResult(nextConfig, warnings, "manual");
    } catch (err) {
      setManualError(err.message);
      setManualStatus("error");
    }
  }

  async function handleRegenerate() {
    setAiStatus("loading");
    setAiError(null);
    try {
      const { config: nextConfig, warnings } = await generateConfig({
        description: description.trim(),
        templateId: template.id,
      });
      setConfig(nextConfig);
      setValidationWarnings(warnings || []);
      setJsonDraft(JSON.stringify(nextConfig, null, 2));
      setEditingJson(false);
      setJsonError(null);
      setAiStatus("idle");
    } catch (err) {
      setAiError(err.message);
      setAiStatus("error");
    }
  }

  async function validateJsonDraft() {
    let parsed;
    try {
      parsed = JSON.parse(jsonDraft);
    } catch (err) {
      setJsonError(formatJsonParseError(err, jsonDraft));
      return null;
    }

    setJsonSaving(true);
    setJsonError(null);
    try {
      const { config: nextConfig, warnings } = await validateConfig(parsed);
      setConfig(nextConfig);
      setValidationWarnings(warnings || []);
      setJsonDraft(JSON.stringify(nextConfig, null, 2));
      setEditingJson(false);
      return nextConfig;
    } catch (err) {
      setJsonError(err.message);
      return null;
    } finally {
      setJsonSaving(false);
    }
  }

  async function handleToggleJson() {
    if (editingJson) {
      await validateJsonDraft();
    } else {
      setJsonDraft(JSON.stringify(config, null, 2));
      setJsonError(null);
      setEditingJson(true);
    }
  }

  async function handleScaffold() {
    setGenStatus("loading");
    setGenError(null);

    let finalConfig = config;
    if (editingJson) {
      finalConfig = await validateJsonDraft();
      if (!finalConfig) {
        setGenStatus("idle");
        return;
      }
    }

    try {
      const data = await generateProject({
        templateId: template.id,
        projectName: slugify(projectName),
        config: finalConfig,
      });
      setGenResult(data);
      setGenStatus("done");
      goTo("success", 1);
    } catch (err) {
      console.error("[builder] generate failed:", err);
      setGenError(err.message);
      setGenStatus("idle");
    }
  }

  async function handlePush() {
    if (!genResult?.projectName) return;
    setPushStatus("loading");
    setPushError(null);
    try {
      const data = await pushToGithub({
        projectName: genResult.projectName,
        repoName: genResult.projectName,
        description: siteDescription || description.slice(0, 80) || "Built with platform builder",
        isPrivate: true,
      });
      setPushResult(data);
      setPushStatus("done");
    } catch (err) {
      setPushError(err.message);
      setPushStatus("idle");
    }
  }

  async function handleDeploy() {
    if (!pushResult?.repoName || !pushResult?.owner) return;
    setDeployStatus("loading");
    setDeployError(null);
    try {
      const data = await deployToVercel({
        repoName: pushResult.repoName,
        owner: pushResult.owner,
      });
      setDeployResult(data);
      setDeployStatus("done");
    } catch (err) {
      setDeployError(err.message);
      setDeployStatus("idle");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-5"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 rounded-md p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <header className="border-b border-white/10 bg-slate-950/95 px-5 py-4 sm:px-7">
          <div className="text-xs font-semibold uppercase tracking-wider text-violet-300">
            {template.type}
          </div>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            {template.name}
          </h2>
        </header>

        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <AnimatePresence mode="wait" custom={direction}>
            {screen === "describe" && (
              <motion.div
                key="describe"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <ProjectNameField
                  projectName={projectName}
                  setProjectName={setProjectName}
                />

                <InputTabs activeMode={activeMode} setActiveMode={setActiveMode} />

                <button
                  type="button"
                  onClick={openSchemaReference}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-violet-300/40 hover:bg-violet-500/10 hover:text-white sm:w-auto"
                >
                  <BookOpen className="h-4 w-4" />
                  📖 View Schema Reference
                </button>

                <AnimatePresence mode="wait">
                  {activeMode === "ai" && (
                    <TabPanel key="ai">
                      <DescribeForm
                        description={description}
                        setDescription={setDescription}
                        status={aiStatus}
                        error={aiError}
                        onGenerate={handleGenerateAI}
                        projectName={projectName}
                      />
                    </TabPanel>
                  )}

                  {activeMode === "json" && (
                    <TabPanel key="json">
                      <PasteJsonForm
                        value={pasteJson}
                        onChange={setPasteJson}
                        status={pasteStatus}
                        error={pasteError}
                        onValidate={handleValidateJson}
                        projectName={projectName}
                      />
                    </TabPanel>
                  )}

                  {activeMode === "manual" && (
                    <TabPanel key="manual">
                      <ManualForm
                        siteName={siteName}
                        setSiteName={setSiteName}
                        siteDescription={siteDescription}
                        setSiteDescription={setSiteDescription}
                        status={manualStatus}
                        error={manualError}
                        onSubmit={handleManualPreview}
                        projectName={projectName}
                      />
                    </TabPanel>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {screen === "review" && config && (
              <motion.div
                key="review"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <ReviewScreen
                  config={config}
                  sourceMode={sourceMode}
                  warnings={validationWarnings}
                  editingJson={editingJson}
                  jsonDraft={jsonDraft}
                  setJsonDraft={setJsonDraft}
                  jsonError={jsonError}
                  jsonSaving={jsonSaving}
                  onToggleJson={handleToggleJson}
                  onRegenerate={handleRegenerate}
                  regenerating={aiStatus === "loading"}
                  aiError={aiError}
                  onBack={() => goTo("describe", -1)}
                  onScaffold={handleScaffold}
                  scaffolding={genStatus === "loading"}
                  genError={genError}
                />
              </motion.div>
            )}

            {screen === "success" && genResult && (
              <motion.div
                key="success"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <SuccessScreen
                  genResult={genResult}
                  pushResult={pushResult}
                  pushError={pushError}
                  pushStatus={pushStatus}
                  onPush={handlePush}
                  deployResult={deployResult}
                  deployError={deployError}
                  deployStatus={deployStatus}
                  onDeploy={handleDeploy}
                  onClose={onClose}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {schemaOpen && (
          <SchemaReferenceModal
            status={schemaStatus}
            schema={schema}
            error={schemaError}
            copyStatus={copyStatus}
            setCopyStatus={setCopyStatus}
            onClose={() => setSchemaOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProjectNameField({ projectName, setProjectName }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <TextField
        label="Project name"
        hint="Lowercase letters, numbers, and dashes are safest."
        value={projectName}
        onChange={setProjectName}
      />
    </div>
  );
}

function InputTabs({ activeMode, setActiveMode }) {
  return (
    <div className="grid grid-cols-1 gap-2 rounded-xl border border-white/10 bg-slate-900/80 p-1.5 sm:grid-cols-3">
      {INPUT_MODES.map(({ id, label, icon: Icon, accent }) => {
        const active = activeMode === id;
        const activeClass =
          accent === "emerald"
            ? "border-emerald-300/50 bg-emerald-400/15 text-emerald-100 shadow-emerald-500/10"
            : accent === "amber"
              ? "border-amber-300/50 bg-amber-400/15 text-amber-100 shadow-amber-500/10"
              : "border-violet-300/50 bg-violet-400/15 text-violet-100 shadow-violet-500/10";

        return (
          <button
            key={id}
            type="button"
            onClick={() => setActiveMode(id)}
            className={`relative flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
              active
                ? `${activeClass} shadow-lg`
                : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {active && (
              <motion.span
                layoutId="active-input-tab"
                className="absolute inset-0 -z-10 rounded-lg"
                transition={{ type: "spring", stiffness: 360, damping: 32 }}
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}

function TabPanel({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </motion.div>
  );
}

function DescribeForm({
  description,
  setDescription,
  status,
  error,
  onGenerate,
  projectName,
}) {
  const loading = status === "loading";

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-white">AI Generate</h3>
        <p className="mt-1 text-sm text-slate-400">
          Describe yourself, your skills, experience, projects, and contact links.
        </p>
      </div>

      <label className="block">
        <div className="mb-1.5 text-xs font-semibold text-slate-300">
          Describe yourself...
        </div>
        <textarea
          rows={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={`Tell us about yourself and we'll build your portfolio...

Example: "I'm Priya, a frontend developer in Mumbai with 2 years at TCS. Skills: React, Tailwind, JavaScript. Built an e-commerce dashboard and a task app. Email: priya@email.com, github.com/priya"`}
          className="w-full resize-y rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm leading-relaxed text-white placeholder-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-white/10"
        />
      </label>

      {loading && <LoadingSkeleton />}

      {error && !loading && (
        <InlineError label="Error" message={error} onRetry={onGenerate} />
      )}

      <button
        type="button"
        onClick={onGenerate}
        disabled={loading || !description.trim() || !projectName.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:from-violet-400 hover:to-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            AI is reading your details...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            ✨ Generate with AI
          </>
        )}
      </button>
    </div>
  );
}

function PasteJsonForm({ value, onChange, status, error, onValidate, projectName }) {
  const loading = status === "loading";

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-white">Paste JSON</h3>
        <p className="mt-1 text-sm text-slate-400">
          Paste a content.json config and preview it before generating.
        </p>
      </div>

      <JsonCodeEditor value={value} onChange={onChange} placeholder={JSON_PLACEHOLDER} />

      <p className="rounded-lg border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100">
        Tip: Use the Schema Reference below to generate this JSON from ChatGPT,
        Claude, or any AI.
      </p>

      {error && <InlineError label="Invalid JSON" message={error} onRetry={onValidate} />}

      <button
        type="button"
        onClick={onValidate}
        disabled={loading || !value.trim() || !projectName.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Validating...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Validate & Preview
          </>
        )}
      </button>
    </div>
  );
}

function ManualForm({
  siteName,
  setSiteName,
  siteDescription,
  setSiteDescription,
  status,
  error,
  onSubmit,
  projectName,
}) {
  const loading = status === "loading";
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white">Manual Form</h3>
        <p className="mt-1 text-sm text-slate-400">Fill the starter fields directly.</p>
      </div>

      <TextField label="Site name" value={siteName} onChange={setSiteName} />
      <TextField
        label="Description"
        value={siteDescription}
        onChange={setSiteDescription}
      />

      {error && <InlineError label="Error" message={error} />}

      <button
        type="submit"
        disabled={loading || !projectName.trim() || !siteName.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Validating...
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Validate & Preview
          </>
        )}
      </button>
    </form>
  );
}

function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3 rounded-lg border border-white/10 bg-white/[0.02] p-4"
    >
      <div className="flex items-center gap-2 text-xs font-medium text-violet-300">
        <Wand2 className="h-3.5 w-3.5 animate-pulse" />
        Drafting your config...
      </div>
      <div className="space-y-2">
        <div className="h-3 w-1/3 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-6 w-16 animate-pulse rounded-full bg-white/10"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-20 animate-pulse rounded-lg bg-white/10" />
        <div className="h-20 animate-pulse rounded-lg bg-white/10" />
      </div>
    </motion.div>
  );
}

function ReviewScreen({
  config,
  sourceMode,
  warnings,
  editingJson,
  jsonDraft,
  setJsonDraft,
  jsonError,
  jsonSaving,
  onToggleJson,
  onRegenerate,
  regenerating,
  aiError,
  onBack,
  onScaffold,
  scaffolding,
  genError,
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Review &amp; generate</h3>
          <p className="mt-1 text-sm text-slate-400">
            Preview the validated portfolio content before scaffolding.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {sourceMode === "ai" && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={regenerating}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 disabled:opacity-60"
            >
              {regenerating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              🔄 Regenerate
            </button>
          )}
          <button
            type="button"
            onClick={onToggleJson}
            disabled={jsonSaving}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 disabled:opacity-60"
          >
            {jsonSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Code2 className="h-3.5 w-3.5" />
            )}
            {editingJson ? "✅ Apply JSON" : "📝 Edit JSON"}
          </button>
        </div>
      </div>

      {aiError && (
        <InlineError label="Regenerate error" message={aiError} onRetry={onRegenerate} />
      )}

      <WarningsList warnings={warnings} />

      {editingJson ? (
        <div className="space-y-2">
          <JsonCodeEditor value={jsonDraft} onChange={setJsonDraft} minRows={18} />
          {jsonError && (
            <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-2 text-xs text-rose-200">
              {jsonError}
            </div>
          )}
        </div>
      ) : (
        <ConfigPreview config={config} />
      )}

      {genError && <InlineError label="Error" message={genError} />}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          ← Back
        </button>
        <button
          type="button"
          onClick={onScaffold}
          disabled={scaffolding || jsonSaving}
          className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {scaffolding ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Scaffolding...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              ✅ Looks good - Generate project
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ConfigPreview({ config }) {
  const profile = config.profile || {};
  const name = profile.fullName || config.siteName;
  const role = profile.role || profile.currentTitle;
  const headline = profile.heroHeadline || profile.heroSummary;
  const skills = config.skills;
  const projects = Array.isArray(config.projects) ? config.projects : [];
  const experience = Array.isArray(config.experience) ? config.experience : [];
  const services = Array.isArray(config.services) ? config.services : [];
  const contactLinks = Array.isArray(config.contactLinks) ? config.contactLinks : [];
  const stats = Array.isArray(config.stats) ? config.stats : [];

  return (
    <div className="space-y-5 rounded-xl border border-white/10 bg-white/[0.02] p-5">
      {(name || role || headline) && (
        <div className="border-b border-white/10 pb-4">
          {name && <div className="text-xl font-bold text-white">{name}</div>}
          {role && (
            <div className="mt-0.5 text-sm font-medium text-violet-300">
              {role}
            </div>
          )}
          {headline && (
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {headline}
            </p>
          )}
        </div>
      )}

      {stats.length > 0 && (
        <Section title="Stats">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={`${s.label}-${i}`}
                className="rounded-lg border border-white/10 bg-white/5 p-3 text-center"
              >
                <div className="text-xl font-bold text-violet-300">{s.value}</div>
                <div className="mt-0.5 text-[11px] text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {skills && <SkillsBlock skills={skills} />}

      {projects.length > 0 && (
        <Section title="Projects" icon={<Briefcase className="h-3.5 w-3.5" />}>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {projects.map((p, i) => (
              <div key={p.id || i} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold text-white">
                    {p.title || "Untitled"}
                  </div>
                  {p.featured && (
                    <span className="rounded bg-emerald-400/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-200">
                      Featured
                    </span>
                  )}
                </div>
                {p.description && (
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    {p.description}
                  </p>
                )}
                {Array.isArray(p.tech) && p.tech.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.tech.map((t, j) => (
                      <Tag key={`${t}-${j}`} tone="violet">{t}</Tag>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience" icon={<Briefcase className="h-3.5 w-3.5" />}>
          <ul className="space-y-3 border-l border-white/10 pl-4">
            {experience.map((e, i) => (
              <li key={`${e.title}-${i}`} className="relative">
                <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-violet-400 ring-4 ring-violet-500/20" />
                <div className="text-[11px] font-mono uppercase text-slate-500">
                  {e.period}
                </div>
                <div className="text-sm font-semibold text-white">{e.title}</div>
                <div className="text-xs text-slate-400">
                  {[e.company, e.location].filter(Boolean).join(" - ")}
                </div>
                {Array.isArray(e.bullets) && e.bullets.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-slate-300">
                    {e.bullets.slice(0, 3).map((bullet, j) => (
                      <li key={`${bullet}-${j}`}>- {bullet}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {services.length > 0 && (
        <Section title="Services" icon={<Wrench className="h-3.5 w-3.5" />}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {services.map((s, i) => (
              <div key={`${s.title}-${i}`} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="text-xs font-semibold text-white">{s.title}</div>
                {s.description && (
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    {s.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {contactLinks.length > 0 && (
        <Section title="Contact">
          <div className="flex flex-wrap gap-2">
            {contactLinks.map((link, i) => (
              <ContactPill
                key={`${link.type}-${i}`}
                icon={contactIcon(link.type)}
                href={link.href}
              >
                {link.label || link.value || link.type}
              </ContactPill>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function SchemaReferenceModal({
  status,
  schema,
  error,
  copyStatus,
  setCopyStatus,
  onClose,
}) {
  const rawSchemaText = schema ? JSON.stringify(schema.rawSchema, null, 2) : "";

  async function copyText(text, label) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(label);
      window.setTimeout(() => setCopyStatus(""), 1800);
    } catch (err) {
      setCopyStatus(`Copy failed: ${err.message}`);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-5"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
              <BookOpen className="h-4 w-4" />
              Schema Reference
            </div>
            <h3 className="mt-1 text-lg font-bold text-white">
              {schema?.title || "Portfolio content.json schema"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Close schema reference"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {status === "loading" && (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100">
              {error}
            </div>
          )}

          {schema && (
            <div className="space-y-6">
              {schema.fields?.map((group) => (
                <div key={group.group} className="space-y-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    {group.group}
                  </h4>
                  <div className="overflow-hidden rounded-xl border border-white/10">
                    {group.fields.map((field) => (
                      <SchemaFieldRow key={field.name} field={field} />
                    ))}
                  </div>
                </div>
              ))}

              <div className="space-y-2">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Raw Schema JSON
                </h4>
                <pre className="max-h-72 overflow-auto rounded-xl border border-white/10 bg-slate-950 p-4 text-xs leading-relaxed text-emerald-200">
                  {rawSchemaText}
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  AI Prompt
                </h4>
                <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-relaxed text-slate-200">
                  {schema.prompt}
                </pre>
              </div>
            </div>
          )}
        </div>

        <footer className="flex flex-col gap-2 border-t border-white/10 bg-slate-950/95 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-h-5 text-xs text-slate-400">
            {copyStatus && (
              <span className="inline-flex items-center gap-1 text-emerald-300">
                <Check className="h-3.5 w-3.5" />
                {copyStatus}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => copyText(schema?.prompt, "Prompt copied")}
              disabled={!schema}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:opacity-50"
            >
              <Clipboard className="h-4 w-4" />
              📋 Copy Prompt
            </button>
            <button
              type="button"
              onClick={() => copyText(rawSchemaText, "Schema JSON copied")}
              disabled={!schema}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:opacity-50"
            >
              <Copy className="h-4 w-4" />
              📋 Copy Schema JSON
            </button>
          </div>
        </footer>
      </motion.div>
    </motion.div>
  );
}

function SchemaFieldRow({ field }) {
  return (
    <div className="grid gap-2 border-b border-white/10 bg-white/[0.02] p-3 last:border-b-0 sm:grid-cols-[minmax(190px,0.9fr)_minmax(160px,0.8fr)_90px_minmax(220px,1.2fr)] sm:items-start">
      <div className="font-mono text-xs text-white">{field.name}</div>
      <div className="font-mono text-[11px] leading-relaxed text-emerald-200">
        {field.type}
      </div>
      <div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
            field.required
              ? "bg-rose-400/15 text-rose-200 ring-1 ring-rose-300/20"
              : "bg-white/5 text-slate-400 ring-1 ring-white/10"
          }`}
        >
          {field.required ? "Required" : "Optional"}
        </span>
      </div>
      <div className="text-xs leading-relaxed text-slate-300">
        <div>{field.description}</div>
        <div className="mt-1 font-mono text-[11px] text-slate-500">
          {field.example}
        </div>
      </div>
    </div>
  );
}

function JsonCodeEditor({ value, onChange, placeholder, minRows = 16 }) {
  const lineCount = Math.max(value.split("\n").length, minRows);
  const lines = useMemo(
    () => Array.from({ length: lineCount }, (_, i) => i + 1),
    [lineCount]
  );

  return (
    <div className="flex overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-inner">
      <div className="select-none border-r border-white/10 bg-white/[0.03] px-3 py-3 text-right font-mono text-xs leading-relaxed text-slate-600">
        {lines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
      <textarea
        rows={minRows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="min-h-0 flex-1 resize-y border-0 bg-transparent px-3 py-3 font-mono text-xs leading-relaxed text-emerald-200 placeholder-slate-600 outline-none"
      />
    </div>
  );
}

function WarningsList({ warnings }) {
  if (!warnings?.length) return null;
  return (
    <div className="rounded-lg border border-amber-300/30 bg-amber-400/10 p-3 text-xs text-amber-100">
      <div className="mb-2 flex items-center gap-2 font-semibold">
        <AlertTriangle className="h-4 w-4" />
        Validation warnings
      </div>
      <ul className="space-y-1">
        {warnings.map((warning, i) => (
          <li key={`${warning}-${i}`}>⚠️ {warning}</li>
        ))}
      </ul>
    </div>
  );
}

function InlineError({ label, message, onRetry }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-rose-400/30 bg-rose-500/10 p-3 text-xs text-rose-200">
      <div>
        <span className="font-semibold">{label}:</span> {message}
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex-shrink-0 rounded-md bg-rose-500/20 px-2 py-1 font-semibold text-rose-100 hover:bg-rose-500/30"
        >
          Retry
        </button>
      )}
    </div>
  );
}

function SkillsBlock({ skills }) {
  if (Array.isArray(skills)) {
    return (
      <Section title="Skills">
        <div className="flex flex-wrap gap-1.5">
          {skills.map((s, i) => (
            <Tag key={`${s}-${i}`}>{typeof s === "string" ? s : s.name || s.title}</Tag>
          ))}
        </div>
      </Section>
    );
  }

  if (skills && typeof skills === "object") {
    return (
      <Section title="Skills">
        <div className="space-y-2.5">
          {Object.entries(skills).map(([cat, list], i) => (
            <div key={cat}>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {cat}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(list) ? list : [list]).map((s, j) => (
                  <Tag key={`${cat}-${j}`} tone={i % 2 ? "emerald" : "violet"}>
                    {typeof s === "string" ? s : s.name}
                  </Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  return null;
}

function Section({ title, icon, children }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function Tag({ tone = "violet", children }) {
  const classes =
    tone === "emerald"
      ? "bg-emerald-500/15 text-emerald-200 ring-emerald-400/20"
      : "bg-violet-500/15 text-violet-200 ring-violet-400/20";
  return (
    <span className={`rounded-md px-2 py-1 text-xs font-medium ring-1 ${classes}`}>
      {children}
    </span>
  );
}

function ContactPill({ icon, href, children }) {
  const TagName = href ? "a" : "span";
  return (
    <TagName
      href={href || undefined}
      target={href ? "_blank" : undefined}
      rel={href ? "noreferrer noopener" : undefined}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 transition hover:bg-white/10 hover:text-white"
    >
      {icon}
      {children}
    </TagName>
  );
}

function contactIcon(type) {
  if (type === "email") return <Mail className="h-3 w-3" />;
  if (type === "github") return <GithubIcon className="h-3 w-3" />;
  return <Globe className="h-3 w-3" />;
}

function SuccessScreen({
  genResult,
  pushResult,
  pushError,
  pushStatus,
  onPush,
  deployResult,
  deployError,
  deployStatus,
  onDeploy,
  onClose,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4">
        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
        <div className="min-w-0">
          <div className="text-sm font-semibold text-emerald-200">
            {genResult.message}
          </div>
          <div className="mt-1 break-all font-mono text-[11px] text-emerald-300/80">
            {genResult.path}
          </div>
        </div>
      </div>

      {pushResult && (
        <div className="rounded-lg border border-violet-400/30 bg-violet-500/10 p-4 text-sm">
          <div className="mb-1 font-semibold text-violet-200">
            Pushed to GitHub
          </div>
          <a
            href={pushResult.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 break-all font-mono text-[11px] text-violet-300 underline-offset-2 hover:underline"
          >
            {pushResult.repoUrl}
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
          </a>
        </div>
      )}

      {pushError && <InlineError label="Push error" message={pushError} />}

      {!pushResult && (
        <button
          type="button"
          onClick={onPush}
          disabled={pushStatus === "loading"}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pushStatus === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Pushing to GitHub...
            </>
          ) : (
            <>
              <GithubIcon className="h-4 w-4" />
              Push to GitHub
            </>
          )}
        </button>
      )}

      {deployResult && (
        <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 p-4 text-sm">
          <div className="mb-1 flex items-center gap-2 font-semibold text-amber-200">
            <Rocket className="h-4 w-4" />
            Deployed to Vercel ({deployResult.status})
          </div>
          <a
            href={deployResult.deploymentUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 break-all font-mono text-[11px] text-amber-300 underline-offset-2 hover:underline"
          >
            {deployResult.deploymentUrl}
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
          </a>
        </div>
      )}

      {deployError && <InlineError label="Deploy error" message={deployError} />}

      {pushResult && !deployResult && (
        <button
          type="button"
          onClick={onDeploy}
          disabled={deployStatus === "loading"}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deployStatus === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Deploying to Vercel...
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4" />
              Deploy to Vercel
            </>
          )}
        </button>
      )}

      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <ChainBadge done={!!genResult}>Generated</ChainBadge>
        <span>-</span>
        <ChainBadge done={!!pushResult}>Pushed</ChainBadge>
        <span>-</span>
        <ChainBadge done={!!deployResult}>Deployed</ChainBadge>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
      >
        Done
      </button>
    </div>
  );
}

function ChainBadge({ done, children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${
        done
          ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30"
          : "bg-white/5 text-slate-500 ring-1 ring-white/10"
      }`}
    >
      {done ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <span className="h-3 w-3 rounded-full border border-current" />
      )}
      {children}
    </span>
  );
}

function TextField({ label, hint, value, onChange }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-semibold text-slate-300">{label}</div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-white/10"
      />
      {hint && <div className="mt-1 text-[11px] text-slate-500">{hint}</div>}
    </label>
  );
}

function buildManualConfig(siteName, siteDescription) {
  const fullName = siteName.trim() || "My New Site";
  const firstName = fullName.split(/\s+/).filter(Boolean)[0] || fullName;
  const summary = siteDescription.trim();

  return {
    siteName: fullName,
    meta: {
      title: fullName,
      description: summary,
    },
    profile: {
      firstName,
      fullName,
      heroHeadline: truncateWords(summary || fullName, 7),
      heroSummary: summary,
    },
    footerCopyright: `© ${new Date().getFullYear()} ${fullName}. All rights reserved.`,
  };
}

function truncateWords(value, max) {
  return value.split(/\s+/).filter(Boolean).slice(0, max).join(" ");
}

function formatJsonParseError(error, source) {
  const message = error?.message || "Unknown parse error";
  const explicit = /line\s+(\d+)\s+column\s+(\d+)/i.exec(message);
  if (explicit) {
    return `Invalid JSON - check syntax near line ${explicit[1]}, column ${explicit[2]}.`;
  }

  const positionMatch = /position\s+(\d+)/i.exec(message);
  if (positionMatch) {
    const position = Number(positionMatch[1]);
    const before = source.slice(0, position);
    const line = before.split("\n").length;
    const column = before.length - before.lastIndexOf("\n");
    return `Invalid JSON - check syntax near line ${line}, column ${column}.`;
  }

  return `Invalid JSON - check syntax. ${message}`;
}
