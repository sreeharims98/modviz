import { DEFAULT_ENV_MAP } from "@/constants";
import { useAppContext } from "@/context/AppContext";
import {
  initCamera,
  initOrbitControls,
  initRenderer,
  initScene,
  setupEnvironment,
} from "@/lib/threejs";
import { useEffect, useRef } from "react";
import { Clock, Scene, Texture, WebGLRenderer } from "three";
import { GroundedSkybox } from "three/examples/jsm/Addons.js";

export const useScene = () => {
  const { mixerRef } = useAppContext();

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const clockRef = useRef<Clock>(new Clock());
  const textureRef = useRef<Texture | null>(null);
  const skyboxRef = useRef<GroundedSkybox | null>(null);

  // Initialize scene, camera, renderer, and controls
  useEffect(() => {
    if (!mountRef.current) return;

    const mountNode = mountRef.current;

    // Scene
    const scene = initScene();
    sceneRef.current = scene;

    // Camera
    const camera = initCamera(mountNode);

    // Renderer
    const renderer = initRenderer(mountNode);
    rendererRef.current = renderer;

    // Avoid duplicate append in StrictMode
    if (!mountNode.contains(renderer.domElement)) {
      mountNode.appendChild(renderer.domElement);
    }

    //add environment map
    setupEnvironment(DEFAULT_ENV_MAP, sceneRef.current, textureRef, skyboxRef);

    // Controls
    const controls = initOrbitControls(camera, renderer);

    // Animation loop (use setAnimationLoop instead of requestAnimationFrame)
    renderer.setAnimationLoop(() => {
      controls.update();
      if (mixerRef.current) {
        mixerRef.current.update(clockRef.current.getDelta());
      }
      renderer.render(scene, camera);
    });

    // Resize handling
    const handleResize = () => {
      const width = mountNode.clientWidth;
      const height = mountNode.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // initial size sync

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.setAnimationLoop(null); // stop rendering
      controls.dispose();
      renderer.dispose();
      // Remove renderer DOM if still present
      if (renderer.domElement.parentNode === mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, [mixerRef]);

  return {
    clockRef,
    mountRef,
    rendererRef,
    sceneRef,
    skyboxRef,
    textureRef,
  };
};
