import { buildLegacyTheme } from "sanity";

/**
 * Tema brand FANIDEV untuk Sanity Studio.
 * Navy #1e1b4b untuk navigasi, hijau #4ade80 sebagai aksen.
 */
export const theme = buildLegacyTheme({
  "--brand-primary": "#4ade80",
  "--main-navigation-color": "#1e1b4b",
  "--main-navigation-color--inverted": "#e2e8f0",
  "--focus-color": "#4ade80",
  "--state-info-color": "#4ade80",
  "--default-button-primary-color": "#16a34a",
});
