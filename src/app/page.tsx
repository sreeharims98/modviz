"use client";

import { Material } from "three";
import ModelViewer from "./components/ModelViewer";

export default function Home() {
  const handleMaterialsFound = (foundMaterials: Material[]) => {
    console.log("foundMaterials", foundMaterials);
  };

  return (
    <div>
      <ModelViewer onMaterialsFound={handleMaterialsFound} />
    </div>
  );
}
