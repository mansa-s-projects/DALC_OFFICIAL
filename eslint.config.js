import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["dist/**", ".next/**"],
  },
];

export default eslintConfig;
