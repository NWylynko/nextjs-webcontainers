// broken I think :(

import type { FileSystemTree } from "@webcontainer/api";

export const nextjsApp: FileSystemTree = {
  "package.json": {
    file: {
      contents: JSON.stringify({
        name: "nextjs-webcontainers",
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
        },
        dependencies: {
          next: "15.5.0",
          react: "19.1.0",
          "react-dom": "19.1.0",
        },
        devDependencies: {
          "@tailwindcss/postcss": "^4",
          "@types/node": "^20",
          "@types/react": "^19",
          "@types/react-dom": "^19",
          tailwindcss: "^4",
          typescript: "^5",
        },
      }),
    },
  },
  "tsconfig.json": {
    file: {
      contents: JSON.stringify({
        compilerOptions: {
          target: "ES2017",
          lib: ["dom", "dom.iterable", "esnext"],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: "esnext",
          moduleResolution: "bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "preserve",
          incremental: true,
          plugins: [
            {
              name: "next",
            },
          ],
          paths: {
            "@/*": ["./src/*"],
          },
        },
        include: [
          "next-env.d.ts",
          "**/*.ts",
          "**/*.tsx",
          ".next/types/**/*.ts",
        ],
        exclude: ["node_modules"],
      }),
    },
  },
  "postcss.config.mjs": {
    file: {
      contents: `const config = {
plugins: ["@tailwindcss/postcss"],
};

export default config;
`,
    },
  },
  app: {
    directory: {
      "globals.css": {
        file: {
          contents: `@import "tailwindcss";`,
        },
      },
      "layout.tsx": {
        file: {
          contents: `import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
variable: "--font-geist-sans",
subsets: ["latin"],
});

const geistMono = Geist_Mono({
variable: "--font-geist-mono",
subsets: ["latin"],
});

export const metadata: Metadata = {
title: "Webcontainers",
};

export default function RootLayout({
children,
}: Readonly<{
children: React.ReactNode;
}>) {
return (
<html lang="en">
  <body
    className={['geistSans.variable', 'geistMono.variable', 'antialiased'].join(' ')}
  >
    {children}
  </body>
</html>
);
}
`,
        },
      },
      "page.tsx": {
        file: {
          contents: `export default function Home() {
return <div>Hello World</div>;
}
`,
        },
      },
    },
  },
};
