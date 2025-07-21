import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Basic Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("viewer") as HTMLCanvasElement,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Drag and Drop Functionality
const dropZone = document.getElementById("app")!;

dropZone.addEventListener(
  "dragover",
  (event) => {
    event.preventDefault();
  },
  false
);

dropZone.addEventListener(
  "drop",
  (event) => {
    event.preventDefault();

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      if (file.name.endsWith(".glb")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const contents = e.target?.result as ArrayBuffer;
          loadGLB(contents);
        };
        reader.readAsArrayBuffer(file);
      }
    }
  },
  false
);

// GLB Loader
const loader = new GLTFLoader();
let currentModel: THREE.Group | null = null;

function loadGLB(data: ArrayBuffer) {
  loader.parse(data, "", (gltf) => {
    if (currentModel) {
      scene.remove(currentModel);
    }
    currentModel = gltf.scene;
    scene.add(currentModel);

    // Center the model
    const box = new THREE.Box3().setFromObject(currentModel);
    const center = box.getCenter(new THREE.Vector3());
    currentModel.position.sub(center); // center the model
    controls.target.copy(center);
    controls.update();

    populateMaterialEditor(currentModel);
  });
}

// Material Editor
const materialEditor = document.getElementById("material-editor")!;
const materialProperties = document.getElementById("material-properties")!;

function populateMaterialEditor(model: THREE.Object3D) {
  materialProperties.innerHTML = "";
  const materials: THREE.MeshStandardMaterial[] = [];

  model.traverse((node) => {
    if (node instanceof THREE.Mesh && node.material) {
      if (Array.isArray(node.material)) {
        materials.push(...(node.material as THREE.MeshStandardMaterial[]));
      } else {
        materials.push(node.material as THREE.MeshStandardMaterial);
      }
    }
  });

  const uniqueMaterials = [...new Set(materials)];

  if (uniqueMaterials.length > 0) {
    materialEditor.style.display = "block";
  }

  uniqueMaterials.forEach((material, index) => {
    if (material.isMeshStandardMaterial) {
      const materialDiv = document.createElement("div");
      materialDiv.className = "material-item";

      const title = document.createElement("h3");
      title.innerText = `Material: ${material.name || `Material ${index + 1}`}`;
      materialDiv.appendChild(title);

      // Color
      const colorLabel = document.createElement("label");
      colorLabel.innerText = "Color";
      const colorInput = document.createElement("input");
      colorInput.type = "color";
      colorInput.value = `#${material.color.getHexString()}`;
      colorInput.addEventListener("input", (e) => {
        material.color.set((e.target as HTMLInputElement).value);
      });
      materialDiv.appendChild(colorLabel);
      materialDiv.appendChild(colorInput);

      // Metalness
      const metalnessLabel = document.createElement("label");
      metalnessLabel.innerText = `Metalness: ${material.metalness.toFixed(2)}`;
      const metalnessInput = document.createElement("input");
      metalnessInput.type = "range";
      metalnessInput.min = "0";
      metalnessInput.max = "1";
      metalnessInput.step = "0.01";
      metalnessInput.value = material.metalness.toString();
      metalnessInput.addEventListener("input", (e) => {
        const value = parseFloat((e.target as HTMLInputElement).value);
        material.metalness = value;
        metalnessLabel.innerText = `Metalness: ${value.toFixed(2)}`;
      });
      materialDiv.appendChild(metalnessLabel);
      materialDiv.appendChild(metalnessInput);

      // Roughness
      const roughnessLabel = document.createElement("label");
      roughnessLabel.innerText = `Roughness: ${material.roughness.toFixed(2)}`;
      const roughnessInput = document.createElement("input");
      roughnessInput.type = "range";
      roughnessInput.min = "0";
      roughnessInput.max = "1";
      roughnessInput.step = "0.01";
      roughnessInput.value = material.roughness.toString();
      roughnessInput.addEventListener("input", (e) => {
        const value = parseFloat((e.target as HTMLInputElement).value);
        material.roughness = value;
        roughnessLabel.innerText = `Roughness: ${value.toFixed(2)}`;
      });
      materialDiv.appendChild(roughnessLabel);
      materialDiv.appendChild(roughnessInput);

      materialProperties.appendChild(materialDiv);
    }
  });
}
