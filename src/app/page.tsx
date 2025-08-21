"use client";

import { useEffect, useState } from "react";
import { viteReactApp } from "./vite-react-app";
import { useWebContainer } from "./WebContainer";
import Link from "next/link";

export default function Home() {
  const [code, setCode] = useState("");

  const { webContainer, webContainerURL } = useWebContainer(
    async (webContainer) => {
      await webContainer.mount(viteReactApp);

      console.log("Set up files");

      setCode(await webContainer.fs.readFile("src/App.jsx", "utf-8"));

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

  const handleCodeChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const updatedCode = e.target.value;

    setCode(updatedCode);

    if (webContainer) {
      await webContainer.fs.writeFile("src/App.jsx", updatedCode);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <Link
        href="https://github.com/NWylynko/nextjs-webcontainers"
        className="underline"
      >
        NWylynko/nextjs-webcontainers
      </Link>
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

      <textarea
        className="border rounded shadow text-sm w-[800px] h-[200px]"
        value={code}
        onChange={handleCodeChange}
      />
    </main>
  );
}
