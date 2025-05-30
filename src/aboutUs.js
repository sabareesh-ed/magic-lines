import "./styles/style.css";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import gsap from "gsap";

const canvas = document.querySelector(".webgl");

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  35,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  100
);
camera.position.set(-0.5, 0.1, 4.7);
scene.add(camera);

function resize() {
  const { clientWidth: w, clientHeight: h } = canvas.parentElement;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener("resize", resize);

new RGBELoader().load(
  "https://cdn.jsdelivr.net/gh/sabareesh-ed/sail@main/studio_small_06_1k.hdr",
  (hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdr;
  }
);

const params = {
  scale: 0.35,
  rotX: 0.23,
  rotY: 0.51,
  rotZ: 0,
  pivotX: 0,
  pivotY: 0,
  pivotZ: 0,
};

let pivot, model;

function update() {
  if (!pivot || !model) return;

  pivot.rotation.set(params.rotX, params.rotY, params.rotZ);
  pivot.scale.setScalar(params.scale);

  pivot.position.set(params.pivotX, params.pivotY, params.pivotZ);

  model.position.set(-params.pivotX, -params.pivotY, -params.pivotZ);
}

let rotationStarted = false;

function startModelRotation() {
  if (!pivot || rotationStarted) return;

  rotationStarted = true;

  gsap.to(params, {
    rotY: params.rotY + Math.PI * 2,
    duration: 6,
    ease: "linear",
    repeat: -1,
    onUpdate: () => {
      update();
    },
  });
}

// Loader functionality
let modelsLoaded = 0;
const totalModels = 1; // One model in this case
const loaderText = document.querySelector(".loader-text");

function updateLoaderProgress() {
  const progress = Math.floor((modelsLoaded / totalModels) * 100);
  loaderText.textContent = `${progress}%`;

  // If the model is loaded, hide the loader
  if (modelsLoaded === totalModels) {
    const loadingScreen = document.querySelector(".loading-screen");
    loadingScreen.classList.add("loaded");
  }
}

// Function to start rotation on scroll
function checkScroll() {
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;
  const viewportHeight = window.innerHeight;

  if (scrollPosition > viewportHeight * 0.075) {
    startModelRotation();
  }
}

window.addEventListener("scroll", checkScroll);

// Load the model
new GLTFLoader().load(
  "https://indigo-edge-assets.netlify.app/ie-gradient-2.glb",
  ({ scene: glb }) => {
    pivot = new THREE.Group();
    scene.add(pivot);

    const bbox = new THREE.Box3().setFromObject(glb);
    glb.position.copy(bbox.min.clone().negate());

    model = glb;
    pivot.add(model);

    update();
    modelsLoaded++; // Increment models loaded
    updateLoaderProgress(); // Update the progress

    // Initialize the rotation and update
    startModelRotation();
  },
  (xhr) => {
    const progress = (xhr.loaded / xhr.total) * 100;
    loaderText.textContent = `Loading: ${Math.floor(progress)}%`;
  },
  (err) => {
    console.error(err);
  }
);

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// Add event listener for resizing and scroll reset
window.addEventListener("scroll", resetOnScroll);

// Reset on scroll function
function resetOnScroll() {
  resize();
}
