/** @type {import('next').NextConfig} */
const nextConfig = {
  // cacheComponents is off on purpose: every page reads the visitor's
  // GrowWise cookie (business name, tool inputs), so pages render per request.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
