import { useLighting } from "@/hooks/useLighting";
import { useMaterial } from "@/hooks/useMaterial";
import { useScene } from "@/hooks/useScene";
import { LoadingOverlay } from "./LoadingOverlay";
import { useAppStore } from "@/store/useAppStore";
import { useAnimation } from "@/hooks/useAnimation";
import { Group } from "three";
import { useEffect, useRef } from "react";
import { useModelLoader } from "@/hooks/useModelLoader";

interface ModelViewerProps {
  modelUrl: string;
}

export default function ModelViewer({ modelUrl }: ModelViewerProps) {
  const isLoading = useAppStore((state) => state.isLoading);

  const modelRef = useRef<Group | null>(null);

  //scene
  const { mountRef, sceneRef, textureRef, skyboxRef, mixerRef } = useScene();

  //model loader hook
  const { loadModel } = useModelLoader({ sceneRef, modelRef, mixerRef });

  //material
  useMaterial();

  //lighting
  useLighting(sceneRef, textureRef, skyboxRef);

  //animation
  useAnimation({ mixerRef });

  useEffect(() => {
    if (modelUrl) {
      loadModel(modelUrl);
    }
  }, [modelUrl, loadModel]);

  return (
    <div ref={mountRef} className={`w-full h-full rounded-lg overflow-hidden`}>
      {/* loading progress */}
      {isLoading && <LoadingOverlay />}
    </div>
  );
}
