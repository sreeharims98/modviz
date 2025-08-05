import { RefObject, useRef, useState } from "react";
import { useModelLoader } from "./useModelLoader";
import { toast } from "sonner";
import { Group, Scene } from "three";

export const useFileHandler = ({
  sceneRef,
}: {
  sceneRef: RefObject<Scene | null>;
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const modelRef = useRef<Group | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //model loader hook
  const { loadModel } = useModelLoader({ sceneRef, modelRef });

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
      loadModel(glbFile);
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
      loadModel(glbFile);
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
  };
};
