/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Fontsource variable packages ship CSS with no type declarations; declare the
// side-effect imports so the type-checker doesn't flag them (ts2882).
declare module "@fontsource-variable/inter";
declare module "@fontsource-variable/source-code-pro";
