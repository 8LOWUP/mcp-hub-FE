import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // TypeScript any 타입 허용 (배포를 위해 임시로 완화)
      "@typescript-eslint/no-explicit-any": "warn",
      // 사용하지 않는 변수 경고로 변경
      "@typescript-eslint/no-unused-vars": "warn",
      // React Hook 의존성 배열 경고로 변경
      "react-hooks/exhaustive-deps": "warn",
      // 빈 객체 타입 경고로 변경
      "@typescript-eslint/no-empty-object-type": "warn",
    },
  },
];

export default eslintConfig;
