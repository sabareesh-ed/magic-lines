import "./styles/style.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

gsap.registerPlugin(ScrollTrigger);

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

// ─── Environment ───────────────────────────────────────────────────────
new RGBELoader().load(
  "https://cdn.jsdelivr.net/gh/sabareesh-ed/sail@main/studio_small_06_1k.hdr",
  (hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdr;
  }
);

// ─── Parameters & GUI ──────────────────────────────────────────────────
const params = {
  scale: 0.35,
  rotX: 0.23,
  rotY: 0.51,
  rotZ: 0,
  pivotX: 0,
  pivotY: 0,
  pivotZ: 0,
};

let pivot, model, axes;

function update() {
  if (!pivot || !model) return;

  if (isRendering) {
    pivot.rotation.set(params.rotX, params.rotY, params.rotZ);
    pivot.scale.setScalar(params.scale);

    pivot.position.set(params.pivotX, params.pivotY, params.pivotZ);

    model.position.set(-params.pivotX, -params.pivotY, -params.pivotZ);

    if (axes) axes.position.set(0, 0, 0);
  }
}

// Function to set model color, opacity, and metalness dynamically
function setModelColorOpacityMetalness(colorHex, opacity, metalness) {
  if (!model) return;
  model.traverse((child) => {
    if (child.isMesh && child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((mat) => {
        if (mat.color) mat.color.set(colorHex);

        mat.transparent = opacity < 1 ? true : false;
        mat.opacity = opacity;

        if ('metalness' in mat) {
          mat.metalness = metalness;
        }

        mat.needsUpdate = true;
      });
    }
  });
}

// ─── Model ─────────────────────────────────────────────────────────────


const loader = new GLTFLoader();
const loaderPercent = document.querySelector(".loader-progressbar");

let progress = 0;

loader.load(
  "https://indigo-edge-assets.netlify.app/ie-transparent-2.glb",
  ({ scene: glb }) => {
    pivot = new THREE.Group();
    scene.add(pivot);

    const bbox = new THREE.Box3().setFromObject(glb);
    glb.position.copy(bbox.min.clone().negate());

    model = glb;
    pivot.add(model);

    setModelColorOpacityMetalness(0xffffff, 0.3, 0.7);

    setTimeout(() => {
      loaderPercent.style.width = '100%';
      document.querySelector(".loader-progressbar-wrap").classList.add("loaded");
      document.querySelector('.loading-screen').classList.add('loaded');
    }, 600);

    update();
  },
  (xhr) => {
    progress = (xhr.loaded / xhr.total) * 100;

    loaderPercent.style.width = Math.floor(progress) + '%';
  },
  undefined,
  (err) => console.error(err)
);

const sectionHero = document.querySelector('.section_hero');

function checkScroll() {
  if (!sectionHero) return;

  const rect = sectionHero.getBoundingClientRect();
  if (rect.bottom <= 0) {
    if (isRendering) {
      isRendering = false;
    }
  } else {
    if (!isRendering) {
      isRendering = true;
      animate();
    }
  }
}

window.addEventListener('scroll', checkScroll);

// ─── Render Loop ───────────────────────────────────────────────────────
let isRendering = true;

function animate() {
  if (isRendering) {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
}

animate();

function resetOnScroll() {
  resize();
  update();
  // gui.updateDisplay()
}
window.addEventListener("scroll", resetOnScroll);


// GSAP

gsap.registerPlugin(ScrollTrigger);

const heroTitle = document.getElementById("hero-title");
const absTitle1 = document.querySelector(".abs-title1");
const absTitle2 = document.querySelector(".abs-title2");
const nav = document.querySelector(".nav_fixed");
const hero = document.querySelector(".section_hero");

gsap.set(heroTitle, { opacity: 1, y: 0 });
gsap.set(absTitle1, { opacity: 0, y: 20 }); // start 20px below, hidden
gsap.set(absTitle2, { opacity: 0 });

ScrollTrigger.create({
  trigger: hero,
  start: "top top",
  end: "+=999999",
  onUpdate: (self) => {
    gsap.to(nav, {
      yPercent: self.direction === 1 ? -100 : 0,
      duration: 0.5,
      ease: "power1.out",
    });
  },
});

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
      start: "top -15%",
      toggleActions: "play none none reverse",
    },
  }
);

// const splitHeroTitle = heroTitle
//   ? new SplitType(heroTitle, { types: "chars" })
//   : null;
// if (splitHeroTitle) {
//   gsap.to(splitHeroTitle.chars, {
//     duration: 0.5,
//     stagger: 0.05,
//     scrollTrigger: {
//       trigger: ".section_hero",
//       start: "top-=90% top",
//       end: "33% bottom",
//       scrub: true,
//       toggleActions: "play none none reverse",
//       // onUpdate: (self) => {
//       //   const p = self.progress;
//       //   splitHeroTitle.chars.forEach((c, i) =>
//       //     gsap.set(c, {
//       //       opacity: p > i / splitHeroTitle.chars.length ? 1 : 1,
//       //     })
//       //   );
//       // },
//     },
//   });
// }

[".section_hero", ".section_hero .abs-lines"].forEach((sel, i) => {
  gsap.to(sel, {
    ...(i === 0 ? { backgroundColor: "#0D1434" } : { borderColor: "#919191" }),
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".section_hero",
      start: "55% bottom",
      end: "55% bottom",
      toggleActions: "play none none reverse",
    },
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
    toggleActions: "play none none reverse",
  },
});

gsap.to(".hero-img", {
  y: "-100%",
  duration: 1,
  scrollTrigger: {
    trigger: ".section_hero",
    start: "33% bottom",
    end: "66% bottom",
    scrub: true,
    toggleActions: "play none none reverse",
  },
});

// ----------- Sequential fade + slide transitions -----------
// 1. heroTitle fades up and out (33% → 38%)
ScrollTrigger.create({
  trigger: ".section_hero",
  start: "33% bottom",
  end: "38% bottom",
  scrub: 0.3,
  toggleActions: "restart pause reverse pause", // Ensure it resets on scroll reverse
  onUpdate: (self) => {
    const p = self.progress;
    gsap.set(heroTitle, {
      y: gsap.utils.interpolate(0, -20, p),
      opacity: 1 - p,
    });
  },
});

// 2. absTitle1 fades in and moves up (38% → 43%)
ScrollTrigger.create({ 
  trigger: ".section_hero",
  start: "38% bottom",
  end: "43% bottom",
  scrub: 0.3,
  toggleActions: "restart pause reverse pause", // Ensure it resets on scroll reverse
  onUpdate: (self) => {
    const p = self.progress;
    gsap.set(absTitle1, {
      y: gsap.utils.interpolate(20, 0, p),
      opacity: p,
    });
  },
});


// ----------- absTitle1 chars stagger fade starts after (43% → 66%) -----------

const splitAbsTitle1 = new SplitType(absTitle1, { types: "chars" });
gsap.to(splitAbsTitle1.chars, {
  duration: 0.5,
  stagger: 0.05,
  scrollTrigger: {
    trigger: ".section_hero",
    start: "43% bottom",
    end: "80% bottom",
    scrub: true,
    toggleActions: "play reverse play reverse",
    onUpdate: (self) => {
      const p = self.progress;
      splitAbsTitle1.chars.forEach((c, i) =>
        gsap.set(c, { opacity: p > i / splitAbsTitle1.chars.length ? 1 : 0.3 })
      );
    },
  },
});


const tl2 = gsap.timeline({
  scrollTrigger: {
    trigger: ".section_hero",
    start: "80% bottom",
    end: "100% top",
    scrub: false,
    toggleActions: "play none none reverse",
  },
  defaults: { duration: 0.2 },
});

tl2.to(absTitle1, { opacity: 0 }).to(absTitle2, { opacity: 1 }, 0);

const splitAbsTitle2 = new SplitType(absTitle2, { types: "chars" });
gsap.to(splitAbsTitle2.chars, {
  duration: 0.5,
  stagger: 0.05,
  scrollTrigger: {
    trigger: ".section_hero",
    start: "80% bottom",
    end: "100% bottom",
    scrub: true,
    toggleActions: "play reverse play reverse",
    onUpdate: (self) => {
      const p = self.progress;
      splitAbsTitle2.chars.forEach((c, i) =>
        gsap.set(c, { opacity: p > i / splitAbsTitle2.chars.length ? 1 : 0.3 })
      );
    },
  },
});



const isDesktop = window.innerWidth > 768;

const config = {
  width: "100vw",
  height: isDesktop ? "95vh" : "60vh",
  y: isDesktop ? "-100%" : "-120%",
  left: isDesktop ? "35%" : "20%",
};

gsap.to(".webgl_wrapper", {
  width: config.width,
  height: config.height,
  y: config.y,
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
  left: config.left,
  duration: 1,
  scrollTrigger: {
    trigger: ".section_hero",
    start: "40% bottom",
    end: "90% bottom",
    scrub: true,
    markers: false,
    toggleActions: "play none none reverse",
  },
});

const colorObject = { r: 0xff / 255, g: 0xff / 255, b: 0xff / 255 };
const opacityObject = { value: 0.3 };
const metalnessObject = { value: 0.7 };

gsap.to(colorObject, {
  r: 0x03 / 255,
  g: 0xff / 255,
  b: 0x86 / 255,
  duration: 1,
  scrollTrigger: {
    trigger: ".section_hero",
    start: "65% bottom",
    end: "84% bottom",
    scrub: true,
    markers: false,
    toggleActions: "play none none reverse",
    onUpdate: () => {
      const hex = new THREE.Color(colorObject.r, colorObject.g, colorObject.b);
      setModelColorOpacityMetalness(hex.getHex(), opacityObject.value, metalnessObject.value);
    },
  },
});

gsap.to(opacityObject, {
  value: 0.5,
  duration: 1,
  scrollTrigger: {
    trigger: ".section_hero",
    start: "65% bottom",
    end: "84% bottom",
    scrub: true,
  },
});

gsap.to(metalnessObject, {
  value: 0.7,
  duration: 1,
  scrollTrigger: {
    trigger: ".section_hero",
    start: "65% bottom",
    end: "84% bottom",
    scrub: true,
  },
});

let rotationTween;

function startModelRotation() {
  if (!pivot || rotationTween) return;

  rotationTween = gsap.to(params, {
    rotY: params.rotY + Math.PI * 2, // full rotation
    duration: 6, // slow rotation
    ease: "linear",
    repeat: -1,
    onUpdate: () => {
      update();
    },
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
    },
  });
}

ScrollTrigger.create({
  trigger: ".section_hero",
  start: "84% bottom",
  // end: "bottom bottom",
  onEnter: () => startModelRotation(),
  onEnterBack: () => startModelRotation(),
  onLeave: () => stopModelRotation(),
  onLeaveBack: () => stopModelRotation(),
});

if (window.innerWidth > 767) {
  gsap.to(".team_wrap", {
    x: () => {
      const members =
        document.querySelector(".team-wrap_members")?.offsetWidth || 0;
      const values =
        document.querySelector(".team_wrap-values")?.offsetWidth || 0;
      const container =
        document.querySelector(".container-large")?.offsetWidth || 0;
      return -(members + values - container - 32);
    },
    ease: "none",
    scrollTrigger: {
      trigger: ".hori-scroll-wrap",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });
}

if (window.innerWidth < 767) {
  gsap.to(".team_wrap", {
    x: () => {
      const members =
        document.querySelector(".team-wrap_members")?.offsetWidth || 0;
      const values =
        document.querySelector(".team_wrap-values")?.offsetWidth || 0;
      const container =
        document.querySelector(".container-large")?.offsetWidth || 0;
      return -(members - container );
    },
    ease: "none",
    scrollTrigger: {
      trigger: ".hori-scroll-wrap",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });
  gsap.to("#founders-heading", {
    x: () => {
      const members =
        document.querySelector(".team-wrap_members")?.offsetWidth || 0;
      const values =
        document.querySelector(".team_wrap-values")?.offsetWidth || 0;
      const container =
        document.querySelector(".container-large")?.offsetWidth || 0;
      return (members - container );
    },
    ease: "none",
    scrollTrigger: {
      trigger: ".hori-scroll-wrap",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
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
      start: "top center",
      end: "center center",
      scrub: true,
      //markers: true
    },
  });

  gsap.to(".cta-section-heading", {
    color: "white",
    duration: 1.5,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: ".cta-section",
      start: "top center",
      end: "center center",
      scrub: true,
      //markers: true
    },
  });
}

window.addEventListener("load", () => ScrollTrigger.refresh());

//  MINDSET SECTION — Scroll-driven, single-accent, overlap-safe

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const mindsetItems = document.querySelectorAll(".mindset_item");
  const controlItems = document.querySelectorAll(".mindset_control-item");
  const progressBars = Array.from(controlItems).map((el) =>
    el.querySelector(".progress-bar")
  );
  const sectionMindset = document.querySelector(".section_mindset");
  const bgAbsolute = document.querySelector(".bg-absolute.mindset");

  const mindsets = [
    { bg: "#273570", text: "white", accent: "white" },
    { bg: "#03FF86", text: "black", accent: "black" },
    { bg: "black", text: "#03FF86", accent: "#03FF86" },
  ];

  let current = -1;
  let showTimeout = null;

  /* ── helpers ── */
  function hideAllMindsets() {
    mindsetItems.forEach((item) => {
      item.style.opacity = "0";
      item.style.pointerEvents = "none";
    });
  }

  function updateMindset(index) {
    if (index === current) return;
    if (showTimeout) {
      clearTimeout(showTimeout);
      showTimeout = null;
    }

    const { bg, text, accent } = mindsets[index];

    hideAllMindsets();

    showTimeout = setTimeout(() => {
      const active = mindsetItems[index];
      active.style.opacity = "1";
      active.style.pointerEvents = "auto";

      sectionMindset.style.backgroundColor = bg;

      mindsetItems.forEach((item) => {
        item.querySelector(".mindset_title")?.style.setProperty("color", text);
        item.querySelector(".mindset_tag")?.style.setProperty("color", text);
        item
          .querySelector(".mindset_subtitle")
          ?.style.setProperty("color", text);
      });
    }, 0);

    /* 3 — Controls and shared accent */
    controlItems.forEach((ctrl, i) => {
      ctrl
        .querySelector(".mindset_control-number")
        ?.style.setProperty("color", accent);
      ctrl
        .querySelector(".mindset_control-name")
        ?.style.setProperty("color", accent);
      ctrl.style.opacity = i === index ? "1" : "0.3";
    });

    /* 4 — Progress bars: reset active to 0 %, others stay full */
    progressBars.forEach((bar, i) => {
      bar.style.backgroundColor = accent;
      bar.style.transition = "none"; // kills 100→0 flicker
      bar.style.width = i === index ? "0%" : "100%";
    });

    /* 5 — Overlay colour */
    if (bgAbsolute) bgAbsolute.style.color = accent;

    current = index;
  }

  hideAllMindsets(); // start fully hidden

  /* ────────────────────────── ScrollTrigger setup ────────────────────────── */
  const st = ScrollTrigger.create({
    trigger: sectionMindset,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const total = mindsets.length;
      const raw = self.progress * total;
      const idx = Math.min(total - 1, Math.floor(raw));
      const segProg = raw - idx;

      if (idx !== current) updateMindset(idx);

      const bar = progressBars[idx];
      bar.style.transition = "none";
      bar.style.width = `${(segProg * 100).toFixed(2)}%`;
    },
  });

  const initialIdx = Math.min(
    mindsets.length - 1,
    Math.floor(st.progress * mindsets.length)
  );
  updateMindset(initialIdx);
});
