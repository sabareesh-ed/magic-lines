import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// ─── DOM Element for the new WebGL canvas ──────────────────────────────
const canvas = document.querySelector("#stats-canvas");

// ─── Set Up Renderer ──────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});

renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ─── Set Up Scene and Camera ──────────────────────────────────────────
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 0, 10);

// ─── Load Environment ────────────────────────────────────────────────
new RGBELoader().load(
  "https://cdn.jsdelivr.net/gh/sabareesh-ed/sail@main/studio_small_06_1k.hdr",
  (hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdr;
  }
);

// ─── Load the New Model ───────────────────────────────────────────────
const loader = new GLTFLoader();

function setModelColorOpacityMetalness(object, colorHex, opacity, metalness) {
  object.traverse((child) => {
    if (child.isMesh) {
      if (child.material) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(colorHex),
          metalness: metalness,
          roughness: 1 - metalness,
          transparent: opacity < 1,
          opacity: opacity,
          envMapIntensity: 1,
        });
        child.material.needsUpdate = true;
      }
    }
  });
}

function loadModel(url, scene, scale) {
  loader.load(
    url,
    ({ scene: glb }) => {
      // Get the bounding box of the model to center it
      const bbox = new THREE.Box3().setFromObject(glb);
      const center = bbox.getCenter(new THREE.Vector3());

      glb.position.x -= center.x;
      glb.position.y -= center.y;
      glb.position.z -= center.z;

      // Scale the model
      glb.scale.set(scale, scale, scale);

      // Apply material modifications
      setModelColorOpacityMetalness(glb, 0xffffff, 0.6, 0.7);

      // Add the model to the scene
      scene.add(glb);
    },
    undefined,
    (err) => console.error(err)
  );
}


// Load the new model
loadModel("https://indigo-edge-assets.netlify.app/new_tilted.glb", scene, 0.8);

let isAnimating = false;

function animate() {
  if (!isAnimating) return;

  scene.traverse((child) => {
    if (child.isMesh) {
      child.rotation.y += 0.005;
    }
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

const sectionStats = document.querySelector('.section_stats');

function checkSectionStatsVisibility() {
  const rect = sectionStats.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const startCondition = rect.top <= viewportHeight;
  const stopCondition = rect.bottom <= 0;

  if (startCondition && !stopCondition) {
    if (!isAnimating) {
      isAnimating = true;
      animate();
    }
  } else {
    if (isAnimating) {
      isAnimating = false;
    }
  }
}


window.addEventListener('scroll', checkSectionStatsVisibility);
checkSectionStatsVisibility();

animate();

function resize() {
  const { clientWidth, clientHeight } = canvas;
  renderer.setSize(clientWidth, clientHeight);
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
}

resize();
window.addEventListener("resize", resize);

function resetOnScroll() {
  resize();
}
window.addEventListener("scroll", resetOnScroll);