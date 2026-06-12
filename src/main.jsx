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
    modelState: { x: 0, y: 0.26, z: 0, scale: 0.84, rotate: 0, scene: 3, opacity: 0.15 },
  },
  {
    id: 'intro',
    type: 'intro',
    headline: 'ATHORA',
    subcopy: 'Scroll down',
    theme: 'blue',
    modelState: { x: 0, y: -0.04, z: 0, scale: 0.86, rotate: 0, scene: 3, opacity: 0, asset: 'screen1', spin: 0 },
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
    headlineLines: ['5 products', '1 body'],
    theme: 'blue',
    figmaClaim: 'five-products',
    modelState: { x: 0, y: 0.1, z: 0, scale: 0.82, rotate: 0.15, scene: 3, opacity: 0 },
  },
  {
    id: 'separate',
    type: 'claim',
    headline: 'WHY ARe They separate?',
    headlineLines: ['WHY ARE THEY', 'SEPARATE?'],
    mobileHeadlineLines: ['WHY', 'ARE THEY', 'SEPARATE?'],
    theme: 'blue',
    figmaClaim: 'separate',
    modelState: { x: -1.9, y: -0.05, z: 0, scale: 0.9, rotate: -0.8, scene: 3, opacity: 0 },
  },
  {
    id: 'simplified',
    type: 'claim',
    headline: 'So We simplified it',
    headlineLines: ['SO WE', 'SIMPLIFIED IT'],
    theme: 'blue',
    figmaClaim: 'simplified',
    modelState: { x: 1.9, y: -0.05, z: 0, scale: 0.9, rotate: 0.85, scene: 3, opacity: 0 },
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
    headlineLines: ['ONE DAILY DRINK'],
    mobileHeadlineLines: ['ONE DAILY', 'DRINK'],
    theme: 'blue',
    figmaClaim: 'daily',
    modelState: { x: 0.1, y: 0.05, z: 0, scale: 0.96, rotate: -0.15, scene: 3, opacity: 0 },
  },
  {
    id: 'open-can',
    type: 'claim',
    headline: 'NO pills no powders',
    headlineLines: ['NO PILLS', 'NO POWDERS'],
    figmaClaim: 'open-can',
    theme: 'blue',
    modelState: { x: 0, y: 0, z: 0, scale: 1.12, rotate: 0.15, scene: 3, opacity: 0 },
  },
  {
    id: 'ten-day',
    type: 'price',
    pretitle: 'multiple products',
    headline: '$10+ / DAY',
    footnote: '*',
    figmaPrice: 'multiple',
    theme: 'blue',
    modelState: { x: -1.85, y: 0.08, z: 0, scale: 0.88, rotate: -0.75, scene: 3, opacity: 0 },
  },
  {
    id: 'one-day',
    type: 'price',
    headline: '$4 / DAY',
    footnote: '*',
    figmaPrice: 'single',
    theme: 'blue',
    modelState: { x: 1.85, y: 0.05, z: 0, scale: 0.88, rotate: 0.75, scene: 3, opacity: 0 },
  },
  {
    id: 'fruit',
    type: 'benefits',
    items: ['Real Fruit', 'zero added sugar', '40 Calories'],
    theme: 'blue',
    modelState: { x: -2.4, y: -0.05, z: 0, scale: 1.05, rotate: -0.55, scene: 3, opacity: 0 },
  },
  {
    id: 'electrolytes',
    type: 'split-claim',
    headline: '1,000+ mg electrolytes',
    theme: 'blue',
    modelState: { x: 2.35, y: -0.1, z: 0, scale: 1.14, rotate: 0.55, scene: 3, opacity: 0 },
  },
  {
    id: 'simplicity',
    type: 'claim',
    headline: 'NOT MORE PRODUCTS JUST SIMPLICITY',
    headlineLines: ['NOT MORE PRODUCTS', 'JUST SIMPLICITY'],
    figmaClaim: 'simplicity',
    theme: 'blue',
    modelState: { x: 0, y: 0.05, z: 0, scale: 0.84, rotate: 0, scene: 3, opacity: 0 },
  },
  {
    id: 'access',
    type: 'access',
    headline: 'get first Access',
    inputLabel: 'enter your EMAIL',
    legal: 'By joining, you agree to the Terms and Privacy Policy',
    theme: 'blue',
    modelState: { x: 1.75, y: 0.05, z: 0, scale: 1.02, rotate: 0.62, scene: 3, opacity: 0 },
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

function AthoraLogo({ large = false, className = '' }) {
  return (
    <div className={`${large ? 'athora-logo athora-logo-large' : 'athora-logo'} ${className}`.trim()} aria-label="ATHORA">
      <span className="athora-logo-text">ATHORA</span>
    </div>
  );
}

const NAV_FRAME_PATH =
  'M1440 19C1440 29.4934 1431.49 38 1421 38H795.606C791.753 38 788.078 39.634 785.088 42.0645C777.21 48.4681 773.487 64.7909 771.727 82.8936C769.504 105.757 768.392 117.189 761.954 123.346C761.632 123.653 761.364 123.898 761.026 124.188C754.276 130.001 743.85 130 723 130C702.097 130 691.645 130 684.911 124.245C684.573 123.956 684.307 123.717 683.984 123.41C677.558 117.313 676.356 105.843 673.951 82.9033C672.029 64.5689 668.218 48.5539 660.735 42.1572C657.804 39.6511 654.122 38 650.265 38H19C8.50661 38 0 29.4934 0 19C0 8.50659 8.50659 0 19 0H1421C1431.49 0 1440 8.50659 1440 19Z';

const NAV_FRAME_STROKE_PATH =
  'M785.088 42.0645L783.826 40.5125V40.5125L785.088 42.0645ZM771.727 82.8936L773.717 83.0871L771.727 82.8936ZM761.954 123.346L763.336 124.791V124.791L761.954 123.346ZM761.026 124.188L762.331 125.704V125.704L761.026 124.188ZM684.911 124.245L683.612 125.765V125.766L684.911 124.245ZM683.984 123.41L682.608 124.861V124.861L683.984 123.41ZM673.951 82.9033L675.94 82.6948V82.6948L673.951 82.9033ZM660.735 42.1572L662.035 40.637L662.035 40.637L660.735 42.1572ZM1421 38V36H795.606V38V40H1421V38ZM785.088 42.0645L783.826 40.5125C779.412 44.1012 776.366 50.2617 774.197 57.5191C772.009 64.8389 770.622 73.5889 769.736 82.7L771.727 82.8936L773.717 83.0871C774.591 74.0956 775.946 65.6329 778.029 58.6647C780.131 51.6341 782.886 46.4314 786.349 43.6164L785.088 42.0645ZM771.727 82.8936L769.736 82.7C768.62 94.1787 767.796 102.622 766.464 108.974C765.134 115.312 763.358 119.235 760.572 121.9L761.954 123.346L763.336 124.791C766.988 121.299 768.987 116.429 770.378 109.795C771.767 103.176 772.61 94.472 773.717 83.0871L771.727 82.8936ZM761.954 123.346L760.572 121.9C760.274 122.185 760.031 122.406 759.721 122.673L761.026 124.188L762.331 125.704C762.697 125.389 762.991 125.121 763.336 124.791L761.954 123.346ZM761.026 124.188L759.721 122.673C756.773 125.211 752.93 126.584 747.062 127.288C741.153 127.997 733.475 128 723 128V130V132C733.375 132 741.335 132.004 747.539 131.26C753.784 130.511 758.529 128.978 762.331 125.704L761.026 124.188ZM723 130V128C712.499 128 704.8 127.997 698.878 127.295C692.995 126.597 689.149 125.236 686.211 122.725L684.911 124.245L683.612 125.766C687.407 129.009 692.155 130.526 698.407 131.267C704.62 132.003 712.598 132 723 132V130ZM684.911 124.245L686.211 122.725C685.899 122.458 685.659 122.243 685.361 121.959L683.984 123.41L682.608 124.861C682.955 125.191 683.246 125.453 683.612 125.765L684.911 124.245ZM683.984 123.41L685.361 121.959C682.582 119.323 680.788 115.404 679.415 109.05C678.039 102.684 677.147 94.2109 675.94 82.6948L673.951 82.9033L671.962 83.1118C673.16 94.5353 674.072 103.266 675.505 109.895C676.94 116.535 678.96 121.4 682.608 124.861L683.984 123.41ZM673.951 82.9033L675.94 82.6948C674.973 73.4679 673.523 64.7428 671.344 57.479C669.184 50.2771 666.223 44.2169 662.035 40.637L660.735 42.1572L659.436 43.6774C662.731 46.4942 665.417 51.6399 667.513 58.6283C669.591 65.5548 671.007 74.0043 671.962 83.1118L673.951 82.9033ZM650.265 38V36H19V38V40H650.265V38ZM19 0V2H1421V0V-2H19V0ZM1421 0V2C1430.39 2 1438 9.61116 1438 19H1440H1442C1442 7.40202 1432.6 -2 1421 -2V0ZM0 19H2C2 9.61116 9.61116 2 19 2V0V-2C7.40202 -2 -2 7.40202 -2 19H0ZM795.606 38V36C791.186 36 787.079 37.8686 783.826 40.5125L785.088 42.0645L786.349 43.6164C789.077 41.3994 792.321 40 795.606 40V38ZM19 38V36C9.61118 36 2 28.3888 2 19H0H-2C-2 30.598 7.40204 40 19 40V38ZM660.735 42.1572L662.035 40.637C658.822 37.8905 654.695 36 650.265 36V38V40C653.548 40 656.785 41.4117 659.436 43.6774L660.735 42.1572ZM1421 38V40C1432.6 40 1442 30.598 1442 19H1440H1438C1438 28.3888 1430.39 36 1421 36V38Z';

function NavFrameGlass() {
  return (
    <svg
      className="nav-frame-glass"
      preserveAspectRatio="none"
      viewBox="0 0 1440 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g filter="url(#nav-frame-inner)">
        <mask id="nav-frame-mask" fill="white">
          <path d={NAV_FRAME_PATH} />
        </mask>
        <path d={NAV_FRAME_PATH} fill="#1D1D1D" fillOpacity="0.14" style={{ mixBlendMode: 'plus-lighter' }} />
        <path d={NAV_FRAME_PATH} fill="#1D1D1D" fillOpacity="0.08" style={{ mixBlendMode: 'color-burn' }} />
        <path d={NAV_FRAME_PATH} fill="url(#nav-frame-bottom)" fillOpacity="0.28" style={{ mixBlendMode: 'plus-lighter' }} />
        <path d={NAV_FRAME_PATH} fill="url(#nav-frame-top)" fillOpacity="0.12" style={{ mixBlendMode: 'plus-lighter' }} />
        <path d={NAV_FRAME_STROKE_PATH} fill="white" fillOpacity="0.04" mask="url(#nav-frame-mask)" />
        <path d={NAV_FRAME_STROKE_PATH} fill="url(#nav-frame-stroke)" mask="url(#nav-frame-mask)" />
      </g>
      <defs>
        <filter
          id="nav-frame-inner"
          x="0"
          y="0"
          width="1440"
          height="130"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="7.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.34 0" />
          <feBlend mode="plus-lighter" in2="shape" result="effect1_innerShadow" />
        </filter>
        <linearGradient id="nav-frame-bottom" x1="720" y1="0" x2="720" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0.5" stopColor="#666666" stopOpacity="0" />
          <stop offset="1" stopColor="#666666" />
        </linearGradient>
        <linearGradient id="nav-frame-top" x1="720" y1="0" x2="720" y2="130" gradientUnits="userSpaceOnUse">
          <stop stopColor="#666666" />
          <stop offset="0.326923" stopColor="#666666" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nav-frame-stroke" x1="721" y1="133" x2="720" y2="24.0005" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
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
      <div className="mobile-status-bar" aria-hidden="true">
        <span className="mobile-status-time">1:47</span>
        <span className="mobile-dynamic-island" />
        <span className="mobile-status-icons">
          <span className="mobile-signal"><i /><i /><i /></span>
          <span className="mobile-wifi" />
          <span className="mobile-battery" />
        </span>
      </div>
      <NavFrameGlass />
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
      <p className="install-copy">{section.subcopy}</p>
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
        <p className="install-copy">Installing...</p>
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
  const isFigmaClaim = Boolean(section.figmaClaim);
  const desktopLines = section.headlineLines || [section.headline];
  const mobileLines = section.mobileHeadlineLines || desktopLines;
  const hasMobileLines = Boolean(section.mobileHeadlineLines);

  return (
    <section
      className={`panel claim-panel ${isFigmaClaim ? `figma-claim-panel figma-claim-${section.figmaClaim}` : ''} ${
        SECTION_THEMES[section.theme].className
      }`}
      id={section.id}
    >
      <h2 className={hasMobileLines ? 'has-mobile-lines' : undefined}>
        <span className="claim-line-set claim-line-set-desktop">
          {desktopLines.map((line) => (
            <span key={`desktop-${line}`}>{line}</span>
          ))}
        </span>
        {hasMobileLines ? (
          <span className="claim-line-set claim-line-set-mobile" aria-hidden="true">
            {mobileLines.map((line) => (
              <span key={`mobile-${line}`}>{line}</span>
            ))}
          </span>
        ) : null}
      </h2>
      <ScrollDown />
    </section>
  );
}

function ProductLineupSection({ section }) {
  const cans = [
    {
      src: '/figma-systems/vitamins-can-render.png',
      label: 'Lemon Lime',
      className: 'lineup-product-can lineup-product-can-vitamins',
    },
    {
      src: '/figma-systems/hydration-can-render.png',
      label: 'Coconut Blueberry',
      className: 'lineup-product-can lineup-product-can-hydration',
    },
    {
      src: '/figma-systems/energy-can-render.png',
      label: 'Mango Vanilla',
      className: 'lineup-product-can lineup-product-can-energy',
    },
  ];

  return (
    <section className={`panel lineup-panel figma-lineup-panel ${SECTION_THEMES[section.theme].className}`} id={section.id}>
      <div className="lineup-products" aria-hidden="true">
        {cans.map((can) => (
          <img className={can.className} src={can.src} alt="" key={can.label} draggable="false" />
        ))}
      </div>
      <AthoraLogo large className="lineup-brand-wordmark" />
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
  const isFigmaPrice = Boolean(section.figmaPrice);

  return (
    <section
      className={`panel price-panel ${isFigmaPrice ? `figma-price-panel figma-price-${section.figmaPrice}` : ''} ${
        SECTION_THEMES[section.theme].className
      }`}
      id={section.id}
    >
      {!isFigmaPrice && section.sideNumbers && (
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
    <section className={`panel benefits-panel figma-detail-panel figma-benefits-panel ${SECTION_THEMES[section.theme].className}`} id={section.id}>
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
    <section className={`panel split-claim-panel figma-detail-panel figma-electrolytes-panel ${SECTION_THEMES[section.theme].className}`} id={section.id}>
      <h2>{section.headline}</h2>
      <ScrollDown />
    </section>
  );
}

function AccessSection({ section }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className={`panel access-panel figma-detail-panel figma-access-panel ${SECTION_THEMES[section.theme].className}`} id={section.id}>
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
        <span>&bull;</span>
        <a href="#access">Terms</a>
        <span>&bull;</span>
        <a href="#access">qualifiers</a>
        <span className="footer-spacer" />
        <span>&copy; 2026 ATHORA</span>
        <span>&bull;</span>
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
    case 'claim':
      return <ClaimSection section={section} />;
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
  const activeSection = sections[activeIndex];
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
