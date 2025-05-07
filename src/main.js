import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import "./styles/style.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";


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

console.log("script loaded");

const envStudio = "https://cdn.jsdelivr.net/gh/sabareesh-ed/sail@main/shanghai_bund_2k.hdr";
const rgbeLoader = new RGBELoader();
rgbeLoader.load(envStudio, function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

const loader = new GLTFLoader();
let model;

// Track loading progress
loader.load('https://indigo-edge-assets.netlify.app/test-02.glb', 
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


// GSAP 


gsap.registerPlugin(ScrollTrigger);

const heroTitle = document.getElementById("hero-title");
const absTitle1 = document.querySelector(".abs-title1");
const absTitle2 = document.querySelector(".abs-title2");

// const movableAbsLine = document.querySelector('[gsap-move-abs]');

//window.scrollTo(0, 1);
// gsap.to(window, { duration: 2, scrollTo: 0 });

console.log("script loaded");

if (heroTitle) {
  gsap.fromTo(
    ".scroll-prompt",
    { opacity: 1, yPercent: 0 },
    {
      opacity: 0,
      yPercent: -25,
      duration: 0.4,
      ease: "power2.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: document.body,
        start: "top -10%",
        toggleActions: "play none none reverse",
      },
    }
  );

  const splitHeroTitle = new SplitType(heroTitle, { types: "chars" });

  gsap.to(splitHeroTitle.chars, {
    duration: 0.5,
    stagger: 0.05,
    scrollTrigger: {
      trigger: ".section_hero",
      start: "top-=8% top",
      end: "33% bottom",
      scrub: true,
      markers: false,
      toggleActions: "play none none reverse",
      onUpdate: (self) => {
        const progress = self.progress;
        splitHeroTitle.chars.forEach((char, index) => {
          const opacity =
            progress > index / splitHeroTitle.chars.length ? 1 : 0.3;
          gsap.to(char, { opacity: opacity });
        });
      },
    },
  });

  gsap.to(".webgl_wrapper", {
    width: "22vw",
    height: "75vh",
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

  // New GSAP Animations start here
  gsap.to(".heading-style-h1", {
    color: "white",
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".section_hero",
      start: "55% bottom",
      end: "55% bottom",
      toggleActions: "play none none reverse",
      markers: false,
    },
  });

  gsap.to(".section_hero", {
    backgroundColor: "#273570",
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".section_hero",
      start: "55% bottom",
      end: "55% bottom",
      toggleActions: "play none none reverse",
      markers: false,
    },
  });

  gsap.to(".section_hero .abs-lines", {
    borderColor: "white",
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".section_hero",
      start: "55% bottom",
      end: "55% bottom",
      toggleActions: "play none none reverse",
      markers: false,
    },
  });
  // New GSAP Animations end here

  gsap.to(".hero-img", {
    y: "-100%",
    duration: 1,
    scrollTrigger: {
      trigger: ".section_hero",
      start: "33% bottom",
      end: "66% bottom",
      scrub: true,
      markers: false,
      toggleActions: "play none none reverse",
    },
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".section_hero",
      start: "33% bottom",
      end: "66% top",
      scrub: false,
      markers: false,
      toggleActions: "play none none reverse",
      onReverseComplete: () => {
        gsap.set(heroTitle, { opacity: 1 });
        gsap.set(absTitle1, { opacity: 0 });
      },
    },
  });

  tl.to(heroTitle, {
    opacity: 0,
    duration: 0.2,
  }).to(absTitle1, {
    opacity: 1,
    duration: 0.2,
    delay: 0,
  });

  const splitAbsTitle1 = new SplitType(absTitle1, { types: "chars" });
  gsap.to(splitAbsTitle1.chars, {
    duration: 0.5,
    stagger: 0.05,
    scrollTrigger: {
      trigger: ".section_hero",
      start: "33% bottom",
      end: "66% bottom",
      scrub: true,
      markers: false,
      toggleActions: "play reverse play reverse",
      onUpdate: (self) => {
        const progress = self.progress;
        splitAbsTitle1.chars.forEach((char, index) => {
          const opacity =
            progress > index / splitAbsTitle1.chars.length ? 1 : 0.3;
          gsap.to(char, { opacity: opacity });
        });
      },
    },
  });

  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".section_hero",
      start: "66% bottom",
      end: "100% top",
      scrub: false,
      markers: false,
      toggleActions: "play none none reverse",
      onReverseComplete: () => {
        gsap.set(absTitle1, { opacity: 1 });
        gsap.set(absTitle2, { opacity: 0 });
      },
    },
  });

  tl2
    .to(absTitle1, {
      opacity: 0,
      duration: 0.2,
    })
    .to(absTitle2, {
      opacity: 1,
      duration: 0.2,
      delay: 0,
    });

  const splitAbsTitle2 = new SplitType(absTitle2, { types: "chars" });
  gsap.to(splitAbsTitle2.chars, {
    duration: 0.5,
    stagger: 0.05,
    scrollTrigger: {
      trigger: ".section_hero",
      start: "80% bottom",
      end: "99% bottom",
      scrub: true,
      markers: false,
      toggleActions: "play reverse play reverse",
      onUpdate: (self) => {
        const progress = self.progress;
        splitAbsTitle2.chars.forEach((char, index) => {
          const opacity =
            progress > index / splitAbsTitle2.chars.length ? 1 : 0.3;
          gsap.to(char, { opacity: opacity });
        });
      },
      onLeave: () => {
        gsap.set(heroTitle, { opacity: 0 });
        gsap.set(absTitle1, { opacity: 0 });
      },
    },
  });
}

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

let modelRotationTween;

gsap.to(window, {
  scrollTrigger: {
    trigger: ".section_hero",
    start: "74% bottom",
    end: "100% bottom",
    scrub: true,
    markers: false,
    toggleActions: "play none none reverse",
    onEnter: () => {
      if (window.model) {
        modelRotationTween = gsap.to(window.model.rotation, {
          y: "+=0.6",
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        });
      }
    },
    onLeaveBack: () => {
      if (window.model && modelRotationTween) {
        modelRotationTween.kill();
        modelRotationTween = null;

        gsap.to(window.model.rotation, {
          y: 0.3,
          duration: 1,
          ease: "power2.out",
        });
      }
    },
  },
});

const computeShift = () => {
  const members =
    document.querySelector(".team-wrap_members")?.offsetWidth || 0;
  const values = document.querySelector(".team_wrap-values")?.offsetWidth || 0;
  const container =
    document.querySelector(".container-large")?.offsetWidth || 0;
  return -(members + values - container - 32);
};

gsap.to(".team_wrap", {
  x: computeShift,
  ease: "none",
  scrollTrigger: {
    trigger: ".hori-scroll-wrap",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    markers: false,
    toggleActions: "play none none reverse",
  },
});

if (window.innerWidth > 768) {
  gsap.to(".footer-image", {
    height: "100vh",
    width: "100vw",
    duration: 1.5,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: ".footer",
      start: "top 1%",
      end: "bottom bottom",
      scrub: false,
      markers: false,
      toggleActions: "play none none reverse",
    },
  });

  gsap.to(".footer-heading", {
    color: "white",
    duration: 1.5,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: ".footer",
      start: "top 1%",
      end: "bottom bottom",
      scrub: false,
      markers: false,
      toggleActions: "play none none reverse",
    },
  });
}

