import { MaterialProps } from "@/types";

export const TABS = {
  MATERIALS: "Materials",
  SCENE: "Scene",
  SHARE: "Share",
};

export const DEFAULT_MATERIAL_SETTINGS: MaterialProps = {
  color: "",
  metalness: 0,
  roughness: 0,
  emissive: "",
  emissiveIntensity: 0,
};

export const DEFAULT_ENV_MAP = "./blocky_photo_studio_1k.hdr";

export const DEFAULT_LIGHT_SETTINGS = {
  environmentMap: DEFAULT_ENV_MAP,
  blurriness: 1.0,
  groundedSkybox: false,
  useSkybox: true,
  customHDR: null,
};

export const ENV_MAPS = [
  // { name: "None", value: "none", style: "bg-black" },
  {
    name: "Studio",
    value: DEFAULT_ENV_MAP,
    style: "bg-gradient-to-r from-blue-200 to-blue-400",
  },
];

export const SUPABASE_STORAGE_BUCKET_MODELS = "models";
