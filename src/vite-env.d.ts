interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  // Otras variables de entorno...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
