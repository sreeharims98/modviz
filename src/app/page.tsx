"use client";

import { Material, MeshPhysicalMaterial, MeshStandardMaterial } from "three";
import ModelViewer from "../components/layout/ModelViewer";
import { useRef, useState } from "react";
import { MaterialPanel } from "../components/layout/MaterialPanel";
import { toast } from "sonner";
import { MaterialProps } from "@/types";

const DEFAULT_MATERIAL_PROPS: MaterialProps = {
  color: "",
  metalness: 0,
  roughness: 0,
  emissive: "",
  emissiveIntensity: 0,
};

export default function Home() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [materialProperties, setMaterialProperties] = useState<MaterialProps>(
    DEFAULT_MATERIAL_PROPS
  );
  const selectedMaterialProperties = useRef<MaterialProps>(
    DEFAULT_MATERIAL_PROPS
  );

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
        toast.info(
          "No editable materials found. Load a model with Standard/Physical materials."
        );
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
      const properties = {
        color: `#${material.color.getHexString()}`,
        metalness: material.metalness,
        roughness: material.roughness,
        emissive: `#${material.emissive.getHexString()}`,
        emissiveIntensity: material.emissiveIntensity,
      };
      setMaterialProperties(properties);
      selectedMaterialProperties.current = { ...properties };
    }
  };

  const handlePropertyChange = (property: string, value: string | number) => {
    setMaterialProperties((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const resetProperties = () => {
    setMaterialProperties({ ...selectedMaterialProperties.current });
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
        resetProperties={resetProperties}
      />
    </div>
  );
}
