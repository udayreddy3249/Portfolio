import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds a plain static site in /out (used for the shareable preview).
const isExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  images: isExport
    ? { loader: "custom", loaderFile: "./src/lib/image-loader.ts" }
    : { formats: ["image/avif", "image/webp"] },
  poweredByHeader: false,
  ...(isExport ? { output: "export" as const } : {}),
};

export default nextConfig;
