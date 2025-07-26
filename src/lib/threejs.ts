import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  DirectionalLight,
  EquirectangularReflectionMapping,
  Group,
  Material,
  Mesh,
  Object3DEventMap,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  DataTexture,
} from "three";
import {
  GLTFLoader,
  OrbitControls,
  RGBELoader,
} from "three/examples/jsm/Addons.js";

/**
 * Initializes and returns a new THREE.Scene instance.
 * @returns {Scene} The created scene.
 */
export const initScene = () => {
  return new Scene();
};

/**
 * Initializes and returns a PerspectiveCamera configured for the given mount node.
 * @param {HTMLDivElement} mountNode - The DOM element to base camera aspect ratio on.
 * @returns {PerspectiveCamera} The created camera.
 */
export const initCamera = (mountNode: HTMLDivElement) => {
  const camera = new PerspectiveCamera(
    75,
    mountNode.clientWidth / mountNode.clientHeight,
    0.1,
    1000
  );
  camera.position.set(5, 3, 5);
  return camera;
};

/**
 * Initializes and returns a WebGLRenderer configured for the given mount node.
 * @param {HTMLDivElement} mountNode - The DOM element to size the renderer to.
 * @returns {WebGLRenderer} The created renderer.
 */
export const initRenderer = (mountNode: HTMLDivElement) => {
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  return renderer;
};

/**
 * Initializes and returns OrbitControls for the given camera and renderer.
 * @param {PerspectiveCamera} camera - The camera to control.
 * @param {WebGLRenderer} renderer - The renderer whose DOM element will be used.
 * @returns {OrbitControls} The created orbit controls.
 */
export const initOrbitControls = (
  camera: PerspectiveCamera,
  renderer: WebGLRenderer
) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  return controls;
};

/**
 * Loads an HDR environment texture and sets it as the scene's environment and background.
 * @param {string} url - The URL of the HDR image.
 * @param {Scene} scene - The scene to apply the environment to.
 * @returns {Promise<DataTexture>} Resolves with the loaded environment texture.
 */
export const setupEnvironment = async (
  url: string,
  scene: Scene
): Promise<DataTexture> => {
  const rgbeLoader = new RGBELoader();
  try {
    const texture = await rgbeLoader.loadAsync(url);
    texture.mapping = EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.castShadow = true;
    scene.background = texture;
    scene.backgroundBlurriness = 1;

    return texture;
  } catch (error) {
    console.error("Error loading GLTF model:", error);
    throw error;
  }
};

/**
 * Adds a directional key light to the scene and sets the background color.
 * @param {Scene} scene - The scene to add lighting to.
 */
export const setupLighting = (scene: Scene) => {
  const keyLight = new DirectionalLight(0xffffff, 2);
  keyLight.position.set(10, 10, 5);
  keyLight.castShadow = true;
  scene.add(keyLight);
  scene.background = new Color(0xffffff);
};

//export  const addFloor = () => {
//   //add floor
//   const floor = new Mesh(
//     new PlaneGeometry(10, 10),
//     new MeshStandardMaterial({ color: 0xffffff })
//   );
//   floor.rotation.x = -Math.PI / 2;
//   floor.receiveShadow = true;
//   scene.add(floor);
// };

/**
 * Loads a GLTF model from a File object and returns its scene group.
 * @param {File} file - The GLTF file to load.
 * @returns {Promise<Group<Object3DEventMap>>} The loaded model's scene group.
 * @throws Will throw if the model fails to load.
 */
export const loadGLTFModel = async (
  file: File
): Promise<Group<Object3DEventMap>> => {
  const url = URL.createObjectURL(file);
  const loader = new GLTFLoader();

  try {
    const gltf = await loader.loadAsync(url);
    return gltf.scene;
  } catch (error) {
    console.error("Error loading GLTF model:", error);
    throw error;
  } finally {
    URL.revokeObjectURL(url);
  }
};

/**
 * Centers and uniformly scales a model so its largest dimension fits a 3-unit box,
 * and positions it so its bottom sits at y=0.
 * @param {Group<Object3DEventMap>} model - The model to center and scale.
 */
export const centerAndScaleModel = (model: Group<Object3DEventMap>) => {
  const box = new Box3().setFromObject(model);
  const center = box.getCenter(new Vector3());
  const size = box.getSize(new Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 3 / maxDim;

  model.scale.setScalar(scale);

  // Position model so its bottom sits on the floor
  model.position.set(
    -center.x * scale,
    -box.min.y * scale, // Position so bottom of model is at y=0 (floor level)
    -center.z * scale
  );
};

/**
 * Enables shadow casting and receiving for all meshes in the given model group.
 * @param {Group<Object3DEventMap>} model - The model to enable shadows for.
 */
export const enableModelShadows = (model: Group<Object3DEventMap>) => {
  model.traverse((child) => {
    if (child instanceof Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Returns an array of unique Material instances used by all meshes in the model group.
 * @param {Group<Object3DEventMap>} model - The model to extract materials from.
 * @returns {Material[]} Array of unique materials.
 */
export const getUniqueModelMaterials = (
  model: Group<Object3DEventMap>
): Material[] => {
  const materials = new Set<Material>();

  model.traverse((child) => {
    if (child instanceof Mesh && child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((mat) => materials.add(mat));
      } else {
        materials.add(child.material);
      }
    }
  });

  return Array.from(materials);
};
