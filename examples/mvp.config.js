export default {
  serverPath: "src/backend",
  clientPath: "src/frontend",
  outDir: "assets/build",
  baseUrl: "/",
  publicDir: "public",
  templates: {
    autoDetect: true,
    extensions: [".html"],
  },
  http: {
    timeout: 30000,
    retries: 3,
    retryStrategy: "exponential",
    defaultHeaders: { "Content-Type": "application/json" },
  },
  cache: {
    enabled: true,
    type: "localStorage",
    ttl: 3600000,
    maxSize: 10485760,
  },
  seo: {
    enabled: true,
    titleTemplate: "%s | MVPJS",
    openGraph: { type: "website", locale: "en_US" },
    twitter: { card: "summary_large_image" },
  },
  build: {
    mode: "fullstack",
    ssr: true,
    codeSplitting: true,
    minify: true,
  },
}
