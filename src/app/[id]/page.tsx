"use client";

import ModelViewer from "@/components/ModelViewer";
import { useShare } from "@/hooks/useShare";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Viewer() {
  const { id } = useParams();

  const { getUserSceneById, getPublicURLbyPath } = useShare();

  const [modelUrl, setModelUrl] = useState("");

  useEffect(() => {
    const getUserScene = async () => {
      if (id && typeof id === "string") {
        const userScene = await getUserSceneById(id);
        if (!userScene) return;
        const publicURL = await getPublicURLbyPath(userScene.model_url);
        setModelUrl(publicURL);
      }
    };
    getUserScene();
  }, [getPublicURLbyPath, getUserSceneById, id]);

  return (
    <div className="flex w-full h-full bg-background p-2">
      <ModelViewer modelUrl={modelUrl} />
    </div>
  );
}
