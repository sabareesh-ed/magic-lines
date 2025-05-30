import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const canvas1 = document.querySelector("#mindset-1");
const canvas2 = document.querySelector("#mindset-2");
const canvas3 = document.querySelector("#mindset-3");

const renderer1 = new THREE.WebGLRenderer({
  canvas: canvas1,
  alpha: true,
  antialias: true,
});
const renderer2 = new THREE.WebGLRenderer({
  canvas: canvas2,
  alpha: true,
  antialias: true,
});
const renderer3 = new THREE.WebGLRenderer({
  canvas: canvas3,
  alpha: true,
  antialias: true,
});

const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();
const scene3 = new THREE.Scene();

const camera1 = new THREE.PerspectiveCamera(35, canvas1.clientWidth / canvas1.clientHeight, 0.1, 100);
const camera2 = new THREE.PerspectiveCamera(35, canvas2.clientWidth / canvas2.clientHeight, 0.1, 100);
const camera3 = new THREE.PerspectiveCamera(35, canvas3.clientWidth / canvas3.clientHeight, 0.1, 100);

camera1.position.set(0, 0, 10);
camera2.position.set(0, 0, 10);
camera3.position.set(0, 0, 10);

scene1.add(camera1);
scene2.add(camera2);
scene3.add(camera3);

// ─── Environment ───────────────────────────────────────────────────────
new RGBELoader().load(
  "https://cdn.jsdelivr.net/gh/sabareesh-ed/sail@main/studio_small_06_1k.hdr",
  (hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene1.environment = hdr;
    scene2.environment = hdr;
    scene3.environment = hdr;
  }
);

// ─── Load Models ───────────────────────────────────────────────────────
const loader = new GLTFLoader();

let modelsLoaded = 0;
const totalModels = 3; // Total number of models to track

// Function to get the appropriate scale for each model based on the current viewport
function getScaleForBreakpoint(modelScales) {
  const width = window.innerWidth;

  // Define breakpoints for mobile, tablet, and desktop
  const mobileBreakpoint = 768;
  const tabletBreakpoint = 1024;

  if (width <= mobileBreakpoint) {
    return modelScales.mobile;
  } else if (width <= tabletBreakpoint) {
    return modelScales.tablet;
  } else {
    return modelScales.desktop;
  }
}

function loadModel(url, scene, modelScales) {
  loader.load(
    url,
    ({ scene: glb }) => {
      // Get the bounding box of the model to center it
      const bbox = new THREE.Box3().setFromObject(glb);
      const center = bbox.getCenter(new THREE.Vector3());

      glb.position.x -= center.x;
      glb.position.y -= center.y;
      glb.position.z -= center.z;

      // Get the scale for the current breakpoint
      const scale = getScaleForBreakpoint(modelScales);

      // Apply the appropriate scale to the model
      glb.scale.set(scale, scale, scale);

      // Add the model to the scene
      scene.add(glb);

      // Increment the modelsLoaded count
      modelsLoaded++;
      updateLoaderProgress();
    },
    undefined,
    (err) => console.error(err)
  );
}

// Function to update the loader progress and check if all models are loaded
function updateLoaderProgress() {
  const loaderText = document.querySelector(".loader-text");
  const progress = Math.floor((modelsLoaded / totalModels) * 100);
  loaderText.textContent = `${progress}%`;

  // If all models are loaded, delay adding the .loaded class until the progress is 100%
  if (modelsLoaded === totalModels && progress === 100) {
    setTimeout(() => {
      const loadingScreen = document.querySelector(".loading-screen");
      loadingScreen.classList.add("loaded");
    }, 200); // 200ms delay to ensure text update before adding the class
  }
}

// Load models with different scales for each breakpoint
loadModel("https://indigo-edge-assets.netlify.app/new-ie_truthmindset.glb", scene1, {
  mobile: 0.8,    
  tablet: 0.8,    
  desktop: 0.85      
});
loadModel("https://indigo-edge-assets.netlify.app/new-ie_growthmindset_ribs.glb", scene2, {
  mobile: 0.7,    
  tablet: 0.7,    
  desktop: 0.9      
});
loadModel("https://indigo-edge-assets.netlify.app/new-ie_wolfmindset.glb", scene3, {
  mobile: 0.8,    
  tablet: 0.7,    
  desktop: 0.9
});

// ─── Add Light and Axes Helper ──────────────────────────────────────────
const pointLight = new THREE.PointLight(0xffffff, 10, 10);
pointLight.position.set(0, 0.8, 0);
scene1.add(pointLight);

// ─── Render Loop ───────────────────────────────────────────────────────
function animate() {
  scene1.traverse((child) => {
    if (child.isMesh) {
      child.rotation.z -= 0.005; 
    }
  });

  scene2.traverse((child) => {
    if (child.isMesh) {
      child.rotation.y += 0.005; 
    }
  });

  scene3.traverse((child) => {
    if (child.isMesh) {
      child.rotation.y += 0.005;
    }
  });

  renderer1.render(scene1, camera1);
  renderer2.render(scene2, camera2);
  renderer3.render(scene3, camera3);

  requestAnimationFrame(animate);
}

animate();

// Resize Function
function resize() {
  const { clientWidth: w1, clientHeight: h1 } = canvas1.parentElement;
  renderer1.setSize(w1, h1, false);
  camera1.aspect = w1 / h1;
  camera1.updateProjectionMatrix();

  const { clientWidth: w2, clientHeight: h2 } = canvas2.parentElement;
  renderer2.setSize(w2, h2, false);
  camera2.aspect = w2 / h2;
  camera2.updateProjectionMatrix();

  const { clientWidth: w3, clientHeight: h3 } = canvas3.parentElement;
  renderer3.setSize(w3, h3, false);
  camera3.aspect = w3 / h3;
  camera3.updateProjectionMatrix();
}

resize();
window.addEventListener("resize", resize);

function resetOnScroll() {
  resize();
}
window.addEventListener("scroll", resetOnScroll);
