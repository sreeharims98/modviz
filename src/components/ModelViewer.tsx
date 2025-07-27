import { useAppContext } from "@/context/AppContext";
import {
  centerAndScaleModel,
  getUniqueModelMaterials,
  initCamera,
  initOrbitControls,
  initRenderer,
  initScene,
  loadGLTFModel,
  setSceneEnvironment,
  setupEnvironment,
} from "@/lib/threejs";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AnimationMixer,
  Clock,
  Group,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Scene,
  Texture,
  WebGLRenderer,
} from "three";

export default function ModelViewer() {
  const {
    isModelLoaded,
    setIsModelLoaded,
    selectedMaterial,
    materialSettings,
    handleMaterialsFound,
    lightSettings,
    mixerRef,
    clipsRef,
    setCurrentAction,
  } = useAppContext();

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const modelRef = useRef<Group | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const envTexture = useRef<Texture | null>(null);
  const clockRef = useRef<Clock>(new Clock());
  // const lightRef = useRef<DirectionalLight | null>(null);

  const [isDragOver, setIsDragOver] = useState(false);

  // load environment
  const loadEnvironment = useCallback(
    async (file: string | File) => {
      if (!sceneRef.current) return;
      const texture = await setupEnvironment(
        file,
        sceneRef.current,
        lightSettings.blurriness,
        lightSettings.useSkybox
      );
      envTexture.current = texture;
    },
    [lightSettings.blurriness, lightSettings.useSkybox]
  );

  const loadModel = async (file: File) => {
    try {
      const { scene: model, animations } = await loadGLTFModel(file);
      if (!sceneRef.current) return;

      // Remove previous model
      if (modelRef.current) {
        sceneRef.current.remove(modelRef.current);
      }

      modelRef.current = model;
      setIsModelLoaded(true);

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
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const glbFile = files.find(
      (file) =>
        file.name.toLowerCase().endsWith(".glb") ||
        file.name.toLowerCase().endsWith(".gltf")
    );

    if (glbFile) {
      loadModel(glbFile);
    } else {
      toast.error("Please drop a GLB or GLTF file");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const glbFile = Array.from(files).find(
      (file) =>
        file.name.toLowerCase().endsWith(".glb") ||
        file.name.toLowerCase().endsWith(".gltf")
    );
    if (glbFile) {
      loadModel(glbFile);
    } else {
      toast.error("Please select a GLB or GLTF file");
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

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

  // Update material settings when selectedMaterial or settings change
  useEffect(() => {
    if (!selectedMaterial) return;

    if (
      selectedMaterial instanceof MeshStandardMaterial ||
      selectedMaterial instanceof MeshPhysicalMaterial
    ) {
      selectedMaterial.color.setHex(
        parseInt(materialSettings.color.replace("#", ""), 16)
      );
      selectedMaterial.metalness = materialSettings.metalness;
      selectedMaterial.roughness = materialSettings.roughness;
      selectedMaterial.emissive.setHex(
        parseInt(materialSettings.emissive.replace("#", ""), 16)
      );
      selectedMaterial.emissiveIntensity = materialSettings.emissiveIntensity;
      selectedMaterial.needsUpdate = true;
    }
  }, [selectedMaterial, materialSettings]);

  //Update environment settings
  useEffect(() => {
    if (!sceneRef.current || !envTexture.current) return;
    setSceneEnvironment(
      sceneRef.current,
      envTexture.current,
      lightSettings.blurriness,
      lightSettings.useSkybox
    );
  }, [lightSettings.blurriness, lightSettings.useSkybox]);

  //Update environment
  useEffect(() => {
    const file = lightSettings.customHDR ?? lightSettings.environmentMap;
    loadEnvironment(file);
  }, [lightSettings.customHDR, lightSettings.environmentMap, loadEnvironment]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full rounded-lg overflow-hidden transition-all duration-200`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !isModelLoaded && handleBrowseClick()}
      style={{ cursor: !isModelLoaded ? "pointer" : "default" }}
    >
      {!isModelLoaded && (
        <div className="w-full h-full bg-gradient-to-r from-slate-500 to-gray-600">
          <input
            ref={fileInputRef}
            type="file"
            accept=".glb,.gltf"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <div
            className={`absolute inset-4 border-2 border-dashed rounded-lg flex items-center justify-center transition-all duration-200 ${
              isDragOver
                ? "border-primary bg-dropzone-active"
                : "border-dropzone-border bg-dropzone"
            }`}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl text-stone-100 font-semibold mb-2">
                Drop or Click to Browse GLB/GLTF Model
              </h3>
              <p className="text-stone-300">
                Drag and drop or click to select a 3D model file to start
                editing materials
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
