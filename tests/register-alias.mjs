// Mendaftarkan resolver alias "@/" untuk menjalankan tes dengan Node murni (tanpa Jest/Vitest).
import { register } from "node:module";
register("./alias-hooks.mjs", import.meta.url);
