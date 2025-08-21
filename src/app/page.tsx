"use client";

import { useEffect, useState } from "react";
import { viteReactApp } from "./vite-react-app";
import { useWebContainer } from "./WebContainer";
import Link from "next/link";
import { AnsiUp } from "ansi_up";

const au = new AnsiUp();

export default function Home() {
  const [code, setCode] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

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
            const output = au.ansi_to_html(data);
            setTerminalOutput((prev) => [...prev, output]);
          },
        })
      );

      if ((await installProcess.exit) !== 0) {
        console.error("Failed to install packages");
        return;
      }

      console.log("Installed packages");

      const devProcess = await webContainer.spawn("npm", ["run", "dev"]);

      setReady(true);

      devProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            const output = au.ansi_to_html(data);
            setTerminalOutput((prev) => [...prev, output]);
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
        {ready ? (
          <iframe
            src={webContainerURL ?? "about:blank"}
            height={800}
            width={800}
            className="border-2 rounded m-4 border-black"
          />
        ) : (
          <div
            className="flex flex-col border-2 rounded m-4 border-black w-[800px] h-[800px] overflow-y-auto text-sm p-2"
            ref={(el) => {
              if (el) {
                el.scrollTop = el.scrollHeight;
              }
            }}
          >
            {terminalOutput.map((line, index) => (
              <div key={index} dangerouslySetInnerHTML={{ __html: line }} />
            ))}
          </div>
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
