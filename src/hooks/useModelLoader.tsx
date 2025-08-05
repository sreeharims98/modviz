import { useAppContext } from "@/context/AppContext";
import {
  centerAndScaleModel,
  getUniqueModelMaterials,
  loadGLTFModel,
} from "@/lib/threejs";
import { RefObject } from "react";
import { toast } from "sonner";
import { AnimationMixer, Group, Object3DEventMap, Scene } from "three";

export const useModelLoader = ({
  sceneRef,
  modelRef,
}: {
  sceneRef: RefObject<Scene | null>;
  modelRef: RefObject<Group<Object3DEventMap> | null>;
}) => {
  const {
    setIsModelLoaded,
    setLoadingProgress,
    setIsLoading,
    handleMaterialsFound,
    mixerRef,
    clipsRef,
    setCurrentAction,
  } = useAppContext();

  const loadModel = async (file: File) => {
    try {
      setIsLoading(true);
      setLoadingProgress(0);

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
      clipsRef.current = animations;
      // Play first animation
      if (animations.length > 0) {
        const action = mixerRef.current.clipAction(animations[0]);
        action.play();
        setCurrentAction(action);
      }
    } catch (error) {
      console.error("Error loading model:", error);
      toast.error("Failed to load model");
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  return { loadModel };
};
