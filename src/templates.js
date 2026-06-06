export const templateCategories = [
  {
    id: "landing",
    title: "Landing Pages",
    description: "Static sites. Describe -> AI generates -> Deploy.",
    templates: [
      {
        id: "landing-modern",
        name: "Modern Portfolio",
        type: "landing",
        description: "Dark theme portfolio with animations, 7 sections.",
        accent: "#f97316",
        tags: ["Portfolio", "Framer Motion", "GSAP"],
        configFile: "content.json",
        inputMode: "ai",
      },
      {
        id: "landing-temp-2",
        name: "Editorial Portfolio",
        type: "landing",
        description: "Magazine-style editorial portfolio with serif typography, dark/light modes, and rich typographic animations.",
        accent: "#7a3b2a",
        tags: ["Portfolio", "Editorial", "Magazine", "GSAP"],
        configFile: "content.json",
        inputMode: "ai",
      },
    ],
  },
  {
    id: "portals",
    title: "Admin Portals",
    description: "CRUD portals with real database. Define modules -> Deploy with Supabase.",
    templates: [
      {
        id: "portal-admin",
        name: "Admin Portal (temp1)",
        type: "portal",
        description: "Dashboard + CRUD modules + Auth. Config-driven.",
        accent: "#1e40af",
        tags: ["temp1", "CRUD", "Dashboard", "Supabase", "Auth"],
        aliases: ["temp1"],
        configFile: "portal-config.json",
        inputMode: "wizard",
        needsSupabase: true,
      },
      {
        id: "portal-admin-v2",
        name: "Admin Portal V2 (temp2)",
        type: "portal",
        description: "Second CRUD portal layout with the same generation flow.",
        accent: "#0f766e",
        tags: ["temp2", "CRUD", "Dashboard", "Supabase", "Auth"],
        aliases: ["temp2"],
        configFile: "portal-config.json",
        inputMode: "wizard",
        needsSupabase: true,
      },
      {
        id: "crud-modern-new-temp",
        name: "Topbar CRUD Portal",
        type: "portal",
        description: "Topbar-first CRUD portal using the same scaffolding flow.",
        accent: "#2563eb",
        tags: ["topbar temp", "CRUD", "Dashboard", "Supabase", "Auth"],
        aliases: ["topbar temp"],
        configFile: "portal-config.json",
        inputMode: "wizard",
        needsSupabase: true,
      },
    ],
  },
];

export const templates = templateCategories.flatMap((category) =>
  category.templates.map((template) => ({
    ...template,
    categoryId: category.id,
  }))
);
