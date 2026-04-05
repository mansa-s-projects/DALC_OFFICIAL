import nextPlugin from "eslint-config-next";

const eslintConfig = [
  ...nextPlugin.configs["recommended"],
  {
    ignores: ["dist/**", ".next/**"],
  },
];

export default eslintConfig;
