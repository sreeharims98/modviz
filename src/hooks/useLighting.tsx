import { useAppContext } from "@/context/AppContext";
import { setupEnvironment } from "@/lib/threejs";
import { RefObject, useEffect } from "react";
import { Scene, Texture } from "three";
import { GroundedSkybox } from "three/examples/jsm/Addons.js";

export const useLighting = (
  sceneRef: RefObject<Scene | null>,
  textureRef: RefObject<Texture | null>,
  skyboxRef: RefObject<GroundedSkybox | null>
) => {
  const { lightSettings } = useAppContext();

  //Update environment
  useEffect(() => {
    if (!sceneRef.current || !textureRef.current || !skyboxRef.current) return;
    const file = lightSettings.customHDR ?? lightSettings.environmentMap;
    if (!file) return;
    setupEnvironment(
      file,
      sceneRef.current,
      textureRef,
      skyboxRef,
      lightSettings.blurriness
    );
  }, [
    lightSettings.blurriness,
    lightSettings.customHDR,
    lightSettings.environmentMap,
    sceneRef,
    skyboxRef,
    textureRef,
  ]);

  //skybox
  useEffect(() => {
    if (!sceneRef.current) return;

    //if skybox is enabled, set the background to the environment
    if (lightSettings.useSkybox) {
      sceneRef.current.background = sceneRef.current.environment;
    }
    //if skybox is disabled, set the background to null
    else {
      sceneRef.current.background = null;
    }
  }, [lightSettings.useSkybox, sceneRef]);

  //blurriness
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.backgroundBlurriness = lightSettings.blurriness;
  }, [lightSettings.blurriness, sceneRef]);

  //grounded skybox
  useEffect(() => {
    if (!skyboxRef.current || !sceneRef.current) return;
    //grounded skybox if enabled
    if (lightSettings.groundedSkybox) {
      sceneRef.current.add(skyboxRef.current);
    }
    // remove grounded skybox if disabled
    else {
      sceneRef.current.remove(skyboxRef.current);
    }
  }, [lightSettings.groundedSkybox, sceneRef, skyboxRef]);
};
