import "./styles/style.css";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import dat from "dat.gui";
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

let pivot, model, axes, rotationTween;

function update() {
  if (!pivot || !model) return;

  pivot.rotation.set(params.rotX, params.rotY, params.rotZ);
  pivot.scale.setScalar(params.scale);
  pivot.position.set(params.pivotX, params.pivotY, params.pivotZ);
  model.position.set(-params.pivotX, -params.pivotY, -params.pivotZ);

  if (axes) axes.position.set(0, 0, 0);
}

let rotationStarted = false;

function startModelRotation() {
  if (!pivot || rotationTween || rotationStarted) return; 

  rotationStarted = true; 

  rotationTween = gsap.to(params, {
    rotY: params.rotY + Math.PI * 2,
    duration: 6,
    ease: "linear",
    repeat: -1,
    onUpdate: () => {
      update();
    },
  });
}

function checkScroll() {
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;
  const viewportHeight = window.innerHeight;

  if (scrollPosition > viewportHeight * 0.075) {
    startModelRotation();
  }
}

window.addEventListener("scroll", checkScroll);

function initGUI() {
  const gui = new dat.GUI({ width: 300 });

  gui.add(params, "scale", 0.1, 5, 0.01).name("Uniform Scale").onChange(update);

  const r = gui.addFolder("Rotation");
  r.add(params, "rotX", -Math.PI, Math.PI, 0.01).name("X").onChange(update);
  r.add(params, "rotY", -Math.PI, Math.PI, 0.01).name("Y").onChange(update);
  r.add(params, "rotZ", -Math.PI, Math.PI, 0.01).name("Z").onChange(update);
  r.open();

  const p = gui.addFolder("Pivot Position");
  p.add(params, "pivotX", -5, 5, 0.01).name("X").onChange(update);
  p.add(params, "pivotY", -5, 5, 0.01).name("Y").onChange(update);
  p.add(params, "pivotZ", -5, 5, 0.01).name("Z").onChange(update);
  p.open();

  gui
    .add(
      {
        reset() {
          Object.assign(params, {
            scale: 1,
            rotX: 0,
            rotY: 0,
            rotZ: 0,
            pivotX: 0,
            pivotY: -1,
            pivotZ: 0,
          });
          update();
          gui.updateDisplay();
        },
      },
      "reset"
    )
    .name("↩︎ Reset All");
}

// Create a function to show the loading progress
function updateLoadingProgress(progress) {
  const loaderPercent = document.querySelector(".loader-progressbar");
  loaderPercent.style.width = `${Math.round(progress * 100)}%`;
}

// Create a function to handle model loading with progress and completion
function loadModelWithProgress(url) {
  const loader = new GLTFLoader();

  loader.load(
    url,
    ({ scene: glb }) => {
      pivot = new THREE.Group();
      scene.add(pivot);

      const bbox = new THREE.Box3().setFromObject(glb);
      glb.position.copy(bbox.min.clone().negate());

      model = glb;
      pivot.add(model);

      update();
      initGUI();

      // Once the model is loaded, add a delay before removing the loading screen
      setTimeout(() => {
        document.querySelector(".loader-progressbar-wrap").classList.add("loaded");
        document.querySelector(".loading-screen").classList.add("loaded");
      }, 600); // 600ms delay after load
    },
    // On progress callback
    (xhr) => {
      updateLoadingProgress(xhr.loaded / xhr.total);
    },
    // On error callback
    (err) => console.error(err)
  );
}

loadModelWithProgress(
  "https://indigo-edge-assets.netlify.app/new-ie_grdient.glb"
);

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

