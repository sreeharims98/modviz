"use client";
import ModelViewerUploader from "../components/ModelViewerUploader";
import { Panel } from "@/components/panels/Panel";

export default function Home() {
  return (
    <div className="flex h-full bg-background">
      <div className="flex-1 p-2">
        <ModelViewerUploader />
      </div>
      <Panel />
    </div>
  );
}
