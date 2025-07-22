import { useEffect, useRef, useState } from "react";
import {
  ACESFilmicToneMapping,
  Box3,
  BoxGeometry,
  EquirectangularReflectionMapping,
  Group,
  Material,
  Mesh,
  MeshBasicMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import {
  GLTFLoader,
  OrbitControls,
  RGBELoader,
} from "three/examples/jsm/Addons.js";

interface ModelViewerProps {
  onMaterialsFound: (materials: Material[]) => void;
  //   selectedMaterial: Material | null;
  //   materialProperties: {
  //     color: string;
  //     metalness: number;
  //     roughness: number;
  //     emissive: string;
  //     emissiveIntensity: number;
  //   };
}

export default function ModelViewer({ onMaterialsFound }: ModelViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const modelRef = useRef<Group | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    console.log("mountRef.current", mountRef.current);

    const scene = new Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 3, 5);

    // Renderer setup
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Setup neutral environment lighting
    const setupEnvironment = () => {
      // Try to load HDR environment first
      const rgbeLoader = new RGBELoader();
      rgbeLoader.load(
        "./blocky_photo_studio_1k.hdr",
        (texture) => {
          texture.mapping = EquirectangularReflectionMapping;
          scene.environment = texture;
          //   scene.background = texture;
          //   scene.backgroundBlurriness = 0.8;
          //   toast.success("HDR environment loaded");
        },
        undefined,
        (error) => {
          console.warn(
            "HDR environment failed to load, using fallback lighting"
          );
          //   setupFallbackLighting();
        }
      );
    };

    setupEnvironment();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (
        mountRef.current &&
        renderer.domElement.parentNode === mountRef.current
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const loadModel = (file: File) => {
    const loader = new GLTFLoader();
    const url = URL.createObjectURL(file);

    loader.load(
      url,
      (gltf) => {
        if (!sceneRef.current) return;

        // Remove previous model
        if (modelRef.current) {
          sceneRef.current.remove(modelRef.current);
        }

        const model = gltf.scene;
        modelRef.current = model;
        setIsModelLoaded(true);

        // Center and scale model, positioning it above the floor
        const box = new Box3().setFromObject(model);
        const center = box.getCenter(new Vector3());
        const size = box.getSize(new Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;

        model.scale.setScalar(scale);

        // Position model so its bottom sits on the floor
        const scaledSize = size.multiplyScalar(scale);
        model.position.set(
          -center.x * scale,
          -box.min.y * scale, // Position so bottom of model is at y=0 (floor level)
          -center.z * scale
        );

        // Enable shadows
        model.traverse((child) => {
          if (child instanceof Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Extract materials
        const materials: Material[] = [];
        model.traverse((child) => {
          if (child instanceof Mesh && child.material) {
            if (Array.isArray(child.material)) {
              materials.push(...child.material);
            } else {
              materials.push(child.material);
            }
          }
        });

        const uniqueMaterials = materials.filter(
          (material, index, self) => self.indexOf(material) === index
        );

        sceneRef.current.add(model);
        // onMaterialsFound(uniqueMaterials);
        // toast.success(`Model loaded with ${uniqueMaterials.length} materials`);
        URL.revokeObjectURL(url);
      },
      (progress) => {
        console.log("Loading progress:", progress);
      },
      (error) => {
        console.error("Error loading model:", error);
        // toast.error("Failed to load model");
        URL.revokeObjectURL(url);
      }
    );
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
      //   toast.error("Please drop a GLB or GLTF file");
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
      //   toast.error("Please select a GLB or GLTF file");
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  return (
    <div
      ref={mountRef}
      className={`relative w-screen h-screen bg-viewport rounded-lg overflow-hidden transition-all duration-200 ${
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
