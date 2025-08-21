"use client"

import { WebContainer } from "@webcontainer/api";
import { useEffect, useRef, useState } from "react";

type WebContainerState = "booting" | "ready" | "none";

const crossOriginIsolatedErrorMessage = `Failed to execute 'postMessage' on 'Worker': SharedArrayBuffer transfer requires self.crossOriginIsolated.`;

export const useWebContainer = (setup: (webContainer: WebContainer) => Promise<void>) => {
  const [webContainer, setWebContainer] = useState<WebContainer | null>(null);
  const webContainerStatus = useRef<WebContainerState>("none");
  const [webContainerURL, setWebContainerUrl] = useState<string | null>(null);

    useEffect(() => {
      let mounted = true;
      
      const initializeWebContainer = async () => {
        if (webContainerStatus.current !== "none") return;
        
        try {
          webContainerStatus.current = "booting";
          const container = await WebContainer.boot();

          console.log('WebContainer booted')
          
          if (!mounted) {
            console.log('WebContainer teardown')
            container.teardown();
            return;
          }
  
          // Set up event listeners before updating state
          container.on("server-ready", (port, url) => {
            console.log(`Server is live at ${url} ${port}`);
            setWebContainerUrl(url);
          });
  
          container.on("error", (error) => {
            console.error(`Web Container Error`, error);
          });
  
          container.on("port", (port, type, url) => {
            console.log(`Port ${port} is open for ${type} at ${url}`);
          });
  
          container.on("preview-message", (message) => {
            console.log(`Preview message: ${message}`);
          });

          console.log('WebContainer .on listeners set')
  
          webContainerStatus.current = "ready";
          if (mounted) {
            setWebContainer(container);

            console.log('WebContainer setup running')
            await setup(container);
          }
        } catch (error) {
          if (error instanceof Error) {
            if (error.message === crossOriginIsolatedErrorMessage) {
              error.message += `\n\nSee https://webcontainers.io/guides/quickstart#cross-origin-isolation for more information.
                \nTo fix this error, please set the following headers in your server:\nCross-Origin-Embedder-Policy: require-corp\nCross-Origin-Opener-Policy: same-origin`;
            }
            throw error;
          }
        }
      };
  
      initializeWebContainer();
  
      return () => {
        mounted = false;
        if (webContainerStatus.current === "ready" && webContainer) {
          webContainer.teardown();
          webContainerStatus.current = "none";
        }
      };
    }, []);

  return { webContainer, webContainerURL };
}