import type { FileSystemTree } from "@webcontainer/api";

export const viteReactApp: FileSystemTree = {
  src: {
    directory: {
      "App.jsx": {
        file: {
          contents: `export default function App() {
  return <h1>Hello World</h1>
}`,
        },
      },
      "main.jsx": {
        file: {
          contents: `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)`,
        },
      },
    },
  },
  "index.html": {
    file: {
      contents: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,
    },
  },
  "package.json": {
    file: {
      contents: JSON.stringify({
        name: "my-vite-app",
        private: true,
        version: "0.0.0",
        type: "module",
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview",
        },
        dependencies: {
          react: "^19.1.1",
          "react-dom": "^19.1.1",
        },
        devDependencies: {
          "@vitejs/plugin-react": "^5.0.0",
          globals: "^16.3.0",
          vite: "^7.1.2",
        },
      }),
    },
  },
  "vite.config.js": {
    file: {
      contents: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})`,
    },
  },
};
