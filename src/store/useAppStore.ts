import { create } from "zustand";
import {
  AnimationAction,
  AnimationClip,
  Material,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from "three";
import { LightsProps, MaterialProps } from "@/types";
import { DEFAULT_LIGHT_SETTINGS, DEFAULT_MATERIAL_SETTINGS } from "@/constants";

interface AppState {
  // Scene
  modelFile: File | null;
  setModelFile: (file: File | null) => void;

  // Loading progress
  isModelLoaded: boolean;
  setIsModelLoaded: (value: boolean) => void;
  loadingProgress: number;
  setLoadingProgress: (value: number) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;

  // Materials
  materials: Material[];
  selectedMaterial: Material | null;
  materialSettings: MaterialProps;
  selectedMaterialSettings: MaterialProps;
  handleMaterialsFound: (foundMaterials: Material[]) => void;
  handleMaterialSelect: (material: Material) => void;
  handleMaterialSettingsChange: (
    property: string,
    value: string | number
  ) => void;
  resetMaterialSettings: () => void;

  // Lights
  lightSettings: LightsProps;
  setLightSettings: (value: LightsProps) => void;
  resetLightSettings: () => void;

  // Animations
  clips: AnimationClip[];
  setClips: (clips: AnimationClip[]) => void;
  selectedAnimation: string;
  setSelectedAnimation: (animation: string) => void;
  currentAction: AnimationAction | null;
  setCurrentAction: (action: AnimationAction | null) => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
  // Scene
  modelFile: null,
  setModelFile: (file) => set({ modelFile: file }),
  // Loading progress
  isModelLoaded: false,
  setIsModelLoaded: (value) => set({ isModelLoaded: value }),
  loadingProgress: 0,
  setLoadingProgress: (value) => set({ loadingProgress: value }),
  isLoading: false,
  setIsLoading: (value) => set({ isLoading: value }),

  // Materials
  materials: [],
  selectedMaterial: null,
  materialSettings: DEFAULT_MATERIAL_SETTINGS,
  selectedMaterialSettings: DEFAULT_MATERIAL_SETTINGS,
  handleMaterialsFound: (foundMaterials) => {
    set({ materials: foundMaterials });
    if (foundMaterials.length > 0) {
      const firstEditable = foundMaterials.find(
        (material) =>
          material instanceof MeshStandardMaterial ||
          material instanceof MeshPhysicalMaterial
      );
      if (firstEditable) {
        get().handleMaterialSelect(firstEditable);
      } else {
        set({ selectedMaterial: foundMaterials[0] });
      }
    }
  },
  handleMaterialSelect: (material) => {
    set({ selectedMaterial: material });
    if (
      material instanceof MeshStandardMaterial ||
      material instanceof MeshPhysicalMaterial
    ) {
      const settings = {
        color: `#${material.color.getHexString()}`,
        metalness: material.metalness,
        roughness: material.roughness,
        emissive: `#${material.emissive.getHexString()}`,
        emissiveIntensity: material.emissiveIntensity,
      };
      set({
        materialSettings: settings,
        selectedMaterialSettings: { ...settings },
      });
    }
  },
  handleMaterialSettingsChange: (property, value) => {
    set((state) => ({
      materialSettings: {
        ...state.materialSettings,
        [property]: value,
      },
    }));
  },
  resetMaterialSettings: () => {
    set((state) => ({
      materialSettings: { ...state.selectedMaterialSettings },
    }));
  },

  // Lights
  lightSettings: DEFAULT_LIGHT_SETTINGS,
  setLightSettings: (value) => set({ lightSettings: value }),
  resetLightSettings: () =>
    set({ lightSettings: { ...DEFAULT_LIGHT_SETTINGS } }),

  // Animations
  clips: [],
  setClips: (clips) => set({ clips: clips }),
  selectedAnimation: "",
  setSelectedAnimation: (selectedAnimation) => set({ selectedAnimation }),
  currentAction: null,
  setCurrentAction: (action) => set({ currentAction: action }),
}));
