import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './styles.css';

const SECTION_THEMES = {
  blue: {
    className: 'theme-blue',
    primary: '#0627ff',
    secondary: '#03e5f0',
    glow: '#7bf9ff',
  },
  orange: {
    className: 'theme-orange',
    primary: '#ff3d12',
    secondary: '#ffe100',
    glow: '#fffb8a',
  },
  green: {
    className: 'theme-green',
    primary: '#00df24',
    secondary: '#e8ff00',
    glow: '#c7ff5b',
  },
  deep: {
    className: 'theme-deep',
    primary: '#041cff',
    secondary: '#00d7ff',
    glow: '#ffffff',
  },
};

const sections = [
  {
    id: 'installing',
    type: 'install',
    headline: 'ATHORA',
    subcopy: 'Installing...',
    theme: 'blue',
    modelState: { x: 0, y: 0.16, z: 0, scale: 0.77, rotate: 0, scene: 3, opacity: 0.12 },
  },
  {
    id: 'intro',
    type: 'intro',
    headline: 'ATHORA',
    subcopy: 'Scroll down',
    theme: 'blue',
    modelState: { x: 0, y: -0.04, z: 0, scale: 0.86, rotate: 0, scene: 3, opacity: 1, asset: 'screen1', spin: 0 },
  },
  {
    id: 'all-systems',
    type: 'systems',
    pretitle: 'every day PEOPLE manage',
    items: ['Hydration', 'Energy', 'Vitamins', 'Immunity'],
    theme: 'blue',
    figmaVariant: 'hydration',
    figmaCan: '/figma-systems/hydration-can-render.png',
    modelState: { x: 1.72, y: 0.05, z: 0, scale: 1.12, rotate: -0.46, scene: 3, opacity: 0 },
  },
  {
    id: 'energy',
    type: 'systems',
    pretitle: 'every day PEOPLE manage',
    items: ['Energy', 'Vitamins', 'Immunity'],
    theme: 'orange',
    figmaVariant: 'energy',
    figmaCan: '/figma-systems/energy-can-render.png',
    modelState: { x: 1.85, y: 0.05, z: 0, scale: 1.02, rotate: 0.72, scene: 3, opacity: 0 },
  },
  {
    id: 'vitamins',
    type: 'systems',
    pretitle: 'every day PEOPLE manage',
    items: ['Vitamins', 'Immunity'],
    theme: 'green',
    figmaVariant: 'vitamins',
    figmaCan: '/figma-systems/vitamins-can-render.png',
    modelState: { x: 1.65, y: 0.08, z: 0, scale: 1.02, rotate: -0.25, scene: 3, opacity: 0 },
  },
  {
    id: 'five-products',
    type: 'claim',
    headline: '5 products 1 body',
    theme: 'blue',
    modelState: { x: 0, y: 0.1, z: 0, scale: 0.82, rotate: 0.15, scene: 3, opacity: 0.22 },
  },
  {
    id: 'separate',
    type: 'claim',
    headline: 'WHY ARe They separate?',
    theme: 'blue',
    modelState: { x: -1.9, y: -0.05, z: 0, scale: 0.9, rotate: -0.8, scene: 3, opacity: 0.4 },
  },
  {
    id: 'simplified',
    type: 'claim',
    headline: 'So We simplified it',
    theme: 'blue',
    modelState: { x: 1.9, y: -0.05, z: 0, scale: 0.9, rotate: 0.85, scene: 3, opacity: 0.4 },
  },
  {
    id: 'lineup',
    type: 'lineup',
    headline: 'ATHORA',
    theme: 'blue',
    modelState: { x: 0, y: -0.2, z: 0, scale: 0.82, rotate: 0.25, scene: 3, opacity: 0 },
  },
  {
    id: 'daily',
    type: 'claim',
    headline: 'one daily drink',
    theme: 'blue',
    modelState: { x: 0.1, y: 0.05, z: 0, scale: 0.96, rotate: -0.15, scene: 3, opacity: 0.32 },
  },
  {
    id: 'open-can',
    type: 'open',
    headline: 'NO pills no powders',
    cta: 'Open',
    theme: 'blue',
    modelState: { x: 0, y: 0, z: 0, scale: 1.12, rotate: 0.15, scene: 3, opacity: 1 },
  },
  {
    id: 'ten-day',
    type: 'price',
    pretitle: 'multiple products',
    headline: '$10+ / day',
    footnote: '*',
    theme: 'blue',
    modelState: { x: -1.85, y: 0.08, z: 0, scale: 0.88, rotate: -0.75, scene: 3, opacity: 0.45 },
  },
  {
    id: 'one-day',
    type: 'price',
    headline: '$1 / day',
    footnote: '*',
    sideNumbers: ['5', '4'],
    theme: 'blue',
    modelState: { x: 1.85, y: 0.05, z: 0, scale: 0.88, rotate: 0.75, scene: 3, opacity: 0.45 },
  },
  {
    id: 'fruit',
    type: 'benefits',
    items: ['Real Fruit', 'zero added sugar', '40 Calories'],
    theme: 'blue',
    modelState: { x: -2.4, y: -0.05, z: 0, scale: 1.05, rotate: -0.55, scene: 3, opacity: 1 },
  },
  {
    id: 'electrolytes',
    type: 'split-claim',
    headline: '1,000+ mg electrolytes',
    theme: 'blue',
    modelState: { x: 2.35, y: -0.1, z: 0, scale: 1.14, rotate: 0.55, scene: 3, opacity: 1 },
  },
  {
    id: 'simplicity',
    type: 'claim',
    headline: 'NOT MORE PRODUCTS JUST SIMPLICITY',
    theme: 'blue',
    modelState: { x: 0, y: 0.05, z: 0, scale: 0.84, rotate: 0, scene: 3, opacity: 0.22 },
  },
  {
    id: 'access',
    type: 'access',
    headline: 'get first Access',
    inputLabel: 'enter your EMAIL',
    legal: 'By joining, you agree to the Terms and Privacy Policy',
    theme: 'blue',
    modelState: { x: 1.75, y: 0.05, z: 0, scale: 1.02, rotate: 0.62, scene: 3, opacity: 1 },
  },
];

const INTRO_REVEAL_PREP_MS = 320;
const INTRO_REVEAL_DURATION_MS = 900;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function interpolateState(a, b, t) {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    z: lerp(a.z, b.z, t),
    scale: lerp(a.scale, b.scale, t),
    rotate: lerp(a.rotate, b.rotate, t),
    opacity: lerp(a.opacity, b.opacity, t),
    spin: lerp(a.spin ?? 0.26, b.spin ?? 0.26, t),
    asset: t < 0.5 ? a.asset : b.asset,
    scene: t < 0.5 ? a.scene : b.scene,
  };
}

function useScrollModelState() {
  const [state, setState] = useState({
    progress: 0,
    activeIndex: 0,
    sectionProgress: 0,
    showNav: false,
    modelState: sections[0].modelState,
  });

  useEffect(() => {
    let frame = 0;

    const alignHashSection = () => {
      if (!window.location.hash) return;
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) {
        window.scrollTo({ top: target.offsetTop, behavior: 'auto' });
      }
    };

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const sectionHeight = Math.max(window.innerHeight, 1);
        const rawIndex = window.scrollY / sectionHeight;
        const activeIndex = clamp(Math.floor(rawIndex), 0, sections.length - 1);
        const sectionProgress = clamp(rawIndex - activeIndex, 0, 1);
        const current = sections[activeIndex].modelState;
        const next = sections[Math.min(activeIndex + 1, sections.length - 1)].modelState;
        const showNav = rawIndex >= 0.72 || window.location.hash === '#intro';

        setState({
          progress: rawIndex / Math.max(sections.length - 1, 1),
          activeIndex,
          sectionProgress,
          showNav,
          modelState: interpolateState(current, next, sectionProgress),
        });
      });
    };

    const sync = () => {
      alignHashSection();
      update();
    };

    update();
    const delayedUpdates = [80, 220, 480, 900].map((delay) => window.setTimeout(sync, delay));
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', sync);
    window.addEventListener('hashchange', sync);
    window.addEventListener('load', sync);
    return () => {
      cancelAnimationFrame(frame);
      delayedUpdates.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', sync);
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('load', sync);
    };
  }, []);

  return state;
}

function normalizeObject(object, targetHeight = 3.35) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  object.position.sub(center);
  const largestAxis = Math.max(size.x, size.y, size.z);
  if (largestAxis > 0) {
    object.scale.setScalar(targetHeight / largestAxis);
  }
}

function AthoraScene({ modelState }) {
  const mountRef = useRef(null);
  const modelStateRef = useRef(modelState);

  useEffect(() => {
    modelStateRef.current = modelState;
  }, [modelState]);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.1, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const modelWrap = new THREE.Group();
    root.add(modelWrap);

    const fallback = createFallbackCan();
    modelWrap.add(fallback);

    const sceneVariants = [];
    const assetVariants = { fallback };
    let activeVariant = fallback;

    const loader = new GLTFLoader();
    const prepareClone = (clone, targetHeight = 3.35) => {
      clone.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            child.material = Array.isArray(child.material)
              ? materials.map((material) => material.clone())
              : child.material.clone();
            const clonedMaterials = Array.isArray(child.material) ? child.material : [child.material];
            clonedMaterials.forEach((material) => {
              material.transparent = material.transparent || material.opacity < 1;
              material.needsUpdate = true;
            });
          }
        }
      });
      normalizeObject(clone, targetHeight);
      clone.visible = false;
      modelWrap.add(clone);
      return clone;
    };

    loader.load(
      '/blender-files/Final.glb',
      (gltf) => {
        gltf.scenes.forEach((variant, index) => {
          const clone = variant.clone(true);
          if (index === 0) {
            const sceneHelpers = [];
            clone.traverse((child) => {
              const materials = child.material ? (Array.isArray(child.material) ? child.material : [child.material]) : [];
              const materialNames = materials.map((material) => material.name);
              if (child.name === 'Cylinder.004' || materialNames.includes('Glow') || materialNames.includes('Base.001')) {
                sceneHelpers.push(child);
              }
            });
            sceneHelpers.forEach((child) => child.parent?.remove(child));
          }
          sceneVariants[index] = prepareClone(clone, 3.35);
          sceneVariants[index].visible = index === (modelStateRef.current.scene || 0);
        });

        activeVariant = sceneVariants[modelStateRef.current.scene] || fallback;
      },
      undefined,
      () => {
        fallback.visible = true;
      }
    );

    loader.load(
      '/blender-files/screens/1screen.glb',
      (gltf) => {
        const clone = gltf.scene.clone(true);
        const helpers = [];
        clone.traverse((child) => {
          const materials = child.material ? (Array.isArray(child.material) ? child.material : [child.material]) : [];
          const materialNames = materials.map((material) => material.name);
          if (child.name === 'Cylinder.004' || materialNames.includes('Glow') || materialNames.includes('Base.001')) {
            helpers.push(child);
          }
        });
        helpers.forEach((child) => child.parent?.remove(child));
        assetVariants.screen1 = prepareClone(clone, 3.35);
      },
      undefined,
      () => {
        assetVariants.screen1 = undefined;
      }
    );

    scene.add(new THREE.AmbientLight(0xffffff, 1.9));
    const key = new THREE.DirectionalLight(0xffffff, 3.4);
    key.position.set(3, 5, 4);
    scene.add(key);
    const cyan = new THREE.PointLight(0x00ecff, 64, 9);
    cyan.position.set(-3, -1.8, 2.8);
    scene.add(cyan);
    const blue = new THREE.PointLight(0x0427ff, 36, 8);
    blue.position.set(2.6, -2.2, 3.2);
    scene.add(blue);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener('resize', resize);

    const clock = new THREE.Clock();
    let raf = 0;

    const animate = () => {
      clock.getDelta();
      const elapsed = clock.elapsedTime;
      const target = modelStateRef.current;

      const wantedVariant = target.asset ? assetVariants[target.asset] || fallback : sceneVariants[target.scene] || fallback;
      if (wantedVariant !== activeVariant) {
        if (activeVariant) activeVariant.visible = false;
        wantedVariant.visible = true;
        activeVariant = wantedVariant;
      }

      modelWrap.position.x = lerp(modelWrap.position.x, target.x, 0.06);
      modelWrap.position.y = lerp(modelWrap.position.y, target.y, 0.06);
      modelWrap.position.z = lerp(modelWrap.position.z, target.z, 0.06);
      const viewportScale = mount.clientWidth < 620 ? 0.92 : 1;
      const liveScale = target.scale * viewportScale * (1 + Math.sin(elapsed * 1.5) * 0.012);
      modelWrap.scale.setScalar(lerp(modelWrap.scale.x, liveScale, 0.06));
      modelWrap.rotation.y = lerp(modelWrap.rotation.y, target.rotate + elapsed * (target.spin ?? 0.26), 0.05);
      modelWrap.rotation.z = lerp(modelWrap.rotation.z, Math.sin(elapsed * 0.6) * 0.055, 0.05);

      modelWrap.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => {
            if (material.userData.baseOpacity === undefined) {
              material.userData.baseOpacity = material.opacity ?? 1;
            }
            material.opacity = material.userData.baseOpacity * target.opacity;
            material.transparent = material.transparent || material.opacity < 1;
          });
        }
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      scene.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => material.dispose());
        }
      });
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="scene" ref={mountRef} aria-label="ATHORA 3D product model" />;
}

function createFallbackCan() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.58, 2.45, 96, 1, false),
    new THREE.MeshPhysicalMaterial({
      color: 0x1de4ff,
      metalness: 0.48,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      emissive: 0x003cff,
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: 0.95,
    })
  );
  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(0.585, 0.585, 0.88, 96, 1, true, -0.72, 1.44),
    new THREE.MeshStandardMaterial({ color: 0x0528ff, metalness: 0.25, roughness: 0.24, transparent: true, opacity: 0.96 })
  );
  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 0.055, 96),
    new THREE.MeshStandardMaterial({ color: 0xf6fbff, metalness: 0.92, roughness: 0.2 })
  );
  const bottom = top.clone();
  top.position.y = 1.25;
  bottom.position.y = -1.25;
  group.add(body, label, top, bottom);
  return group;
}

function ChromeDots() {
  const socials = [
    { label: 'Instagram', icon: '/figma-nav/social-instagram.svg' },
    { label: 'X', icon: '/figma-nav/social-x.svg' },
    { label: 'TikTok', icon: '/figma-nav/social-tiktok.svg' },
  ];

  return (
    <div className="chrome-dots" aria-label="Social links">
      {socials.map((item) => (
        <a className="social-button" href="#intro" aria-label={item.label} key={item.label}>
          <img src={item.icon} alt="" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

function AthoraLogo({ large = false }) {
  return (
    <div className={large ? 'athora-logo athora-logo-large' : 'athora-logo'} aria-label="ATHORA">
      <img className="athora-logo-image" src="/athora-logo.svg" alt="" aria-hidden="true" />
    </div>
  );
}

function FigmaHeroBackground() {
  return (
    <div className="figma-hero-bg" aria-hidden="true">
      <div className="figma-hero-bg-canvas">
        <img className="figma-bg-base" src="/figma-hero/background-main.png" alt="" />
        <img className="figma-bg-berry" src="/figma-hero/berry-right-cutout.png" alt="" />
      </div>
    </div>
  );
}

function Navigation({ activeIndex, showNav }) {
  return (
    <header className={showNav ? 'site-nav' : 'site-nav site-nav-hidden'}>
      <img className="nav-frame-glass" src="/figma-nav/nav-frame.svg" alt="" aria-hidden="true" />
      <ChromeDots />
      <a className="nav-mark" href="#installing" aria-label="ATHORA home">
        <img src="/figma-nav/nav-union.svg" alt="" aria-hidden="true" />
      </a>
      <nav aria-label="Primary navigation">
        <a href="#all-systems">Product</a>
        <a href="#simplicity">System</a>
        <a className="nav-pill" href="#access">Get access</a>
      </nav>
      <div className="section-count" aria-label={`Section ${activeIndex + 1} of ${sections.length}`}>
        {String(activeIndex + 1).padStart(2, '0')} / {sections.length}
      </div>
    </header>
  );
}

function InstallSection({ section, onIntroReveal }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const duration = 2600;
    const startedAt = performance.now();

    const tick = (now) => {
      const elapsed = now - startedAt;
      const progressValue = clamp(elapsed / duration, 0, 1);
      setProgress(Math.round(progressValue * 100));
      if (elapsed < duration) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (progress < 100) return undefined;

    const timer = window.setTimeout(() => {
      onIntroReveal?.();
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [onIntroReveal, progress]);

  return (
    <section className={`panel install-panel ${SECTION_THEMES[section.theme].className}`} id={section.id}>
      <AthoraLogo large />
      <div
        className="install-meter"
        aria-label={`Installation progress ${progress} percent`}
        style={{ '--progress': `${progress}%` }}
      >
        <div className="install-fill" />
        <strong>{progress}%</strong>
      </div>
      <img className="install-copy-image" src="/installing-text.svg" alt={section.subcopy} />
    </section>
  );
}

function PreloaderTransitionOverlay({ phase }) {
  if (phase === 'idle' || phase === 'done') return null;

  return (
    <div className={`intro-reveal-overlay intro-reveal-overlay-${phase}`} aria-hidden="true">
      <div className="intro-reveal-can" />
      <div className="intro-reveal-ui">
        <AthoraLogo large />
        <div className="install-meter" aria-label="Installation progress 100 percent" style={{ '--progress': '100%' }}>
          <div className="install-fill" />
          <strong>100%</strong>
        </div>
        <img className="install-copy-image" src="/installing-text.svg" alt="" />
      </div>
    </div>
  );
}

function IntroSection({ section }) {
  return (
    <section className={`panel intro-panel ${SECTION_THEMES[section.theme].className}`} id={section.id}>
      <FigmaHeroBackground />
      <div className="intro-controls" aria-hidden="true">
        <button className="glass-arrow glass-arrow-left" type="button" tabIndex="-1">
          <span />
        </button>
        <button className="glass-arrow glass-arrow-right" type="button" tabIndex="-1">
          <span />
        </button>
      </div>
      <p className="intro-scroll">{section.subcopy}</p>
    </section>
  );
}

function SystemsSection({ section }) {
  const isFigmaSystems = Boolean(section.figmaVariant);

  return (
    <section
      className={`panel systems-panel ${
        isFigmaSystems ? `systems-panel-figma systems-panel-figma-${section.figmaVariant}` : ''
      } ${SECTION_THEMES[section.theme].className}`}
      id={section.id}
    >
      <div className="systems-copy">
        <p className="pretitle">{section.pretitle}</p>
        <div className="systems-list">
          {section.items.map((item, index) => (
            <h2 className={isFigmaSystems ? `systems-word systems-word-${index}` : ''} key={item}>
              {item}
            </h2>
          ))}
        </div>
      </div>
      {isFigmaSystems && (
        <img
          className={`systems-figma-can systems-figma-can-${section.figmaVariant}`}
          src={section.figmaCan}
          alt=""
          aria-hidden="true"
        />
      )}
      <ScrollDown />
    </section>
  );
}

function ClaimSection({ section }) {
  return (
    <section className={`panel claim-panel ${SECTION_THEMES[section.theme].className}`} id={section.id}>
      <h2>{section.headline}</h2>
      <ScrollDown />
    </section>
  );
}

function ProductLineupSection({ section }) {
  const cans = ['#9cff00', '#1bdfff', '#2350ff', '#ff4917'];
  return (
    <section className={`panel lineup-panel ${SECTION_THEMES[section.theme].className}`} id={section.id}>
      <div className="lineup-cans" aria-hidden="true">
        {cans.map((color, index) => (
          <span className="lineup-can" style={{ '--can-color': color, '--index': index }} key={color}>
            <b>A</b>
          </span>
        ))}
      </div>
      <AthoraLogo large />
      <ScrollDown />
    </section>
  );
}

function OpenSection({ section }) {
  return (
    <section className={`panel open-panel ${SECTION_THEMES[section.theme].className}`} id={section.id}>
      <h2>{section.headline}</h2>
      <button type="button" className="open-button">
        {section.cta}
      </button>
    </section>
  );
}

function PriceSection({ section }) {
  return (
    <section className={`panel price-panel ${SECTION_THEMES[section.theme].className}`} id={section.id}>
      {section.sideNumbers && (
        <div className="side-numbers" aria-hidden="true">
          {section.sideNumbers.map((number) => (
            <span key={number}>{number}</span>
          ))}
        </div>
      )}
      {section.pretitle && <p className="pretitle">{section.pretitle}</p>}
      <h2>
        {section.headline}
        {section.footnote && <sup>{section.footnote}</sup>}
      </h2>
      <ScrollDown />
    </section>
  );
}

function BenefitsSection({ section }) {
  return (
    <section className={`panel benefits-panel ${SECTION_THEMES[section.theme].className}`} id={section.id}>
      <div className="benefits-list">
        {section.items.map((item, index) => (
          <p className={index === 1 ? 'large-benefit' : ''} key={item}>
            {item}
          </p>
        ))}
      </div>
      <ScrollDown />
    </section>
  );
}

function SplitClaimSection({ section }) {
  return (
    <section className={`panel split-claim-panel ${SECTION_THEMES[section.theme].className}`} id={section.id}>
      <h2>{section.headline}</h2>
      <ScrollDown />
    </section>
  );
}

function AccessSection({ section }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className={`panel access-panel ${SECTION_THEMES[section.theme].className}`} id={section.id}>
      <div className="access-copy">
        <h2>{section.headline}</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <label>
            <span>{section.inputLabel}</span>
            <input type="email" required placeholder="you@domain.com" />
          </label>
          <button type="submit">{submitted ? 'Requested' : 'Join'}</button>
        </form>
        <p>{section.legal}</p>
      </div>
      <footer className="footer-links">
        <a href="#access">Privacy Policy</a>
        <span>•</span>
        <a href="#access">Terms</a>
        <span>•</span>
        <a href="#access">qualifiers</a>
        <span className="footer-spacer" />
        <span>© 2026 ATHORA</span>
        <span>•</span>
        <span>ALL RIGHTS RESERVED</span>
      </footer>
    </section>
  );
}

function ScrollDown() {
  return <p className="scroll-down">Scroll down</p>;
}

function SectionRenderer({ section, onIntroReveal }) {
  switch (section.type) {
    case 'install':
      return <InstallSection section={section} onIntroReveal={onIntroReveal} />;
    case 'intro':
      return <IntroSection section={section} />;
    case 'systems':
      return <SystemsSection section={section} />;
    case 'lineup':
      return <ProductLineupSection section={section} />;
    case 'open':
      return <OpenSection section={section} />;
    case 'price':
      return <PriceSection section={section} />;
    case 'benefits':
      return <BenefitsSection section={section} />;
    case 'split-claim':
      return <SplitClaimSection section={section} />;
    case 'access':
      return <AccessSection section={section} />;
    default:
      return <ClaimSection section={section} />;
  }
}

function App() {
  const { activeIndex, modelState, showNav } = useScrollModelState();
  const activeTheme = useMemo(() => SECTION_THEMES[sections[activeIndex]?.theme || 'blue'], [activeIndex]);
  const [introRevealPhase, setIntroRevealPhase] = useState('idle');
  const introRevealPhaseRef = useRef('idle');
  const introRevealTimersRef = useRef([]);
  const restoreScrollStylesRef = useRef(() => {});

  useEffect(() => {
    introRevealPhaseRef.current = introRevealPhase;
  }, [introRevealPhase]);

  useEffect(() => {
    return () => {
      introRevealTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      introRevealTimersRef.current = [];
      restoreScrollStylesRef.current();
    };
  }, []);

  const startIntroReveal = useCallback(() => {
    if (introRevealPhaseRef.current !== 'idle') return;

    const intro = document.getElementById('intro');
    if (!intro) return;

    const stillOnPreloader = window.scrollY < window.innerHeight * 0.6;
    if (!stillOnPreloader) return;

    const root = document.documentElement;
    const previousSnapType = root.style.scrollSnapType;
    const previousScrollBehavior = root.style.scrollBehavior;

    root.style.scrollSnapType = 'none';
    root.style.scrollBehavior = 'auto';
    restoreScrollStylesRef.current = () => {
      root.style.scrollSnapType = previousSnapType;
      root.style.scrollBehavior = previousScrollBehavior;
      restoreScrollStylesRef.current = () => {};
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      window.scrollTo(0, intro.offsetTop);
      restoreScrollStylesRef.current();
      setIntroRevealPhase('done');
      return;
    }

    setIntroRevealPhase('preparing');

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo(0, intro.offsetTop);

        const revealTimer = window.setTimeout(() => {
          setIntroRevealPhase('revealing');
        }, INTRO_REVEAL_PREP_MS);

        const doneTimer = window.setTimeout(() => {
          restoreScrollStylesRef.current();
          setIntroRevealPhase('done');
        }, INTRO_REVEAL_PREP_MS + INTRO_REVEAL_DURATION_MS + 80);

        introRevealTimersRef.current.push(revealTimer, doneTimer);
      });
    });
  }, []);

  return (
    <div
      className="app"
      style={{
        '--active-primary': activeTheme.primary,
        '--active-secondary': activeTheme.secondary,
        '--active-glow': activeTheme.glow,
      }}
    >
      <AthoraScene modelState={modelState} />
      <Navigation activeIndex={activeIndex} showNav={showNav} />
      <PreloaderTransitionOverlay phase={introRevealPhase} />
      <main>
        {sections.map((section) => (
          <SectionRenderer section={section} key={section.id} onIntroReveal={startIntroReveal} />
        ))}
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
