export const ESSENTIAL_FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "number", label: "Number" },
  { value: "select", label: "Select" },
  { value: "date", label: "Date" },
  { value: "textarea", label: "Textarea" },
  { value: "toggle", label: "Toggle" },
  { value: "phone", label: "Phone" },
  { value: "currency", label: "Currency" },
  { value: "multi-select", label: "Multi-select" },
  { value: "radio", label: "Radio" },
  { value: "file", label: "File" },
  { value: "image", label: "Image" },
  { value: "tags", label: "Tags" },
  { value: "checkbox", label: "Checkbox" },
];

export const ICON_OPTIONS = [
  "Database",
  "Users",
  "UserRound",
  "ShieldCheck",
  "BriefcaseBusiness",
  "FileText",
  "ClipboardList",
  "Landmark",
  "BadgeIndianRupee",
  "ChartNoAxesColumn",
  "GraduationCap",
  "School",
  "Package",
  "Boxes",
  "Factory",
  "ShoppingCart",
  "UserCheck",
  "CalendarClock",
  "Truck",
  "BookOpen",
];

export const INDUSTRY_OPTIONS = [
  { value: "generic", label: "Generic Business" },
  { value: "healthcare", label: "Healthcare" },
  { value: "crm", label: "CRM" },
  { value: "hrms", label: "HRMS" },
  { value: "school", label: "School Management" },
  { value: "inventory", label: "Inventory" },
  { value: "erp", label: "ERP" },
];

export const THEME_PRESETS = [
  { value: "blue", label: "Blue", color: "#2563eb" },
  { value: "red", label: "Red", color: "#dc2626" },
  { value: "green", label: "Green", color: "#16a34a" },
  { value: "purple", label: "Purple", color: "#7c3aed" },
  { value: "slate", label: "Slate", color: "#334155" },
];

const INDUSTRY_MODULES = {
  generic: [
    {
      singularName: "Contact",
      pluralName: "Contacts",
      icon: "Users",
      fields: [
        ["Contact Name", "text", { key: "name", required: true, width: "half" }],
        ["Email", "email", { key: "email", width: "half" }],
        ["Phone", "phone", { key: "phone", width: "half" }],
        ["Status", "select", { key: "status", width: "half", options: ["New", "Active", "Inactive"] }],
        ["Notes", "textarea", { key: "notes" }],
      ],
      listColumns: ["name", "email", "phone", "status"],
    },
    {
      singularName: "Task",
      pluralName: "Tasks",
      icon: "ClipboardList",
      fields: [
        ["Task", "text", { key: "title", required: true }],
        ["Owner", "text", { key: "owner", width: "half" }],
        ["Due Date", "date", { key: "due_date", width: "half" }],
        ["Priority", "select", { key: "priority", width: "half", options: ["Low", "Medium", "High"] }],
        ["Completed", "toggle", { key: "completed", width: "half" }],
      ],
      listColumns: ["title", "owner", "due_date", "priority"],
    },
  ],
  healthcare: [
    {
      singularName: "Patient",
      pluralName: "Patients",
      icon: "UserRound",
      fields: [
        ["Patient Name", "text", { key: "name", required: true, width: "half" }],
        ["Mobile", "phone", { key: "mobile", width: "half" }],
        ["Visit Date", "date", { key: "visit_date", width: "half" }],
        ["Care Status", "select", { key: "care_status", width: "half", options: ["New", "In Care", "Follow Up", "Closed"] }],
        ["Notes", "textarea", { key: "notes" }],
      ],
      listColumns: ["name", "mobile", "visit_date", "care_status"],
    },
    {
      singularName: "Appointment",
      pluralName: "Appointments",
      icon: "CalendarClock",
      fields: [
        ["Patient Name", "text", { key: "patient_name", required: true, width: "half" }],
        ["Appointment Date", "date", { key: "appointment_date", required: true, width: "half" }],
        ["Department", "select", { key: "department", width: "half", options: ["OPD", "Diagnostics", "Pharmacy", "Follow Up"] }],
        ["Status", "select", { key: "status", width: "half", options: ["Scheduled", "Completed", "Cancelled"] }],
      ],
      listColumns: ["patient_name", "appointment_date", "department", "status"],
    },
  ],
  crm: [
    {
      singularName: "Customer",
      pluralName: "Customers",
      icon: "Users",
      fields: [
        ["Customer Name", "text", { key: "name", required: true, width: "half" }],
        ["Email", "email", { key: "email", width: "half" }],
        ["Phone", "phone", { key: "phone", width: "half" }],
        ["Segment", "select", { key: "segment", width: "half", options: ["Enterprise", "Mid Market", "SMB", "Partner"] }],
        ["Lifecycle Stage", "select", { key: "stage", width: "half", options: ["Lead", "Qualified", "Customer", "Churn Risk"] }],
      ],
      listColumns: ["name", "email", "phone", "stage"],
    },
    {
      singularName: "Deal",
      pluralName: "Deals",
      icon: "BadgeIndianRupee",
      fields: [
        ["Deal Name", "text", { key: "name", required: true }],
        ["Company", "text", { key: "company", width: "half" }],
        ["Value", "currency", { key: "value", width: "half" }],
        ["Stage", "select", { key: "stage", width: "half", options: ["Discovery", "Proposal", "Negotiation", "Won", "Lost"] }],
        ["Expected Close", "date", { key: "expected_close", width: "half" }],
      ],
      listColumns: ["name", "company", "value", "stage"],
    },
  ],
  hrms: [
    {
      singularName: "Employee",
      pluralName: "Employees",
      icon: "UserCheck",
      fields: [
        ["Employee Name", "text", { key: "name", required: true, width: "half" }],
        ["Work Email", "email", { key: "email", required: true, width: "half" }],
        ["Department", "select", { key: "department", width: "half", options: ["People", "Finance", "Sales", "Operations", "Engineering"] }],
        ["Joining Date", "date", { key: "joining_date", width: "half" }],
        ["Employment Status", "select", { key: "status", width: "half", options: ["Active", "On Leave", "Exited"] }],
      ],
      listColumns: ["name", "email", "department", "status"],
    },
    {
      singularName: "Leave Request",
      pluralName: "Leave Requests",
      icon: "CalendarClock",
      fields: [
        ["Employee Name", "text", { key: "employee_name", required: true, width: "half" }],
        ["Leave Type", "select", { key: "leave_type", width: "half", options: ["Casual", "Sick", "Earned", "Unpaid"] }],
        ["From Date", "date", { key: "from_date", width: "half" }],
        ["To Date", "date", { key: "to_date", width: "half" }],
        ["Approval Status", "select", { key: "status", width: "half", options: ["Pending", "Approved", "Rejected"] }],
      ],
      listColumns: ["employee_name", "leave_type", "from_date", "status"],
    },
  ],
  school: [
    {
      singularName: "Student",
      pluralName: "Students",
      icon: "GraduationCap",
      fields: [
        ["Student Name", "text", { key: "name", required: true, width: "half" }],
        ["Guardian Phone", "phone", { key: "guardian_phone", width: "half" }],
        ["Class", "select", { key: "class_name", width: "half", options: ["Nursery", "Class 1", "Class 5", "Class 10", "Class 12"] }],
        ["Enrollment Date", "date", { key: "enrollment_date", width: "half" }],
        ["Status", "select", { key: "status", width: "half", options: ["Active", "Transferred", "Alumni"] }],
      ],
      listColumns: ["name", "class_name", "guardian_phone", "status"],
    },
    {
      singularName: "Fee Record",
      pluralName: "Fee Records",
      icon: "BadgeIndianRupee",
      fields: [
        ["Student Name", "text", { key: "student_name", required: true, width: "half" }],
        ["Term", "select", { key: "term", width: "half", options: ["Term 1", "Term 2", "Annual"] }],
        ["Amount", "currency", { key: "amount", width: "half" }],
        ["Due Date", "date", { key: "due_date", width: "half" }],
        ["Payment Status", "select", { key: "status", width: "half", options: ["Due", "Partial", "Paid"] }],
      ],
      listColumns: ["student_name", "term", "amount", "status"],
    },
  ],
  inventory: [
    {
      singularName: "Product",
      pluralName: "Products",
      icon: "Package",
      fields: [
        ["Product Name", "text", { key: "name", required: true, width: "half" }],
        ["SKU", "text", { key: "sku", required: true, width: "half" }],
        ["Category", "select", { key: "category", width: "half", options: ["Raw Material", "Finished Goods", "Packaging", "Spare Parts"] }],
        ["Stock Quantity", "number", { key: "stock_quantity", width: "half" }],
        ["Reorder Level", "number", { key: "reorder_level", width: "half" }],
      ],
      listColumns: ["name", "sku", "category", "stock_quantity"],
    },
    {
      singularName: "Stock Movement",
      pluralName: "Stock Movements",
      icon: "Truck",
      fields: [
        ["Product SKU", "text", { key: "sku", required: true, width: "half" }],
        ["Movement Type", "select", { key: "movement_type", width: "half", options: ["Inward", "Outward", "Adjustment"] }],
        ["Quantity", "number", { key: "quantity", width: "half" }],
        ["Movement Date", "date", { key: "movement_date", width: "half" }],
        ["Reference", "text", { key: "reference" }],
      ],
      listColumns: ["sku", "movement_type", "quantity", "movement_date"],
    },
  ],
  erp: [
    {
      singularName: "Vendor",
      pluralName: "Vendors",
      icon: "Factory",
      fields: [
        ["Vendor Name", "text", { key: "name", required: true, width: "half" }],
        ["Contact Email", "email", { key: "email", width: "half" }],
        ["GST Number", "text", { key: "gst_number", width: "half" }],
        ["Payment Terms", "select", { key: "payment_terms", width: "half", options: ["Immediate", "Net 15", "Net 30", "Net 45"] }],
        ["Status", "select", { key: "status", width: "half", options: ["Active", "On Hold", "Inactive"] }],
      ],
      listColumns: ["name", "email", "payment_terms", "status"],
    },
    {
      singularName: "Purchase Order",
      pluralName: "Purchase Orders",
      icon: "ShoppingCart",
      fields: [
        ["PO Number", "text", { key: "po_number", required: true, width: "half" }],
        ["Vendor", "text", { key: "vendor", required: true, width: "half" }],
        ["Amount", "currency", { key: "amount", width: "half" }],
        ["Order Date", "date", { key: "order_date", width: "half" }],
        ["Status", "select", { key: "status", width: "half", options: ["Draft", "Issued", "Received", "Closed"] }],
      ],
      listColumns: ["po_number", "vendor", "amount", "status"],
    },
  ],
};

export const INDUSTRY_PRESETS = {
  generic: {
    themeColor: "#2563eb",
    badge: "Business Operations",
    headline: "Run your operations from one focused workspace",
    highlightText: "operations",
    description: "Manage records, tasks, approvals, and daily workflows from one secure dashboard.",
    footerText: "Powered by your operations team",
  },
  healthcare: {
    themeColor: "#0f766e",
    badge: "Care Operations",
    headline: "Coordinate care records with clarity",
    highlightText: "care records",
    description: "Track visits, appointments, teams, and operational workflows from one secure portal.",
    footerText: "Secure care operations portal",
  },
  crm: {
    themeColor: "#2563eb",
    badge: "Customer Management",
    headline: "Manage your customers with ease",
    highlightText: "customers",
    description: "Track relationships, deals, follow-ups, and revenue operations from one place.",
    footerText: "Customer operations workspace",
  },
  hrms: {
    themeColor: "#7c3aed",
    badge: "People Operations",
    headline: "Manage employees, leave, and HR workflows",
    highlightText: "employees",
    description: "Keep employee records, approvals, and HR operations organized in one secure portal.",
    footerText: "People operations portal",
  },
  school: {
    themeColor: "#ca8a04",
    badge: "School Management",
    headline: "Run student and campus operations smoothly",
    highlightText: "student",
    description: "Manage student records, fees, classes, and school workflows from a single dashboard.",
    footerText: "School administration portal",
  },
  inventory: {
    themeColor: "#059669",
    badge: "Inventory Control",
    headline: "Track stock, products, and movement in real time",
    highlightText: "stock",
    description: "Manage inventory records, stock movement, suppliers, and reorder workflows from one place.",
    footerText: "Inventory operations portal",
  },
  erp: {
    themeColor: "#334155",
    badge: "Enterprise Operations",
    headline: "Bring vendors, purchases, and operations together",
    highlightText: "operations",
    description: "Coordinate enterprise records, procurement workflows, and approvals from one system.",
    footerText: "Enterprise operations portal",
  },
};

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function makeId(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function deriveLogoText(name = "") {
  const words = String(name || "")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "AP";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

export function createField(label = "Name", type = "text", options = {}) {
  const key = options.key || slugify(label).replace(/-/g, "_") || "field";
  return {
    id: options.id || makeId("field"),
    label,
    key,
    type,
    required: !!options.required,
    width: options.width || "full",
    placeholder: options.placeholder || "",
    helpText: options.helpText || "",
    options: options.options || [],
    settings: options.settings || {},
    features: { filter: options.filter !== false, ...(options.features || {}) },
  };
}

export function createModule(singularName = "Record", pluralName = "Records") {
  const id = slugify(pluralName || singularName) || makeId("module");
  const firstField = createField(`${singularName} Name`, "text", {
    required: true,
  });
  const statusField = createField("Status", "select", {
    options: ["Draft", "Active", "Archived"],
  });

  return {
    id,
    singularName,
    pluralName,
    icon: "Database",
    collapsed: false,
    fields: [firstField, statusField],
    listColumns: [firstField.key, statusField.key],
    tableFeatures: {
      sort: true,
      filter: true,
      search: true,
      pagination: true,
      export: false,
    },
  };
}

function createPresetModules(industry = "generic") {
  const definitions = INDUSTRY_MODULES[industry] || INDUSTRY_MODULES.generic;
  return definitions.map((definition) => {
    const fields = definition.fields.map(([label, type, options]) =>
      createField(label, type, options)
    );
    return {
      id: slugify(definition.pluralName),
      singularName: definition.singularName,
      pluralName: definition.pluralName,
      icon: definition.icon || "Database",
      collapsed: false,
      fields,
      listColumns:
        definition.listColumns ||
        fields.slice(0, 4).map((field) => field.key),
      tableFeatures: {
        sort: true,
        filter: true,
        search: true,
        pagination: true,
        export: true,
      },
    };
  });
}

export function getIndustryPreset(industry = "generic") {
  return INDUSTRY_PRESETS[industry] || INDUSTRY_PRESETS.generic;
}

export function buildLoginPageConfig({
  appName = "Admin Portal",
  industry = "generic",
  loginPage = {},
  footer = {},
} = {}) {
  const preset = getIndustryPreset(industry);
  return {
    portalName: appName,
    badge: loginPage.badge || preset.badge,
    headline: loginPage.headline || preset.headline,
    highlightText: loginPage.highlightText || preset.highlightText,
    description: loginPage.description || preset.description,
    features:
      loginPage.features?.length
        ? loginPage.features
        : [
            {
              title: "Secure Access",
              description: "Enterprise-grade authentication for authorized users.",
            },
            {
              title: "Self Service",
              description: "Manage records, workflows, and operations from one dashboard.",
            },
          ],
    footerText: loginPage.footerText || footer.text || preset.footerText,
  };
}

export function createInitialPortalConfig(templateId = "portal-admin") {
  const industry = "generic";
  const portalName = "acme-admin";
  const appName = "Acme Admin";
  const preset = getIndustryPreset(industry);

  return {
    version: 1,
    templateId,
    slug: portalName,
    portalName,
    appName,
    industry,
    themePreset: "blue",
    type: "admin",
    themeColor: preset.themeColor,
    logoText: deriveLogoText(appName),
    logoUrl: "",
    auth: {
      screens: {
        login: true,
        signup: true,
        forgotPassword: false,
      },
      method: "email-password",
    },
    dashboard: {
      enabled: true,
      template: "stats-overview",
      style: "operations",
    },
    loginPage: buildLoginPageConfig({ appName, industry }),
    footer: {
      text: preset.footerText,
    },
    company: {
      name: appName,
      website: "",
      supportEmail: "",
      address: "",
    },
    profile: {
      enabled: true,
    },
    modules: createPresetModules(industry),
  };
}

export function applyIndustryPreset(config, industry) {
  const preset = getIndustryPreset(industry);
  const appName = config.appName || config.portalName || "Admin Portal";
  const next = {
    ...config,
    industry,
    themePreset: config.themePreset || "custom",
    themeColor: preset.themeColor,
    logoText: config.logoText || deriveLogoText(appName),
    dashboard: {
      ...config.dashboard,
      enabled: config.dashboard?.enabled !== false,
      template: config.dashboard?.template || "stats-overview",
      style: industry,
    },
    footer: {
      ...(config.footer || {}),
      text: preset.footerText,
    },
    company: {
      name: appName,
      website: "",
      supportEmail: "",
      address: "",
      ...(config.company || {}),
    },
    modules: createPresetModules(industry),
  };

  return {
    ...next,
    loginPage: buildLoginPageConfig({
      appName,
      industry,
      loginPage: {},
      footer: next.footer,
    }),
  };
}

export function normalizeModuleIds(config) {
  const appName = config.appName || config.portalName || "Admin Portal";
  const industry = config.industry || "generic";
  const footer = {
    text: config.footer?.text || getIndustryPreset(industry).footerText,
    ...(config.footer || {}),
  };

  return {
    ...config,
    industry,
    themePreset: config.themePreset || "custom",
    slug: slugify(config.slug || config.portalName || appName),
    logoText: config.logoText || deriveLogoText(appName),
    footer,
    company: {
      name: appName,
      website: "",
      supportEmail: "",
      address: "",
      ...(config.company || {}),
    },
    loginPage: buildLoginPageConfig({
      appName,
      industry,
      loginPage: config.loginPage || {},
      footer,
    }),
    modules: (config.modules || []).map((module) => {
      const id = slugify(module.id || module.pluralName || module.singularName);
      const fields = (module.fields || []).map((field) => ({
        ...field,
        key:
          field.key ||
          slugify(field.label || field.id)
            .replace(/-/g, "_"),
      }));
      const listColumns =
        module.listColumns?.filter((key) =>
          fields.some((field) => field.key === key)
        ) || fields.slice(0, 4).map((field) => field.key);

      return {
        ...module,
        id,
        fields,
        listColumns,
      };
    }),
  };
}

export function auditPortalConfig(config) {
  const errors = [];
  const warnings = [];
  const industry = config.industry || "generic";
  const text = JSON.stringify(config || {}).toLowerCase();
  const bannedHealthcareTerms = [
    "wc-health",
    "aidin",
    "hipaa",
    "payer",
    "clinic",
    "patient",
    "patients",
    "claim status",
    "healthcare",
  ];

  if (!config.appName?.trim()) errors.push("App display name is missing.");
  if (!config.portalName?.trim()) errors.push("Project name is missing.");
  if (!config.loginPage?.headline?.trim()) {
    errors.push("Login page headline is missing.");
  }
  if (!config.loginPage?.description?.trim()) {
    errors.push("Login page description is missing.");
  }
  if (!config.loginPage?.features?.length) {
    errors.push("Login page needs at least one feature.");
  }
  if (!config.modules?.length) errors.push("At least one CRUD module is required.");

  if (industry !== "healthcare") {
    const matches = bannedHealthcareTerms.filter((term) => text.includes(term));
    if (matches.length) {
      errors.push(
        `Non-healthcare portal still contains healthcare/template terms: ${matches.join(", ")}.`
      );
    }
  }

  if (!config.logoUrl && !config.logoText) {
    warnings.push("No logo uploaded. A fallback logo will be generated from the portal name.");
  }
  if (/placeholder|lorem ipsum|sample portal|organization portal/i.test(text)) {
    warnings.push("Config contains placeholder-style copy. Review before generating.");
  }

  return { errors, warnings };
}
