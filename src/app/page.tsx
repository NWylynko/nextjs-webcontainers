"use client";

import { viteReactApp } from "./vite-react-app";
import { useWebContainer } from "./WebContainer";
import Link from "next/link";

export default function Home() {
  const { webContainer, webContainerURL } = useWebContainer(
    async (webContainer) => {
      await webContainer.mount(viteReactApp);

      console.log("Set up files");

      const installProcess = await webContainer.spawn("npm", ["install"]);

      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log(data);
          },
        })
      );

      if ((await installProcess.exit) !== 0) {
        console.error("Failed to install packages");
        return;
      }

      console.log("Installed packages");

      const devProcess = await webContainer.spawn("npm", ["run", "dev"]);

      devProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log(data);
          },
        })
      );

      if ((await devProcess.exit) !== 0) {
        console.error("Failed to start dev server");
        return;
      }

      console.log("Started dev server");
    }
  );
  return (
    <main>
      <h1>Webcontainers</h1>
      <div>
        <span>
          {webContainer
            ? `WebContainer instance instantiated at ${webContainer.workdir}.`
            : "WebContainer instance still booting."}
        </span>
        {webContainerURL !== null ? (
          <iframe
            src={webContainerURL}
            height={800}
            width={800}
            className="border-2 rounded m-4 border-black"
          />
        ) : (
          <div />
        )}
      </div>
      <Link
        href="https://github.com/NWylynko/nextjs-webcontainers"
        className="underline"
      >
        NWylynko/nextjs-webcontainers
      </Link>
    </main>
  );
}
