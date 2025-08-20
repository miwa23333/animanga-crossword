import * as eslint from "@eslint/js";
import * as tseslint from "typescript-eslint";

const config: tseslint.ConfigArray = tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  { ignores: ["dist"] },
  {
    rules: {
      "no-undef": ["off"],
      "@typescript-eslint/return-await": ["error", "always"],
    },
  },
);
export default config;
