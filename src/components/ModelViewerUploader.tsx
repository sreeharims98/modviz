import { useFileHandler } from "@/hooks/useFileHandler";
import { useLighting } from "@/hooks/useLighting";
import { useMaterial } from "@/hooks/useMaterial";
import { useScene } from "@/hooks/useScene";
import { LoadingOverlay } from "./LoadingOverlay";
import { useAppStore } from "@/store/useAppStore";
import { useAnimation } from "@/hooks/useAnimation";
import { useEffect } from "react";

export default function ModelViewerUploader() {
  const isModelLoaded = useAppStore((state) => state.isModelLoaded);
  const isLoading = useAppStore((state) => state.isLoading);
  const resetAll = useAppStore((state) => state.resetAll);

  //scene
  const { mountRef, sceneRef, textureRef, skyboxRef, mixerRef } = useScene();

  //file handler
  const {
    isDragOver,
    fileInputRef,
    handleBrowseClick,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileChange,
  } = useFileHandler({ sceneRef, mixerRef });

  //material
  useMaterial();

  //lighting
  useLighting(sceneRef, textureRef, skyboxRef);

  //animation
  useAnimation({ mixerRef });

  //reset all to initial state
  useEffect(() => {
    resetAll();
  }, [resetAll]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full rounded-lg overflow-hidden transition-all duration-200`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !isModelLoaded && handleBrowseClick()}
      style={{ cursor: !isModelLoaded ? "pointer" : "default" }}
    >
      {!isModelLoaded && (
        <div className="w-full h-full bg-gradient-to-r from-slate-500 to-gray-600">
          <input
            ref={fileInputRef}
            type="file"
            accept=".glb,.gltf"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <div
            className={`absolute inset-4 border-2 border-dashed rounded-lg flex items-center justify-center transition-all duration-200 ${
              isDragOver
                ? "border-primary bg-dropzone-active"
                : "border-dropzone-border bg-dropzone"
            }`}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl text-stone-100 font-semibold mb-2">
                Drop or Click to Browse GLB/GLTF Model
              </h3>
              <p className="text-stone-300">
                Drag and drop or click to select a 3D model file to start
                editing materials
              </p>
            </div>
          </div>
        </div>
      )}

      {/* loading progress */}
      {isLoading && <LoadingOverlay />}
    </div>
  );
}
