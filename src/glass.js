// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// // ─── Function to Set Model Color ─────────────────────────────────────────────
// function setModelColorOpacityMetalness(model, colorHex, opacity, metalness) {
//   if (!model) return;
//   model.traverse((child) => {
//     if (child.isMesh && child.material) {
//       const materials = Array.isArray(child.material) ? child.material : [child.material];
//       materials.forEach((mat) => {
//         if (mat.color) mat.color.set(colorHex);

//         mat.transparent = opacity < 1 ? true : false;
//         mat.opacity = opacity;

//         if ('metalness' in mat) {
//           mat.metalness = metalness;
//         }

//         mat.needsUpdate = true;
//       });
//     }
//   });
// }

// // ─── Model Loader ───────────────────────────────────────────────────────────
// const loader = new GLTFLoader();
// const modelUrl = 'https://indigo-edge-assets.netlify.app/new-ie_transparent.glb';

// // ─── Canvas Setup ───────────────────────────────────────────────────────────
// document.querySelectorAll('.glass_canvas').forEach((canvasElement) => {
//   const isBgCanvas = canvasElement.classList.contains('bg');
//   const renderer = new THREE.WebGLRenderer({
//     canvas: canvasElement,
//     alpha: true,
//     antialias: true,
//   });
  
//   const scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera(35, canvasElement.clientWidth / canvasElement.clientHeight, 0.1, 100);
//   camera.position.set(0, -1, 10); // Adjust camera position if necessary

//   const light = new THREE.PointLight(0xffffff, 1, 100);
//   light.position.set(10, 10, 10);
//   scene.add(light);

//   loader.load(modelUrl, (gltf) => {
//     const model = gltf.scene;

//     model.rotateY(0.3);
//     scene.add(model);

//     if (!isBgCanvas) {
//       setModelColorOpacityMetalness(model, 0x00ff00, 1, 0.5);
//     }

//     animate(); 
//   });

//   function animate() {
//     renderer.render(scene, camera);
//     requestAnimationFrame(animate);
//   }
// });
