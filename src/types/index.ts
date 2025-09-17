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

export interface UserSceneProps {
  id: string;
  user_id: string;
  model_url: string;
  model_path: string;
  hdri_url: string | null;
  created_at: string | null;
}
