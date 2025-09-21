import { RefObject, useRef, useState } from "react";
import { useModelLoader } from "./useModelLoader";
import { toast } from "sonner";
import { AnimationMixer, Group, Scene } from "three";
import { useAppStore } from "@/store/useAppStore";

export const useFileHandler = ({
  sceneRef,
  mixerRef,
}: {
  sceneRef: RefObject<Scene | null>;
  mixerRef: RefObject<AnimationMixer | null>;
}) => {
  const setModelFile = useAppStore((state) => state.setModelFile);

  const [isDragOver, setIsDragOver] = useState(false);

  const modelRef = useRef<Group | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //model loader hook
  const { loadModel } = useModelLoader({ sceneRef, modelRef, mixerRef });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const glbFile = files.find(
      (file) =>
        file.name.toLowerCase().endsWith(".glb") ||
        file.name.toLowerCase().endsWith(".gltf")
    );

    if (glbFile) {
      const url = URL.createObjectURL(glbFile);
      setModelFile(glbFile);
      loadModel(url);
    } else {
      toast.error("Please drop a GLB or GLTF file");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const glbFile = Array.from(files).find(
      (file) =>
        file.name.toLowerCase().endsWith(".glb") ||
        file.name.toLowerCase().endsWith(".gltf")
    );
    if (glbFile) {
      const url = URL.createObjectURL(glbFile);
      setModelFile(glbFile);
      loadModel(url);
    } else {
      toast.error("Please select a GLB or GLTF file");
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  return {
    isDragOver,
    fileInputRef,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleBrowseClick,
    handleFileChange,
    mixerRef,
  };
};
