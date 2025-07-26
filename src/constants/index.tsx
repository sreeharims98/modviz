import { MaterialProps } from "@/types";

export const TABS = {
  MATERIALS: "Materials",
  LIGHTS: "Lights",
};

export const DEFAULT_MATERIAL_SETTINGS: MaterialProps = {
  color: "",
  metalness: 0,
  roughness: 0,
  emissive: "",
  emissiveIntensity: 0,
};

export const DEFAULT_LIGHT_SETTINGS = {
  intensity: 2.0,
  environmentMap: "./blocky_photo_studio_1k.hdr",
  blurriness: 1.0,
  useSkybox: true,
  customHDR: null,
};

export const ENV_MAPS = [
  // { name: "None", value: "none", style: "bg-black" },
  {
    name: "Neutral",
    value: "./blocky_photo_studio_1k.hdr",
    style: "bg-gradient-to-r from-blue-200 to-blue-400",
  },
  // {
  //   name: "Studio",
  //   value: "studio",
  //   style: "bg-gradient-to-r from-gray-200 to-white",
  // },
  // {
  //   name: "Outdoor",
  //   value: "outdoor",
  //   style: "bg-gradient-to-r from-green-300 to-blue-300",
  // },
];
