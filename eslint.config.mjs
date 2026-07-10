import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"
import reactHooks from "eslint-plugin-react-hooks"

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  reactHooks.configs.flat["recommended-latest"],
  {
    rules: {
      "react-hooks/unsupported-syntax": "error",
      "react-hooks/immutability": "error",
      "react-hooks/purity": "error",
      "react-hooks/refs": "error",
      "react-hooks/set-state-in-render": "error",
      "react-hooks/set-state-in-effect": "error",
      "react-hooks/static-components": "error",
    },
  },
  globalIgnores([".next/**", "drizzle/**", "node_modules/**"]),
])
