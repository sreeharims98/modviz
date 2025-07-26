export interface MaterialProps {
  color: string;
  metalness: number;
  roughness: number;
  emissive: string;
  emissiveIntensity: number;
}

export interface LightsProps {
  intensity: number;
  environmentMap: string;
  blurriness: number;
  useSkybox: boolean;
  customHDR: File | null;
}
