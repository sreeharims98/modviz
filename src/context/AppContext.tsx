import React, {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
} from "react";
import { Material, MeshPhysicalMaterial, MeshStandardMaterial } from "three";
import { MaterialProps } from "@/types";
import { DEFAULT_MATERIAL_PROPS } from "@/constants";

interface AppContextType {
  //scene
  isModelLoaded: boolean;
  setIsModelLoaded: (isModelLoaded: boolean) => void;
  //materials
  materials: Material[];
  selectedMaterial: Material | null;
  materialProperties: MaterialProps;
  handleMaterialsFound: (foundMaterials: Material[]) => void;
  handleMaterialSelect: (material: Material) => void;
  handlePropertyChange: (property: string, value: string | number) => void;
  resetProperties: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  //scene
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  //materials
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
      }
    }
  };

  const handleMaterialSelect = (material: Material) => {
    setSelectedMaterial(material);
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
    <AppContext.Provider
      value={{
        //scene
        isModelLoaded,
        setIsModelLoaded,
        //materials
        materials,
        selectedMaterial,
        materialProperties,
        handleMaterialsFound,
        handleMaterialSelect,
        handlePropertyChange,
        resetProperties,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};
