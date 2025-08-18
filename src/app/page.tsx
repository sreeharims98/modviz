"use client";
import ModelViewer from "../components/ModelViewer";
import { Panel } from "@/components/panels/Panel";

export default function Home() {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 p-2">
        <ModelViewer />
      </div>
      <Panel />
    </div>
  );
}
