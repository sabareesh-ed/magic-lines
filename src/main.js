import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const scene = new THREE.Scene();
const canvas = document.querySelector(".webgl");
const webglWrapper = document.querySelector(".webgl_wrapper");
const camera = new THREE.PerspectiveCamera(10, webglWrapper.offsetWidth / webglWrapper.offsetHeight, 0.1, 100);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});
renderer.setSize(webglWrapper.offsetWidth, webglWrapper.offsetHeight);
webglWrapper.appendChild(renderer.domElement);

renderer.setClearColor(0x000000, 0);

const gui = new dat.GUI();

const modelPosition = {
  x: 0,
  y: -10.5,
  z: 0
};

const envStudio = "https://cdn.jsdelivr.net/gh/sabareesh-ed/sail@main/shanghai_bund_2k.hdr";
const rgbeLoader = new RGBELoader();
rgbeLoader.load(envStudio, function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

const loader = new GLTFLoader();
let model;

// Track loading progress
loader.load('https://indigo-edge-assets.netlify.app/logo.glb', 
    (gltf) => {
        model = gltf.scene;
        model.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshPhysicalMaterial({
                   // color: 0xadd8e6,
                    metalness: 0.3,
                    roughness: 0.2,
                    opacity: 0.8,
                    transparent: true,
                    clearcoat: 1,
                    clearcoatRoughness: 0.1,
                    ior: 1.5,
                    envMapIntensity: 1,
                    reflectivity: 1,
                    transmission: 1,
                });
            }
        });

        scene.add(model);
        model.rotation.set(0, 0.5, 0);
        window.model = model;

        gui.add(modelPosition, 'x', -50, 50).name('Position X');
        gui.add(modelPosition, 'y', -50, 50).name('Position Y');
        gui.add(modelPosition, 'z', -50, 50).name('Position Z');

        // Once model is loaded, hide loading screen
        
        setTimeout(() => {
          document.querySelector('.loading-screen').classList.add('loaded');
        }, 500);
        
    },

    // onProgress callback
    (xhr) => {
        const percent = (xhr.loaded / xhr.total) * 100;
        document.querySelector('.loader-text').textContent = `${Math.round(percent)}%`;
    },

    // onError callback
    (error) => {
        console.error("An error occurred while loading the model", error);
    }
);

camera.position.z = 30;
camera.position.y = 8;
camera.lookAt(0, 0, 0);

function animate() {
    requestAnimationFrame(animate);

    if (model) {
        model.position.set(modelPosition.x, modelPosition.y, modelPosition.z);
    }

    renderer.render(scene, camera);
}

function updateRendererAndCamera() {
    const width = webglWrapper.offsetWidth;
    const height = webglWrapper.offsetHeight;
    
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

// Trigger resize on window resize
window.addEventListener('resize', updateRendererAndCamera);

// Trigger resize on scroll
window.addEventListener('scroll', updateRendererAndCamera);

animate();
