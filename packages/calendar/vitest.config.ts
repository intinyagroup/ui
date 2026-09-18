import { createPackageConfig } from "@intinyagroup/vitest-preset";
import path from "path";

export default createPackageConfig(import.meta.dirname, {
  additionalAlias: {
    "@intinyagroup/tokens": path.resolve(
      import.meta.dirname,
      "../tokens/src/base.css",
    ),
    "@intinyagroup/ui/utils": path.resolve(
      import.meta.dirname,
      "../core/dist/utils.js",
    ),
    "@intinyagroup/ui": path.resolve(import.meta.dirname, "../core/dist"),
  },
});
