"use client";

import { Material, MeshPhysicalMaterial, MeshStandardMaterial } from "three";
import ModelViewer from "../components/layout/ModelViewer";
import { useState } from "react";
import { MaterialPanel } from "../components/layout/MaterialPanel";

export default function Home() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [materialProperties, setMaterialProperties] = useState({
    color: "#ffffff",
    metalness: 0,
    roughness: 0.5,
    emissive: "#000000",
    emissiveIntensity: 0,
  });

  const handleMaterialsFound = (foundMaterials: Material[]) => {
    setMaterials(foundMaterials);
    if (foundMaterials.length > 0) {
      const firstEditableMaterial = foundMaterials.find(
        (material) =>
          material instanceof MeshStandardMaterial ||
          material instanceof MeshPhysicalMaterial
      );

      if (firstEditableMaterial) {
        handleMaterialSelect(firstEditableMaterial);
      } else {
        setSelectedMaterial(foundMaterials[0]);
        // toast.info(
        //   "No editable materials found. Load a model with Standard/Physical materials."
        // );
      }
    }
  };

  const handleMaterialSelect = (material: Material) => {
    setSelectedMaterial(material);

    // Update properties from selected material
    if (
      material instanceof MeshStandardMaterial ||
      material instanceof MeshPhysicalMaterial
    ) {
      setMaterialProperties({
        color: `#${material.color.getHexString()}`,
        metalness: material.metalness,
        roughness: material.roughness,
        emissive: `#${material.emissive.getHexString()}`,
        emissiveIntensity: material.emissiveIntensity,
      });
    }
  };

  const handlePropertyChange = (property: string, value: string) => {
    setMaterialProperties((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 p-4">
        <ModelViewer
          onMaterialsFound={handleMaterialsFound}
          selectedMaterial={selectedMaterial}
          materialProperties={materialProperties}
        />
      </div>
      <MaterialPanel
        materials={materials}
        selectedMaterial={selectedMaterial}
        onMaterialSelect={handleMaterialSelect}
        materialProperties={materialProperties}
        onPropertyChange={handlePropertyChange}
      />
    </div>
  );
}
