function hexToRgb(hex) {
  const clean = String(hex || "#1e40af").replace("#", "");
  const safe = /^[0-9a-f]{6}$/i.test(clean) ? clean : "1e40af";
  const value = Number.parseInt(safe, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function applyPortalTheme(config) {
  const color = config?.themeColor || "#1e40af";
  const rgb = hexToRgb(color);
  const root = document.documentElement;
  root.style.setProperty("--portal-accent", color);
  root.style.setProperty("--portal-accent-rgb", `${rgb.r} ${rgb.g} ${rgb.b}`);
  document.title = config?.appName ? `${config.appName} | Portal` : "Portal";
}
