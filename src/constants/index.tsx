import { MaterialProps } from "@/types";

export const TABS = {
  MATERIALS: "Materials",
  LIGHTS: "Lights",
};

export const DEFAULT_MATERIAL_PROPS: MaterialProps = {
  color: "",
  metalness: 0,
  roughness: 0,
  emissive: "",
  emissiveIntensity: 0,
};
