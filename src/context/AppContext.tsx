import React, {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
} from "react";
import { Material, MeshPhysicalMaterial, MeshStandardMaterial } from "three";
import { LightsProps, MaterialProps } from "@/types";
import { DEFAULT_LIGHT_SETTINGS, DEFAULT_MATERIAL_SETTINGS } from "@/constants";

interface AppContextType {
  //scene
  isModelLoaded: boolean;
  setIsModelLoaded: (isModelLoaded: boolean) => void;
  //materials
  materials: Material[];
  selectedMaterial: Material | null;
  materialSettings: MaterialProps;
  handleMaterialsFound: (foundMaterials: Material[]) => void;
  handleMaterialSelect: (material: Material) => void;
  handleMaterialSettingsChange: (
    property: string,
    value: string | number
  ) => void;
  resetMaterialSettings: () => void;
  //lights
  lightSettings: LightsProps;
  setLightSettings: React.Dispatch<React.SetStateAction<LightsProps>>;
  resetLightSettings: () => void;
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
  const [materialSettings, setMaterialSettings] = useState<MaterialProps>(
    DEFAULT_MATERIAL_SETTINGS
  );
  const selectedMaterialSettings = useRef<MaterialProps>(
    DEFAULT_MATERIAL_SETTINGS
  );

  //lights
  const [lightSettings, setLightSettings] = useState<LightsProps>(
    DEFAULT_LIGHT_SETTINGS
  );

  //materials
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
      const setings = {
        color: `#${material.color.getHexString()}`,
        metalness: material.metalness,
        roughness: material.roughness,
        emissive: `#${material.emissive.getHexString()}`,
        emissiveIntensity: material.emissiveIntensity,
      };
      setMaterialSettings(setings);
      selectedMaterialSettings.current = { ...setings };
    }
  };

  const handleMaterialSettingsChange = (
    property: string,
    value: string | number
  ) => {
    setMaterialSettings((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const resetMaterialSettings = () => {
    setMaterialSettings({ ...selectedMaterialSettings.current });
  };

  //lights

  const resetLightSettings = () => {
    setLightSettings({ ...DEFAULT_LIGHT_SETTINGS });
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
        materialSettings,
        handleMaterialsFound,
        handleMaterialSelect,
        handleMaterialSettingsChange,
        resetMaterialSettings,
        //lights
        lightSettings,
        setLightSettings,
        resetLightSettings,
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
