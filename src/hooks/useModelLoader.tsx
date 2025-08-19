import {
  centerAndScaleModel,
  getUniqueModelMaterials,
  loadGLTFModel,
} from "@/lib/threejs";
import { useAppStore } from "@/store/useAppStore";
import { RefObject } from "react";
import { toast } from "sonner";
import { AnimationMixer, Group, Object3DEventMap, Scene } from "three";

export const useModelLoader = ({
  sceneRef,
  modelRef,
  mixerRef,
}: {
  sceneRef: RefObject<Scene | null>;
  modelRef: RefObject<Group<Object3DEventMap> | null>;
  mixerRef: RefObject<AnimationMixer | null>;
}) => {
  const setIsModelLoaded = useAppStore((state) => state.setIsModelLoaded);
  const setLoadingProgress = useAppStore((state) => state.setLoadingProgress);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const handleMaterialsFound = useAppStore(
    (state) => state.handleMaterialsFound
  );
  const setClips = useAppStore((state) => state.setClips);
  const setModelFile = useAppStore((state) => state.setModelFile);

  const loadModel = async (file: File) => {
    try {
      setIsLoading(true);
      setLoadingProgress(0);

      // Set model file in the store
      setModelFile(file);

      const { scene: model, animations } = await loadGLTFModel(
        file,
        (event) => {
          if (event.lengthComputable) {
            const progress = event.loaded / event.total;
            setLoadingProgress(progress);
          } else {
            // If we can't compute progress, show indeterminate progress
            setLoadingProgress(0.5);
          }
        }
      );

      if (!sceneRef.current) return;

      // Remove previous model
      if (modelRef.current) {
        sceneRef.current.remove(modelRef.current);
      }

      modelRef.current = model;
      setIsModelLoaded(true);
      setLoadingProgress(1);
      setIsLoading(false);

      // Center and scale model, positioning it above the floor
      centerAndScaleModel(model);

      // Enable shadows
      // enableModelShadows(model);

      // Extract unique materials from model
      const uniqueMaterials = getUniqueModelMaterials(model);

      sceneRef.current.add(model);

      //materials
      handleMaterialsFound(uniqueMaterials);

      //animations
      mixerRef.current = new AnimationMixer(model);

      setClips(animations);
      // Play first animation
      // if (animations.length > 0) {
      //   const action = mixerRef.current.clipAction(animations[0]);
      //   action.play();
      //   setCurrentAction(action);
      // }
    } catch (error) {
      console.error("Error loading model:", error);
      toast.error("Failed to load model");
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  return { loadModel };
};
