import { useAppContext } from "@/context/AppContext";
import {
  centerAndScaleModel,
  enableModelShadows,
  getUniqueModelMaterials,
  initCamera,
  initOrbitControls,
  initRenderer,
  initScene,
  loadGLTFModel,
  setupEnvironment,
  setupLighting,
} from "@/lib/threejs";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Group,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Scene,
  WebGLRenderer,
} from "three";

export default function ModelViewer() {
  const {
    isModelLoaded,
    setIsModelLoaded,
    selectedMaterial,
    materialProperties,
    handleMaterialsFound,
  } = useAppContext();

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const modelRef = useRef<Group | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const mountNode = mountRef.current;

    //scene setup
    const scene = initScene();
    sceneRef.current = scene;

    // Camera setup
    const camera = initCamera(mountNode);

    // Renderer setup
    const renderer = initRenderer(mountNode);
    rendererRef.current = renderer;
    mountNode.appendChild(renderer.domElement);

    // Controls
    const controls = initOrbitControls(camera, renderer);

    // Setup environment
    setupEnvironment("./blocky_photo_studio_1k.hdr", scene);

    //Setup Lighting
    setupLighting(scene);

    // addFloor();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountNode) return;
      camera.aspect = mountNode.clientWidth / mountNode.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountNode && renderer.domElement.parentNode === mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const loadModel = async (file: File) => {
    try {
      const model = await loadGLTFModel(file);
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
      enableModelShadows(model);

      // Extract unique materials from model
      const uniqueMaterials = getUniqueModelMaterials(model);

      sceneRef.current.add(model);
      handleMaterialsFound(uniqueMaterials);
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

  // Update material properties when selectedMaterial or properties change
  useEffect(() => {
    if (!selectedMaterial) return;

    if (
      selectedMaterial instanceof MeshStandardMaterial ||
      selectedMaterial instanceof MeshPhysicalMaterial
    ) {
      selectedMaterial.color.setHex(
        parseInt(materialProperties.color.replace("#", ""), 16)
      );
      selectedMaterial.metalness = materialProperties.metalness;
      selectedMaterial.roughness = materialProperties.roughness;
      selectedMaterial.emissive.setHex(
        parseInt(materialProperties.emissive.replace("#", ""), 16)
      );
      selectedMaterial.emissiveIntensity = materialProperties.emissiveIntensity;
      selectedMaterial.needsUpdate = true;
    }
  }, [selectedMaterial, materialProperties]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full bg-viewport rounded-lg overflow-hidden transition-all duration-200 ${
        isDragOver ? "ring-2 ring-primary" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => !isModelLoaded && handleBrowseClick()}
      style={{ cursor: !isModelLoaded ? "pointer" : "default" }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {!isModelLoaded && (
        <div
          className={`absolute inset-4 border-2 border-dashed rounded-lg flex items-center justify-center transition-all duration-200 ${
            isDragOver
              ? "border-primary bg-dropzone-active"
              : "border-dropzone-border bg-dropzone"
          }`}
        >
          <div className="text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">
              Drop or Click to Browse GLB/GLTF Model
            </h3>
            <p className="text-muted-foreground">
              Drag and drop or click to select a 3D model file to start editing
              materials
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
