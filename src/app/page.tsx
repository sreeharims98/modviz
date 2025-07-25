"use client";

import ModelViewer from "../components/layout/ModelViewer";
import { Panel } from "@/components/layout/Panel";
import { AppProvider } from "@/context/AppContext";

export default function Home() {
  return (
    <AppProvider>
      <div className="flex h-screen bg-background">
        <div className="flex-1 p-2">
          <ModelViewer />
        </div>
        <Panel />
      </div>
    </AppProvider>
  );
}
