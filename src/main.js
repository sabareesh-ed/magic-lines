import './styles/style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import dat from 'dat.gui'

gsap.registerPlugin(ScrollTrigger)

const canvas = document.querySelector('.webgl')

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  30,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  100
)
camera.position.set(-0.5, 0, 5)
scene.add(camera)

function resize () {
  const { clientWidth: w, clientHeight: h } = canvas.parentElement
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
resize()
window.addEventListener('resize', resize)
// window.addEventListener('scroll', resize)

// ─── Environment ───────────────────────────────────────────────────────
new RGBELoader().load(
  'https://cdn.jsdelivr.net/gh/sabareesh-ed/sail@main/shanghai_bund_2k.hdr',
  hdr => {
    hdr.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = hdr
  }
)

// ─── Parameters & GUI ──────────────────────────────────────────────────
const params = {
  scale: 0.35,
  rotX: 0.23,
  rotY: 0.51,
  rotZ: 0,
  pivotX: 0,
  pivotY: 0,
  pivotZ: 0
}

let pivot, model, axes

function update () {
  if (!pivot || !model) return

  pivot.rotation.set(params.rotX, params.rotY, params.rotZ)
  pivot.scale.setScalar(params.scale)

  pivot.position.set(params.pivotX, params.pivotY, params.pivotZ)

  model.position.set(-params.pivotX, -params.pivotY, -params.pivotZ)

  if (axes) axes.position.set(0, 0, 0)
}

function initGUI () {
  const gui = new dat.GUI({ width: 300 })

  gui.add(params, 'scale', 0.1, 5, 0.01).name('Uniform Scale').onChange(update)

  const r = gui.addFolder('Rotation')
  r.add(params, 'rotX', -Math.PI, Math.PI, 0.01).name('X').onChange(update)
  r.add(params, 'rotY', -Math.PI, Math.PI, 0.01).name('Y').onChange(update)
  r.add(params, 'rotZ', -Math.PI, Math.PI, 0.01).name('Z').onChange(update)
  r.open()

  const p = gui.addFolder('Pivot Position')
  p.add(params, 'pivotX', -5, 5, 0.01).name('X').onChange(update)
  p.add(params, 'pivotY', -5, 5, 0.01).name('Y').onChange(update)
  p.add(params, 'pivotZ', -5, 5, 0.01).name('Z').onChange(update)
  p.open()

  gui.add(
    {
      reset () {
        Object.assign(params, {
          scale: 1,
          rotX: 0,
          rotY: 0,
          rotZ: 0,
          pivotX: 0,
          pivotY: -1,
          pivotZ: 0
        })
        update()
        gui.updateDisplay()
      }
    },
    'reset'
  ).name('↩︎ Reset All')
}

// ─── Model ─────────────────────────────────────────────────────────────
new GLTFLoader().load(
  'https://indigo-edge-assets.netlify.app/ie-gradient-2.glb',
  ({ scene: glb }) => {
    pivot = new THREE.Group()
    scene.add(pivot)

    const bbox = new THREE.Box3().setFromObject(glb)
    glb.position.copy(bbox.min.clone().negate())

    model = glb
    pivot.add(model)

    // axes = new THREE.AxesHelper(5)
    // pivot.add(axes)

    update()
    initGUI()
  },
  undefined,
  err => console.error(err)
)

// ─── Render Loop ───────────────────────────────────────────────────────
function animate () {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()

function resetOnScroll () {
  resize()
  update()
  // gui.updateDisplay()
}
window.addEventListener('scroll', resetOnScroll)







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




   

   if (window.innerWidth > 768) {
     gsap.to(".webgl_wrapper", {
      width: "100vw",
      height: "80vh",
      duration: 1,
      scrollTrigger: {
        trigger: ".section_hero",
        start: "33% bottom",
        end: "69% bottom",
        scrub: true,
        markers: false,
        toggleActions: "play none none reverse",
      },
    });

    gsap.to(".webgl_wrapper", {
      left: "40%",
      duration: 1,
      scrollTrigger: {
        trigger: ".section_hero",
        start: "55% bottom",
        end: "84% bottom",
        scrub: true,
        markers: false,
        toggleActions: "play none none reverse",
      },
    });
   } else {
    // mobile
    gsap.to(".webgl_wrapper", {
      width: "100vw",
      height: "50vh",
      y: "-120%",
      duration: 1,
      scrollTrigger: {
        trigger: ".section_hero",
        start: "33% bottom",
        end: "69% bottom",
        scrub: true,
        markers: false,
        toggleActions: "play none none reverse",
      },
    });

    gsap.to(".webgl_wrapper", {
      left: "20%",
     // y: "-120%", 
      duration: 1,
      scrollTrigger: {
        trigger: ".section_hero",
        start: "55% bottom",
        end: "84% bottom",
        scrub: true,
        markers: false,
        toggleActions: "play none none reverse",
      },
    }); 
   }


    let rotationTween;

    function startModelRotation() {
      if (!pivot || rotationTween) return;

      rotationTween = gsap.to(params, {
        rotY: params.rotY + Math.PI * 2, // full rotation
        duration: 6,                     // slow rotation
        ease: "none",
        repeat: -1,
        onUpdate: () => {
          update();
        }
      });
    }

    function stopModelRotation() {
      if (rotationTween) {
        rotationTween.kill();
        rotationTween = null;
      }
      // Animate rotY back to original 0.51 smoothly
      gsap.to(params, {
        rotY: 0.51,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => {
          update();
        }
      });
    }

    ScrollTrigger.create({
      trigger: ".section_hero",
      start: "84% bottom",
      end: "bottom bottom",
      onEnter: () => startModelRotation(),
      onEnterBack: () => startModelRotation(),
      onLeave: () => stopModelRotation(),
      onLeaveBack: () => stopModelRotation(),
    });


    
  
   
 if (window.innerWidth > 767) {
  gsap.to(".team_wrap", {
    x: () => {
      const members = document.querySelector(".team-wrap_members")?.offsetWidth || 0;
      const values = document.querySelector(".team_wrap-values")?.offsetWidth || 0;
      const container = document.querySelector(".container-large")?.offsetWidth || 0;
      return -(members + values - container - 32);
    },
    ease: "none",
    scrollTrigger: {
      trigger: ".hori-scroll-wrap",
      start: "top top",
      end: "bottom bottom",
      scrub: true
    }
  });
}

   
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
   