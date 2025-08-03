export interface MaterialProps {
  color: string;
  metalness: number;
  roughness: number;
  emissive: string;
  emissiveIntensity: number;
}

export interface LightsProps {
  environmentMap: string;
  blurriness: number;
  groundedSkybox: boolean;
  useSkybox: boolean;
  customHDR: File | null;
}
