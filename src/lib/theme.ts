/**
 * Theme constants shared by the server layout and the client ThemeProvider.
 * This file has no "use client" directive on purpose: the inline init script
 * must be a plain string on the server, not a client-module reference.
 */
export const THEME_STORAGE_KEY = "theme";

/** Inline script that applies the stored theme before first paint (no flash). */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');var d=t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
