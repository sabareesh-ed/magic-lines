import "./styles/style.css";

// Imports for GSAP here
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

// ─── 3 JS Imports ──────────────────────────────────────────────────────
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import dat from 'dat.gui';

// ─── Renderer / Scene / Camera ────────────────────────────────────
const canvas   = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping    = THREE.ACESFilmicToneMapping;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight, false);

const scene   = new THREE.Scene();
const camera  = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 5);
scene.add(camera);

const axes   = new THREE.AxesHelper(10);
const camAid = new THREE.CameraHelper(camera);
scene.add(axes, camAid);

// ─── Optional HDRI ────────────────────────────────────────────────
new RGBELoader().load(
  'https://cdn.jsdelivr.net/gh/sabareesh-ed/sail@main/shanghai_bund_2k.hdr',
  // 'https://cdn.jsdelivr.net/gh/armouredmaoG/Recreation-Assets@main/studio_small_09_1k_low.hdr',
  (hdr) => { hdr.mapping = THREE.EquirectangularReflectionMapping; scene.environment = hdr; }
);

// ─── Parameters for GUI ───────────────────────────────────────────
let model;
const params = {
  /* anchoring offsets (pixels) */
  offsetX : 23,
  offsetY : -645,
  offsetZ : 7.65,

  /* transform */
  scale   : 0.07,
  rotX    : 0,
  rotY    : 1.24,
  rotZ    : 0,

  /* helpers */
  showHelpers : true,
};

// ─── Load the GLB ────────────────────────────────────────────────
new GLTFLoader().load(
  'https://indigo-edge-assets.netlify.app/ie-gradient-2.glb',
  ({ scene: glb }) => {
    model = glb;
    scene.add(model);
    model.scale.setScalar(params.scale);
    initGUI();
    updateModelTransform();
  },
  undefined,
  (err) => console.error('GLB load error:', err)
);

// ─── DOM → World utility ─────────────────────────────────────────
function getWorldPositionFromDom({ offsetX = 0, offsetY = 0, offsetZ = 0 }) {
  const rect = { left: offsetX, top: window.innerHeight };

  const { innerWidth:w, innerHeight:h } = window;

  // Centre of element + pixel nudges → Normalised Device Co-ordinates
  const xNDC = ((rect.left + offsetX) / w) * 2 - 1;
  const yNDC = ((rect.top  + offsetY) / h) * -2 + 1;

  // Project out into the world (camera perspective)
  const vector   = new THREE.Vector3(xNDC, yNDC, 0.5).unproject(camera);
  const dir      = vector.clone().sub(camera.position).normalize();
  const distance = camera.position.distanceTo(vector) + offsetZ;

  return camera.position.clone().add(dir.multiplyScalar(distance));
}

// ─── Core positioning routine ────────────────────────────────────
function updateModelTransform() {
  if (!model) return;

  const worldPos = getWorldPositionFromDom({ 
    offsetX: params.offsetX,
    offsetY: params.offsetY,
    offsetZ: params.offsetZ,
  });

  model.position.copy(worldPos);

  // Apply user tweaks (scale, rotation)
  model.scale.setScalar(params.scale);
  model.rotation.set(params.rotX, params.rotY, params.rotZ);

  // Helper visibility
  axes.visible = camAid.visible = params.showHelpers;
}

// ─── dat.GUI setup ───────────────────────────────────────────────
function initGUI() {
  const gui = new dat.GUI({ width: 300 });

  const p = gui.addFolder('Pixel Offsets');
  p.add(params, 'offsetX', -2000,  2000, 1).name('← → X px').onChange(updateModelTransform);
  p.add(params, 'offsetY', -2000,  2000, 1).name('↑ ↓ Y px').onChange(updateModelTransform);
  p.open();

  gui.add(params, 'offsetZ',  -10,   10, 0.01).name('Depth Z').onChange(updateModelTransform);
  gui.add(params, 'scale',     0.1, 5, 0.01).name('Uniform Scale').onChange(updateModelTransform);

  const r = gui.addFolder('Rotation (rad)');
  r.add(params, 'rotX', -Math.PI, Math.PI, 0.01).name('X').onChange(updateModelTransform);
  r.add(params, 'rotY', -Math.PI, Math.PI, 0.01).name('Y').onChange(updateModelTransform);
  r.add(params, 'rotZ', -Math.PI, Math.PI, 0.01).name('Z').onChange(updateModelTransform);
  r.open();

  gui.add(params, 'showHelpers').name('Show Axes & Camera').onChange(updateModelTransform);

  gui.add({ reset() {
    Object.assign(params, {
      offsetX:20, offsetY:-200, offsetZ:0, scale:1,
      rotX:0, rotY:0, rotZ:0
    });
    updateModelTransform();
    gui.updateDisplay();
  } }, 'reset').name('↩︎ Reset All');
}

// ─── Responsiveness ─────────────────────────────────────────────
function onResize() {
  const { innerWidth:w, innerHeight:h } = window;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
  updateModelTransform();
}
window.addEventListener('resize',  onResize,             false);
window.addEventListener('scroll',  updateModelTransform, false);

// ─── Animation loop ─────────────────────────────────────────────
(function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
})();















/* ------------------------------------
   GSAP
   ------------------------------------ */

   gsap.registerPlugin(ScrollTrigger);

   const heroTitle = document.getElementById("hero-title");
   const absTitle1 = document.querySelector(".abs-title1");
   const absTitle2 = document.querySelector(".abs-title2");
   const nav = document.querySelector(".nav_component");
   const hero = document.querySelector(".section_hero");
   
   gsap.set(heroTitle, { opacity: 1 });
   gsap.set(absTitle1, { opacity: 0 });
   gsap.set(absTitle2, { opacity: 0 });
   
   ScrollTrigger.create({
     trigger: hero,
     start: "bottom bottom",
     end: "+=999999",
     onUpdate: self => {
       gsap.to(nav, { yPercent: self.direction === 1 ? -100 : 0, duration: 0.5, ease: "power1.out" });
     }
   });
   
   gsap.fromTo(".scroll-prompt",
     { opacity: 1, yPercent: 0 },
     {
       opacity: 0,
       yPercent: -25,
       duration: 0.4,
       ease: "power2.out",
       immediateRender: false,
       scrollTrigger: {
         trigger: document.body,
         start: "top -15%",
         toggleActions: "play none none reverse"
       }
     }
   );
   
   const splitHeroTitle = heroTitle ? new SplitType(heroTitle, { types: "chars" }) : null;
   if (splitHeroTitle) {
     gsap.to(splitHeroTitle.chars, {
       duration: 0.5,
       stagger: 0.05,
       scrollTrigger: {
         trigger: ".section_hero",
         start: "top-=10% top",
         end: "33% bottom",
         scrub: true,
         toggleActions: "play none none reverse",
         onUpdate: self => {
           const p = self.progress;
           splitHeroTitle.chars.forEach((c, i) => gsap.set(c, { opacity: p > i / splitHeroTitle.chars.length ? 1 : 0.3 }));
         }
       }
     });
   }
   
   [".section_hero", ".section_hero .abs-lines"].forEach((sel, i) => {
     gsap.to(sel, {
       ...(i === 0 ? { backgroundColor: "#273570" } : { borderColor: "white" }),
       duration: 0.5,
       ease: "power2.out",
       scrollTrigger: {
         trigger: ".section_hero",
         start: "55% bottom",
         end: "55% bottom",
         toggleActions: "play none none reverse"
       }
     });
   });
   
   gsap.to([heroTitle, absTitle1, absTitle2], {
     color: "white",
     duration: 0.5,
     ease: "power2.out",
     scrollTrigger: {
       trigger: ".section_hero",
       start: "55% bottom",
       end: "55% bottom",
       toggleActions: "play none none reverse"
     }
   });
   
   gsap.to(".hero-img", {
     y: "-100%",
     duration: 1,
     scrollTrigger: {
       trigger: ".section_hero",
       start: "33% bottom",
       end: "66% bottom",
       scrub: true,
       toggleActions: "play none none reverse"
     }
   });

   

   let spinTween;

   gsap.to(params, {
     offsetX: 37,
     offsetY: -741,
     offsetZ: 3.12,
     ease: "none",
     scrollTrigger: {
       trigger: ".section_hero",
       start: "33% bottom",
       end: "66% bottom",
       scrub: true,
       toggleActions: "play none none reverse",
       onLeave: () => {
         // Scroll finished – animate offsetX to 184
         gsap.to(params, {
           offsetX: 184,
           duration: 1,
           ease: "power2.out",
           onUpdate: updateModelTransform
         });
   
         // Start infinite spin on Y
         spinTween = gsap.to(params, {
           rotY: "+=" + Math.PI * 2,
           duration: 3,
           ease: "linear",
           repeat: -1,
           onUpdate: updateModelTransform
         });
       },
       onEnterBack: () => {
         // Scroll reversed – stop spin and reset values with animation
         if (spinTween) {
           spinTween.kill();
           spinTween = null;
         }
   
         gsap.to(params, {
           offsetX: 37,
           rotY: 1.24,
           duration: 1,
           ease: "power2.out",
           onUpdate: updateModelTransform
         });
       }
     },
     onUpdate: updateModelTransform
   });
   

   
  
   
   const tl = gsap.timeline({
     scrollTrigger: {
       trigger: ".section_hero",
       start: "33% bottom",
       end: "66% top",
       scrub: false,
       toggleActions: "play none none reverse"
     },
     defaults: { duration: 0.2 }
   });
   
   tl.to(heroTitle, { opacity: 0 })
     .to(absTitle1, { opacity: 1 }, 0);
   
   const splitAbsTitle1 = new SplitType(absTitle1, { types: "chars" });
   gsap.to(splitAbsTitle1.chars, {
     duration: 0.5,
     stagger: 0.05,
     scrollTrigger: {
       trigger: ".section_hero",
       start: "33% bottom",
       end: "66% bottom",
       scrub: true,
       toggleActions: "play reverse play reverse",
       onUpdate: self => {
         const p = self.progress;
         splitAbsTitle1.chars.forEach((c, i) => gsap.set(c, { opacity: p > i / splitAbsTitle1.chars.length ? 1 : 0.3 }));
       }
     }
   });
   
   const tl2 = gsap.timeline({
     scrollTrigger: {
       trigger: ".section_hero",
       start: "66% bottom",
       end: "100% top",
       scrub: false,
       toggleActions: "play none none reverse"
     },
     defaults: { duration: 0.2 }
   });
   
   tl2.to(absTitle1, { opacity: 0 })
      .to(absTitle2, { opacity: 1 }, 0);
   
   const splitAbsTitle2 = new SplitType(absTitle2, { types: "chars" });
   gsap.to(splitAbsTitle2.chars, {
     duration: 0.5,
     stagger: 0.05,
     scrollTrigger: {
       trigger: ".section_hero",
       start: "80% bottom",
       end: "99% bottom",
       scrub: true,
       toggleActions: "play reverse play reverse",
       onUpdate: self => {
         const p = self.progress;
         splitAbsTitle2.chars.forEach((c, i) => gsap.set(c, { opacity: p > i / splitAbsTitle2.chars.length ? 1 : 0.3 }));
       }
     }
   });
   
   let modelRotationTween;
   
   gsap.to(window, {
     scrollTrigger: {
       trigger: ".section_hero",
       start: "74% bottom",
       end: "100% bottom",
       scrub: true,
       toggleActions: "play none none reverse",
       onEnter: () => {
         if (window.model) {
           modelRotationTween = gsap.to(window.model.rotation, {
             y: "+=0.6",
             duration: 2.5,
             repeat: -1,
             yoyo: true,
             ease: "power2.inOut"
           });
         }
       },
       onLeaveBack: () => {
         if (window.model && modelRotationTween) {
           modelRotationTween.kill();
           modelRotationTween = null;
           gsap.to(window.model.rotation, { y: 0.3, duration: 1, ease: "power2.out" });
         }
       }
     }
   });
   
   const computeShift = () => {
     const members = document.querySelector(".team-wrap_members")?.offsetWidth || 0;
     const values = document.querySelector(".team_wrap-values")?.offsetWidth || 0;
     const container = document.querySelector(".container-large")?.offsetWidth || 0;
     return -(members + values - container - 32);
   };
   
   gsap.to(".team_wrap", {
     x: computeShift,
     ease: "none",
     scrollTrigger: {
       trigger: ".hori-scroll-wrap",
       start: "top top",
       end: "bottom bottom",
       scrub: true
     }
   });
   
   if (window.innerWidth > 768) {
     gsap.to(".cta-section-image", {
       height: "100vh",
       width: "100vw",
       duration: 1.5,
       ease: "power2.inOut",
       scrollTrigger: {
         trigger: ".cta-section",
         start: "top 1%",
         end: "bottom bottom",
         scrub: false
       }
     });
   
     gsap.to(".cta-section-heading", {
       color: "white",
       duration: 1.5,
       ease: "power2.inOut",
       scrollTrigger: {
         trigger: ".cta-section",
         start: "top 1%",
         end: "bottom bottom",
         scrub: false
       }
     });
   }
   
   window.addEventListener("load", () => ScrollTrigger.refresh());
   