import "./styles/style.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const heroTitle = document.getElementById("hero-title");
const absTitle1 = document.querySelector(".abs-title1");
const absTitle2 = document.querySelector(".abs-title2");

// const movableAbsLine = document.querySelector('[gsap-move-abs]');

//window.scrollTo(0, 1);
// gsap.to(window, { duration: 2, scrollTo: 0 });

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
