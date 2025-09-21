"use client";

import ModelViewer from "@/components/ModelViewer";
import { useShare } from "@/hooks/useShare";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EmptyMessage } from "@/components/EmptyMessage";

export default function Viewer() {
  const { id } = useParams();

  const { getUserSceneById, getPublicURLbyPath } = useShare();

  const [modelUrl, setModelUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserScene = async () => {
      try {
        setError(null);
        if (!id || typeof id !== "string") {
          setError("Invalid or missing scene id.");
          return;
        }

        const userScene = await getUserSceneById(id);
        if (!userScene) {
          setError(
            "Failed to load scene. It may not exist or you are not signed in."
          );
          return;
        }

        const publicURL = await getPublicURLbyPath(userScene.model_url);
        if (!publicURL) {
          setError("Failed to resolve a public URL for the model file.");
          return;
        }

        setModelUrl(publicURL);
      } catch (err: unknown) {
        const message = (err as Error)?.message ?? "Unknown error";
        setError(`Unexpected error while loading the scene: ${message}`);
      }
    };
    getUserScene();
  }, [getPublicURLbyPath, getUserSceneById, id]);

  return (
    <div className="flex w-full h-full bg-background p-2">
      <div className="flex flex-col w-full h-full gap-2">
        {error ? (
          <div className="flex w-full h-full items-center justify-center bg-gray-200">
            <EmptyMessage icon="😵‍💫" title={error} />
          </div>
        ) : (
          <ModelViewer modelUrl={modelUrl} />
        )}
      </div>
    </div>
  );
}
