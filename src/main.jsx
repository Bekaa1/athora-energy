import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
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

const SCREEN2_CLIP = {
  blue: 2.5 / 8,
  orange: 4.5 / 8,
  green: 6 / 8,
};

const SCREEN2_FLAVOR_INDEX = {
  blue: 0,
  orange: 1,
  green: 2,
};

const SCREEN2_TILTED_STATE = {
  x: 1.2,
  y: -0.55,
  z: 0,
  scale: 1.55,
  rotate: -0.1,
  tilt: 0,
  pitch: 0,
  spin: 0,
  floatTilt: 0.01,
};

const SCREEN2_VERTICAL_STATES = {
  blue: {
    x: 0,
    y: -0.065,
    z: 0,
    scale: 0.9,
    rotate: 0,
    tilt: 0,
    pitch: 0,
    spin: 0,
    floatTilt: 0,
  },
  orange: {
    x: 0,
    y: -0.065,
    z: 0,
    scale: 1.2,
    rotate: 0,
    tilt: 0,
    pitch: 0,
    spin: 0,
    floatTilt: 0,
  },
  green: {
    x: 0,
    y: -0.065,
    z: 0,
    scale: 1.2,
    rotate: 0,
    tilt: 0,
    pitch: 0,
    spin: 0,
    floatTilt: 0,
  },
};

const SCREEN2_DEFAULT_MATERIALS = {
  aluminum: {
    color: 0xe7eef0,
    metalness: 1,
    roughness: 0.94,
    envMapIntensity: 2.75,
  },
  canBody: {
    color: 0xffffff,
    metalness: 0.45,
    roughness: 0.8,
    envMapIntensity: 1.5,
    clearcoat: 0.5,
    clearcoatRoughness: 0.09,
    reflectivity: 0.62,
  },
};

const SCREEN2_VERTICAL_MATERIALS = {
  blue: SCREEN2_DEFAULT_MATERIALS,
  orange: SCREEN2_DEFAULT_MATERIALS,
  green: SCREEN2_DEFAULT_MATERIALS,
};

const SCREEN4_CLIP = {
  fruitStart: 0,
  fruitSettled: 4 / 12.083333,
  electrolytes: 9.35 / 12.083333,
  rollOut: 1,
};

const SCREEN2_TILTED_MATERIALS = SCREEN2_DEFAULT_MATERIALS;

const sections = [
  {
    id: 'installing',
    type: 'install',
    headline: 'ATHORA',
    subcopy: 'Installing...',
    theme: 'blue',
    modelState: { x: 0, y: 0.26, z: 0, scale: 0.84, rotate: 0, scene: 3, opacity: 0 },
  },
  {
    id: 'intro',
    type: 'intro',
    headline: 'ATHORA',
    subcopy: 'Scroll down',
    theme: 'blue',
    // Free (native) scroll from intro through all-systems so the frame-scrubbed can
    // flows continuously with the scroll like the film, instead of snapping word-by-word.
    scrollScrub: { targetSectionId: 'all-systems' },
    modelState: {
      x: 0,
      y: -0.12,
      z: 0,
      scale: 1.3,
      rotate: 0,
      tilt: 0,
      pitch: 0,
      scene: 3,
      opacity: 1,
      asset: 'screen2AnimatedStack',
      clipProgress: 1.5 / 8,
      assetSwitchAt: 1.01,
      spin: 0,
      floatTilt: 0,
    },
  },
  {
    id: 'all-systems',
    type: 'systems',
    pretitle: 'every day PEOPLE manage',
    items: ['Hydration', 'Energy', 'Vitamins', 'Immunity'],
    theme: 'blue',
    figmaVariant: 'hydration',
    wordStepScroll: true,
    // Whole section is free (native) scroll so the frame-scrubbed can flows continuously
    // with the scroll (no word-by-word snapping) — matches the film playback feel.
    scrollScrub: { targetSectionId: 'five-products', startOffsetSteps: 0 },
    systemsSequence: [
      {
        theme: 'blue',
        modelState: {
          ...SCREEN2_TILTED_STATE,
          scene: 3,
          opacity: 1,
          asset: 'screen2AnimatedStack',
          assetSwitchAt: 1.01,
          clipProgress: SCREEN2_CLIP.blue,
        },
      },
      {
        theme: 'orange',
        modelState: {
          ...SCREEN2_TILTED_STATE,
          scene: 3,
          opacity: 1,
          asset: 'screen2AnimatedStack',
          assetSwitchAt: 0.03,
          clipProgress: SCREEN2_CLIP.orange,
        },
      },
      {
        theme: 'green',
        modelState: {
          ...SCREEN2_TILTED_STATE,
          scene: 3,
          opacity: 1,
          asset: 'screen2AnimatedStack',
          assetSwitchAt: 0.03,
          clipProgress: SCREEN2_CLIP.green,
        },
      },
      {
        theme: 'green',
        modelState: {
          ...SCREEN2_TILTED_STATE,
          scene: 3,
          opacity: 1,
          asset: 'screen2AnimatedStack',
          clipProgress: SCREEN2_CLIP.green,
        },
      },
    ],
    modelTransitionStart: 0.82,
    modelState: {
      ...SCREEN2_TILTED_STATE,
      scene: 3,
      opacity: 1,
      asset: 'screen2AnimatedStack',
      clipProgress: SCREEN2_CLIP.blue,
    },
  },
  {
    id: 'five-products',
    type: 'claim-stack',
    theme: 'blue',
    figmaClaim: 'claim-stack',
    modelTransitionStart: 1,
    claims: [
      {
        id: 'five-products',
        headlineLines: ['5 PRODUCTS', '1 BODY'],
      },
      {
        id: 'separate',
        headlineLines: ['WHY ARE THEY', 'SEPARATE?'],
        mobileHeadlineLines: ['WHY', 'ARE THEY', 'SEPARATE?'],
      },
      {
        id: 'simplified',
        headlineLines: ['SO WE', 'SIMPLIFIED IT'],
      },
    ],
    modelState: { x: 0, y: 0.1, z: 0, scale: 0.82, rotate: 0.15, scene: 3, opacity: 0 },
  },
  {
    id: 'lineup',
    type: 'lineup',
    headline: 'ATHORA',
    theme: 'blue',
    modelTransitionStart: 1,
    // Scroll-scrubbed: the whole lineup region is native scroll (no snap) so the
    // GLB clip plays under the user's scroll — orbit (clip 0->0.6) then break-apart
    // into the showcase (0.6->1). Ambient orbit idle-loops only at the very top.
    scrollScrub: { targetSectionId: 'open-can', height: '260vh' },
    lineupClipScrub: true,
    modelState: {
      x: 0,
      y: -0.2,
      z: 0,
      scale: 2.7,
      rotate: 0,
      tilt: 0,
      pitch: -0.085,
      scene: 3,
      opacity: 1,
      asset: 'screen3Desk',
      clipProgress: 0,
      spin: 0,
      floatTilt: 0,
      clipIdleLoop: true,
      clipIdleLoopStart: 1,
      clipIdleLoopEnd: 12,
      clipIdleLoopSpeed: 1.25,
    },
  },
  {
    id: 'open-can',
    type: 'claim',
    headline: 'NO pills no powders',
    headlineLines: ['NO PILLS', 'NO POWDERS'],
    figmaClaim: 'open-can',
    theme: 'blue',
    modelTransitionStart: 1,
    // Scroll-scrubbed continuation of lineup: hold the showcase clip, isolate the
    // blue can (fade green/orange/platform) and tilt to a top-down view (Figma 4423).
    scrollScrub: { targetSectionId: 'ten-day' },
    openCanScrub: true,
    modelState: {
      x: 0,
      y: -0.2,
      z: 0,
      scale: 2.7,
      rotate: 0,
      tilt: 0,
      pitch: -0.085,
      scene: 3,
      opacity: 1,
      asset: 'screen3Desk',
      assetSwitchAt: 1.01,
      clipProgress: 0.8,
      focusIsolation: 0,
      spin: 0,
      floatTilt: 0,
    },
  },
  {
    id: 'ten-day',
    type: 'price-stack',
    footnote: '*',
    figmaPrice: 'comparison-stack',
    theme: 'blue',
    prices: [
      {
        id: 'ten-day',
        pretitle: 'MULTIPLE PRODUCTS',
        value: '10',
      },
      {
        id: 'one-day',
        pretitle: 'ATHORA',
        value: '4',
      },
    ],
    valueSequence: ['10', '9', '8', '7', '6', '5', '4'],
    modelTransitionStart: 1,
    modelState: {
      x: -2.15,
      y: -0.06,
      z: 0,
      scale: 0.92,
      rotate: -0.32,
      tilt: -0.18,
      pitch: 1.1,
      scene: 3,
      opacity: 0,
      asset: 'screen3Desk',
      clipProgress: 1,
      spin: 0,
      floatTilt: 0,
    },
  },
  {
    id: 'fruit',
    type: 'nutrition',
    variant: 'fruit',
    modelTransitionStart: 0.84,
    modelTransitionEase: 'smooth',
    modelTransitionMode: 'clipOnly',
    stackItems: [
      { id: 'real-fruit', label: 'Real Fruit' },
      { id: 'calories', label: '40 Calories' },
      { id: 'zero-added', label: ['zero added', 'sugar'] },
    ],
    theme: 'blue',
    modelState: {
      x: -9,
      y: 0,
      z: 0,
      scale: 1,
      rotate: 0,
      tilt: 0,
      pitch: -0.1,
      scene: 3,
      opacity: 1,
      asset: 'screen4Fruit',
      visualCenterLockStrength: 0,
      clipProgress: SCREEN4_CLIP.fruitSettled,
      spin: 0,
      floatTilt: 0,
      entryMotion: {
        id: 'fruit-glb-roll-in',
        mode: 'time',
        duration: 2,
        from: {
          clipProgress: SCREEN4_CLIP.fruitStart,
          opacity: 1,
        },
      },
    },
  },
  {
    id: 'electrolytes',
    type: 'nutrition',
    variant: 'electrolytes',
    headlineLines: ['1,000+ MG', 'ELECTROLYTES'],
    modelTransitionStart: 1,
    scrollScrub: {
      targetSectionId: 'simplicity',
      height: '260vh',
    },
    modelClipScroll: {
      clipStart: SCREEN4_CLIP.electrolytes,
      clipEnd: SCREEN4_CLIP.rollOut,
      startAt: 0,
      endAt: 0.58,
      easing: 'linear',
      opacityFadeStartAt: 0.5,
      opacityFadeEndAt: 0.6,
    },
    theme: 'blue',
    modelState: {
      x: -5.5,
      y: -0.8,
      z: 0,
      scale: 1.2,
      rotate: 0,
      tilt: 0 , // отвечает за вертикальность банки
      pitch: -0.1,
      scene: 3,
      opacity: 1,
      asset: 'screen4Fruit',
      clipProgress: SCREEN4_CLIP.electrolytes,
      visualCenterLockStrength: 0,
      spin: 0,
      floatTilt: 0,
    },
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
    modelState: {
      x: 2,
      y: 0.1,
      z: 0,
      scale: 0.9,
      rotate: -0.32,
      tilt: 0,
      pitch: 0,
      scene: 3,
      opacity: 1,
      asset: 'lastScreen',
      clipProgress: 0,
      clipAutoplay: true,
      clipSpeed: 1,
      lockAnimatedPositions: true,
      lockVisualCenter: true,
      lockViewportPosition: true,
      spin: 0,
      floatTilt: 0,
    },
  },
];

const INTRO_REVEAL_PREP_MS = 420;
const INTRO_REVEAL_DURATION_MS = 1050;
const INTRO_SCENE_REVEAL_DELAY_MS = 120;
const PRELOADER_DURATION_MS = 3000;
const PRELOADER_COMPLETE_HOLD_MS = 1500;
const PRELOADER_ASSET_WAIT_PROGRESS = 0.985;
const PRELOADER_ASSET_FINISH_MS = 360;
const PRELOADER_FORCE_COMPLETE_MS = 12000;
const PRELOADER_SCENE_BOOT_DELAY_MS = 3050;
const PRELOADER_ASSET_LOAD_START_DELAY_MS = 650;
const CRITICAL_WARMUP_STAGGER_MS = 90;
const DEFERRED_ASSET_LOAD_DELAY_MS = 1400;
const STEP_SCROLL_SELECTOR = '.panel, .systems-step-snap, .claim-stack-snap, .price-stack-snap, .nutrition-stack-snap';
const STEP_SCROLL_WHEEL_THRESHOLD = 8;
const STEP_SCROLL_TOUCH_THRESHOLD = 34;
const STEP_SCROLL_SETTLE_MS = 180;
const STEP_SCROLL_MAX_LOCK_MS = 1500;
const CRITICAL_PRELOAD_IMAGE_SOURCES = [
  '/figma-hero/background-main.png',
  '/figma-hero/berry-right.png',
  '/figma-hero/image-3.svg',
  '/figma-hero/berry-center.svg',
];
// 3D/GLB removed in the frames-version branch — the can is shown via pre-rendered
// transparent frame sequences scrubbed by scroll, so no GLB is preloaded.
const CRITICAL_PRELOAD_BINARY_SOURCES = [];

THREE.Cache.enabled = true;

function preloadImageSource(src) {
  return new Promise((resolve) => {
    const image = new Image();
    const done = () => resolve(src);

    image.onload = () => {
      if (image.decode) {
        image.decode().catch(() => {}).finally(done);
      } else {
        done();
      }
    };
    image.onerror = done;
    image.src = src;
  });
}

function preloadBinarySource(src) {
  return new Promise((resolve) => {
    const loader = new THREE.FileLoader();
    loader.setResponseType('arraybuffer');
    loader.load(src, () => resolve(src), undefined, () => resolve(src));
  });
}

const LEGAL_LINKS = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms', path: '/terms' },
  { label: 'qualifiers', path: '/qualifiers' },
];

const LEGAL_PAGES = {
  '/privacy-policy': {
    slug: 'privacy-policy',
    title: 'Privacy policy',
    height: 1614,
    background: '/figma-legal/privacy-bg.png',
    wordmark: '/figma-legal/privacy-wordmark.svg',
    blocks: [
      { type: 'p', text: 'Effective Date: April 20, 2026' },
      { type: 'space' },
      { type: 'p', text: 'ATHORA, LLC ("ATHORA," "we," "our," or "us") respects your privacy and is committed to protecting your personal information.' },
      { type: 'space' },
      { type: 'p', text: 'This Privacy Policy explains how we collect and use information when you visit our website or sign up to be notified about ATHORA.' },
      { type: 'space' },
      { type: 'p', text: '1. Information We Collect' },
      { type: 'p', text: 'When you sign up to receive updates about ATHORA, we may collect:' },
      { type: 'list', items: ['Email address', 'Name (if provided)', 'Basic website usage data such as IP address, browser type, and pages visited'] },
      { type: 'space' },
      { type: 'p', text: '2. How We Use Your Information' },
      { type: 'p', text: 'We use your information solely to:' },
      { type: 'list', items: ['Notify you when ATHORA becomes available', 'Provide important launch or availability updates', 'Operate and improve our website'] },
      { type: 'space' },
      { type: 'p', text: '3. Launch Notification Consent' },
      { type: 'p', text: 'By submitting your email address through the ATHORA website, you agree to receive email communications notifying you when ATHORA launches or becomes available. these communications are limited to launch-related updates and essential brand announcements. You may unsubscribe at any time using the unsubscribe link included in our emails.' },
      { type: 'space' },
      { type: 'p', text: '4. Sharing of Information' },
      { type: 'p', text: 'ATHORA does not sell or rent your personal information. We may share information only with trusted service providers that help us operate our website or send launch notifications.' },
      { type: 'space' },
      { type: 'p', text: '5. Data Security' },
      { type: 'p', text: 'We implement reasonable safeguards to protect your information. However, no internet transmission can be guaranteed completely secure.' },
      { type: 'space' },
      { type: 'p', text: '6. Data Retention' },
      { type: 'p', text: 'We retain your information only as long as necessary to provide launch notifications or until you unsubscribe.' },
      { type: 'space' },
      { type: 'p', text: '7. Changes to This Policy' },
      { type: 'p', text: 'We may update this Privacy Policy periodically. Continued use of the website indicates acceptance of any updates.' },
    ],
  },
  '/terms': {
    slug: 'terms',
    title: 'terms',
    height: 2414,
    background: '/figma-legal/terms-bg.png',
    wordmark: '/figma-legal/terms-wordmark.svg',
    blocks: [
      { type: 'p', text: 'Effective Date: April 20, 2026' },
      { type: 'space' },
      { type: 'p', text: 'Welcome to ATHORA.' },
      { type: 'space' },
      { type: 'p', text: 'These Terms govern your use of the ATHORA website operated by ATHORA, LLC ("ATHORA," "we," "our," or "us").' },
      { type: 'space' },
      { type: 'p', text: 'By accessing or using this website, you agree to these Terms.' },
      { type: 'space' },
      { type: 'p', text: '1. Website Use' },
      { type: 'p', text: 'The ATHORA website is intended to provide information about ATHORA and allow users to sign up for launch notifications and updates. You agree to use this website only for lawful purposes and in a manner that does not interfere with the operation or security of the website.' },
      { type: 'space' },
      { type: 'p', text: '2. Product & Information Disclaimer' },
      { type: 'p', text: 'ATHORA provides general product and wellness information for informational purposes only.' },
      { type: 'p', text: 'ATHORA products and website content are not intended to provide medical advice and should not be relied upon as a substitute for professional medical guidance. Always consult a qualified healthcare professional regarding any health-related questions or dietary concerns.' },
      { type: 'space' },
      { type: 'p', text: '3. FDA Disclaimer' },
      { type: 'p', text: 'Statements made regarding ATHORA products have not been evaluated by the Food and Drug Administration. ATHORA products are not intended to diagnose, treat, cure, or prevent any disease.' },
      { type: 'space' },
      { type: 'p', text: '4. Nutritional & Pricing Information' },
      { type: 'p', text: 'Any nutritional values, ingredients, functionality descriptions, or pricing displayed on the website are subject to change without notice. References to "$4/day" reflect estimated subscription pricing and excludes taxes, shipping, and other applicable fees. Comparisons to other product categories or daily routines are illustrative estimates only.' },
      { type: 'space' },
      { type: 'p', text: '5. Email Communications' },
      { type: 'p', text: 'By submitting your email address through the ATHORA website, you consent to receive launch updates, availability notifications, and limited brand-related communications from ATHORA. you may unsubscribe at any time using the unsubscribe link included in our emails.' },
      { type: 'space' },
      { type: 'p', text: '6. Intellectual Property' },
      { type: 'p', text: 'All website content, including but not limited to:' },
      { type: 'list', items: ['logos', 'branding', 'designs', 'graphics', 'animations', 'copy', 'product names', 'trademarks', 'visual assets'] },
      { type: 'p', text: 'are the property of ATHORA, LLC or its licensors and may not be copied, reproduced, modified, or distributed without prior written permission.' },
      { type: 'space' },
      { type: 'p', text: '7. Third-Party Services' },
      { type: 'p', text: 'ATHORA may use third-party platforms or providers to operate portions of the website, analytics, email communications, or infrastructure. We are not responsible for the content, policies, or practices of third-party services.' },
      { type: 'space' },
      { type: 'p', text: '8. Limitation of Liability' },
      { type: 'p', text: 'To the fullest extent permitted by law, ATHORA shall not be liable for any indirect, incidental, consequential, or special damages arising from:' },
      { type: 'list', items: ['use of the website', 'inability to access the website', 'reliance on website content', 'errors or interruptions'] },
      { type: 'p', text: 'Your use of the website is at your own risk.' },
      { type: 'space' },
      { type: 'p', text: '9. No Guarantees' },
      { type: 'p', text: 'ATHORA does not guarantee:' },
      { type: 'list', items: ['uninterrupted website availability', 'launch timing', 'future product availability', 'product compatibility with individual dietary preferences or sensitivities'] },
      { type: 'space' },
      { type: 'p', text: '10. Governing Law' },
      { type: 'p', text: 'These Terms are governed by the laws of the Commonwealth of Massachusetts, without regard to conflict of law principles.' },
      { type: 'space' },
      { type: 'p', text: '11. Changes to These Terms' },
      { type: 'p', text: 'ATHORA may update these Terms periodically.' },
      { type: 'p', text: 'Continued use of the website after updates constitutes acceptance of the revised Terms.' },
    ],
  },
  '/qualifiers': {
    slug: 'qualifiers',
    title: 'qualifiers',
    height: 976,
    background: '/figma-legal/qualifiers-bg.png',
    wordmark: '/figma-legal/qualifiers-wordmark.svg',
    blocks: [
      { type: 'p', text: 'Effective Date: April 20, 2026' },
      { type: 'space' },
      { type: 'p', text: '* Based on estimated daily costs across hydration, energy, and supplement categories. $4/day pricing reflects subscription pricing; excludes taxes.' },
      { type: 'space' },
      { type: 'p', text: 'This product is intended to support general wellness and hydration.' },
      { type: 'space' },
      { type: 'p', text: 'These statements have not been evaluated by the Food and Drug Administration.' },
      { type: 'space' },
      { type: 'p', text: 'This product is not intended to diagnose, treat, cure, or prevent any disease.' },
    ],
  },
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / Math.max(edge1 - edge0, 0.001), 0, 1);
  return t * t * (3 - 2 * t);
}

function getModelClipScrollAmount(clipConfig, rawSectionProgress) {
  const startAt = clipConfig.startAt ?? 0;
  const endAt = clipConfig.endAt ?? 1;
  const rawClipAmount = clamp(
    (rawSectionProgress - startAt) / Math.max(endAt - startAt, 0.001),
    0,
    1
  );

  return clipConfig.easing === 'linear' ? rawClipAmount : smoothstep(0, 1, rawClipAmount);
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function hexToRgb(hex) {
  if (hex.startsWith('rgb')) {
    const [r = 0, g = 0, b = 0] = hex.match(/\d+(\.\d+)?/g)?.map(Number) || [];

    return { r, g, b };
  }

  const normalized = hex.replace('#', '');
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function mixHexColor(from, to, t) {
  const start = hexToRgb(from);
  const end = hexToRgb(to);
  const r = Math.round(lerp(start.r, end.r, t));
  const g = Math.round(lerp(start.g, end.g, t));
  const b = Math.round(lerp(start.b, end.b, t));

  return `rgb(${r}, ${g}, ${b})`;
}

function mixTheme(from, to, t) {
  return {
    className: from.className,
    primary: mixHexColor(from.primary, to.primary, t),
    secondary: mixHexColor(from.secondary, to.secondary, t),
    glow: mixHexColor(from.glow, to.glow, t),
  };
}

function getSystemsSequenceProgress(section, sectionProgress) {
  const sequence = section?.systemsSequence || [];
  if (sequence.length < 2) {
    return {
      sequence,
      progress: 0,
      fromIndex: 0,
      toIndex: 0,
      stepProgress: 0,
    };
  }

  const maxProgress = sequence.length - 1;
  const progress = clamp(sectionProgress * maxProgress, 0, maxProgress);
  const fromIndex = Math.min(Math.floor(progress), sequence.length - 2);
  const toIndex = Math.min(fromIndex + 1, sequence.length - 1);

  return {
    sequence,
    progress,
    fromIndex,
    toIndex,
    stepProgress: progress - fromIndex,
  };
}

function getInterpolatedVisibleFlavors(a, b, t, assetSwitchAt) {
  const fromFlavors = a.visibleFlavors;
  const toFlavors = b.visibleFlavors;

  if (!fromFlavors && !toFlavors) return undefined;
  return t < assetSwitchAt ? fromFlavors : toFlavors;
}

function interpolateState(a, b, t) {
  const assetSwitchAt = a.assetSwitchAt ?? 0.5;
  const hasFlavorProgress = Number.isFinite(a.flavorProgress) || Number.isFinite(b.flavorProgress);

  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    z: lerp(a.z, b.z, t),
    scale: lerp(a.scale, b.scale, t),
    rotate: lerp(a.rotate, b.rotate, t),
    tilt: lerp(a.tilt ?? 0, b.tilt ?? 0, t),
    pitch: lerp(a.pitch ?? 0, b.pitch ?? 0, t),
    opacity: lerp(a.opacity, b.opacity, t),
    spin: lerp(a.spin ?? 0.26, b.spin ?? 0.26, t),
    floatTilt: lerp(a.floatTilt ?? 0.055, b.floatTilt ?? 0.055, t),
    focusIsolation: lerp(a.focusIsolation ?? 0, b.focusIsolation ?? 0, t),
    sideExit: lerp(a.sideExit ?? 0, b.sideExit ?? 0, t),
    clipProgress: lerp(a.clipProgress ?? 0, b.clipProgress ?? 0, t),
    clipAutoplay: t < assetSwitchAt ? a.clipAutoplay : b.clipAutoplay,
    clipSpeed: t < assetSwitchAt ? a.clipSpeed : b.clipSpeed,
    clipIdleLoop: t < assetSwitchAt ? a.clipIdleLoop : b.clipIdleLoop,
    clipIdleLoopStart: t < assetSwitchAt ? a.clipIdleLoopStart : b.clipIdleLoopStart,
    clipIdleLoopEnd: t < assetSwitchAt ? a.clipIdleLoopEnd : b.clipIdleLoopEnd,
    clipIdleLoopSpeed: t < assetSwitchAt ? a.clipIdleLoopSpeed : b.clipIdleLoopSpeed,
    lockAnimatedPositions: t < assetSwitchAt ? a.lockAnimatedPositions : b.lockAnimatedPositions,
    lockVisualCenter: t < assetSwitchAt ? a.lockVisualCenter : b.lockVisualCenter,
    visualCenterLockStrength: lerp(
      a.visualCenterLockStrength ?? (a.lockVisualCenter ? 1 : 0),
      b.visualCenterLockStrength ?? (b.lockVisualCenter ? 1 : 0),
      t
    ),
    visibleFlavors: getInterpolatedVisibleFlavors(a, b, t, assetSwitchAt),
    backgroundFlavors: t < assetSwitchAt ? a.backgroundFlavors : b.backgroundFlavors,
    backgroundFlavorOpacity: lerp(
      a.backgroundFlavorOpacity ?? 1,
      b.backgroundFlavorOpacity ?? a.backgroundFlavorOpacity ?? 1,
      t
    ),
    flavorProgress: hasFlavorProgress ? lerp(a.flavorProgress ?? 0, b.flavorProgress ?? a.flavorProgress ?? 0, t) : undefined,
    asset: t < assetSwitchAt ? a.asset : b.asset,
    scene: t < 0.5 ? a.scene : b.scene,
    entryMotion: a.entryMotion,
    exitMotion: a.exitMotion,
  };
}

function getAnchoredMotionValue(values = {}, anchor = {}, key, targetValue) {
  const value = values[key];
  const anchorValue = anchor[key];
  if (Number.isFinite(value) && Number.isFinite(anchorValue) && Number.isFinite(targetValue)) {
    return value + (targetValue - anchorValue);
  }

  return value ?? targetValue;
}

function createFlavorSwapState(from, to, t, index = 0) {
  const stableUntil = 0.16;
  if (t <= stableUntil) return from;

  const exitProgress = smoothstep(stableUntil, 0.58, t);
  const enterProgress = smoothstep(0.46, 0.76, t);
  const exitDirection = index % 2 === 0 ? 1 : 0.86;
  const exitState = {
    ...from,
    x: lerp(from.x, from.x + 1.72 * exitDirection, exitProgress),
    y: lerp(from.y, from.y - 1.32, exitProgress),
    z: lerp(from.z ?? 0, (from.z ?? 0) - 0.12, exitProgress),
    scale: lerp(from.scale, from.scale * 0.88, exitProgress),
    rotate: lerp(from.rotate ?? 0, (from.rotate ?? 0) - 0.92, exitProgress),
    tilt: lerp(from.tilt ?? 0, (from.tilt ?? 0) - 1.22, exitProgress),
    pitch: lerp(from.pitch ?? 0, (from.pitch ?? 0) - 0.34, exitProgress),
    opacity: 1,
  };

  if (enterProgress <= 0.001) return exitState;

  const entryFrom = {
    ...to,
    x: to.x - 0.9,
    y: to.y + 0.64,
    z: (to.z ?? 0) - 0.06,
    scale: to.scale * 0.9,
    rotate: (to.rotate ?? 0) + 0.42,
    tilt: (to.tilt ?? 0) + 0.38,
    pitch: (to.pitch ?? 0) + 0.18,
    opacity: 1,
  };
  const entryState = {
    ...interpolateState(entryFrom, to, enterProgress),
    asset: to.asset,
    scene: to.scene,
    opacity: 1,
  };

  return {
    ...entryState,
    secondaryModels: exitProgress < 0.98 ? [exitState] : [],
  };
}

function useScrollModelState(appRef) {
  // Only activeIndex / showNav live in React state (they change when CROSSING a section,
  // not every scroll frame). The per-frame values (modelState, theme, tint, hero-berry)
  // are pushed to a ref + CSS variables directly, so scrolling never re-renders React.
  const [navState, setNavState] = useState({ activeIndex: 0, showNav: false });
  const navStateRef = useRef({ activeIndex: 0, showNav: false });
  const modelStateRef = useRef(sections[0].modelState);
  // Timestamp (ms) of the last scroll-driven update. The scene reads this to drop to
  // low render resolution while scrolling. Event-driven (not frame-timing) so it never
  // flaps regardless of frame duration.
  const scrollActivityRef = useRef(0);

  useEffect(() => {
    let frame = 0;
    let lastScrollY = window.scrollY;

    // Cache the last CSS-variable values written to .app so we only touch the DOM
    // when a value actually changes. Writing a CSS custom property unconditionally
    // every scroll frame forces a style recalc of the whole subtree even when the
    // value is identical — which is most frames (theme/tint only move on transitions).
    const lastCssVars = { primary: '', secondary: '', glow: '', tint: '', berry: '' };
    const writeCssVar = (app, name, key, value) => {
      if (lastCssVars[key] === value) return;
      lastCssVars[key] = value;
      app.style.setProperty(name, value);
    };

    const getDocumentTop = (element) => window.scrollY + element.getBoundingClientRect().top;

    // Section positions/heights only change on layout (resize/load), NOT on scroll.
    // Cache them so the scroll handler doesn't force a full layout reflow every frame
    // (that was tanking the framerate and making the scroll-driven animation judder).
    let cachedMetrics = null;
    const refreshMetrics = () => {
      const sectionHeight = Math.max(window.innerHeight, 1);
      cachedMetrics = sections
        .map((section) => {
          const element = document.getElementById(section.id);
          if (!element) return null;
          return { top: getDocumentTop(element), height: Math.max(element.offsetHeight, sectionHeight) };
        })
        .filter(Boolean);
    };

    const alignHashSection = () => {
      if (!window.location.hash) return;
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) {
        window.scrollTo({ top: getDocumentTop(target), behavior: 'auto' });
      }
    };

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const sectionHeight = Math.max(window.innerHeight, 1);
        if (!cachedMetrics) refreshMetrics();
        const metrics = cachedMetrics;

        if (!metrics.length) return;

        const scrollY = window.scrollY;
        const scrollDirection = scrollY < lastScrollY ? 'up' : scrollY > lastScrollY ? 'down' : 'still';
        if (scrollDirection !== 'still') scrollActivityRef.current = performance.now();
        lastScrollY = scrollY;
        let activeIndex = metrics.findIndex((metric, index) => {
          const nextTop = metrics[index + 1]?.top ?? Number.POSITIVE_INFINITY;
          return scrollY >= metric.top - 1 && scrollY < nextTop - 1;
        });

        if (activeIndex === -1) {
          activeIndex = scrollY < metrics[0].top ? 0 : metrics.length - 1;
        }

        const currentMetric = metrics[activeIndex];
        const nextIndex = Math.min(activeIndex + 1, metrics.length - 1);
        const nextMetric = metrics[nextIndex];
        const sectionEnd = nextMetric?.top > currentMetric.top ? nextMetric.top : currentMetric.top + currentMetric.height;
        const currentSection = sections[activeIndex];
        const rawSectionProgress = clamp((scrollY - currentMetric.top) / Math.max(sectionEnd - currentMetric.top, 1), 0, 1);
        const systemsProgressRange = Math.max((currentSection.items?.length || 1) - 1, 1) * sectionHeight;
        const sectionProgress = currentSection.systemsSequence?.length
          ? clamp((scrollY - currentMetric.top) / Math.max(systemsProgressRange, 1), 0, 1)
          : rawSectionProgress;

        const current = currentSection.modelState;
        const modelTransitionStart = currentSection.modelTransitionStart ?? 0;
        const next = modelTransitionStart >= 1
          ? current
          : sections[Math.min(activeIndex + 1, sections.length - 1)].modelState;
        const modelProgress =
          modelTransitionStart >= 1
            ? 0
            : modelTransitionStart > 0
              ? clamp((sectionProgress - modelTransitionStart) / Math.max(1 - modelTransitionStart, 0.001), 0, 1)
              : sectionProgress;
        const easedModelProgress = currentSection.modelTransitionEase === 'smooth'
          ? smoothstep(0, 1, modelProgress)
          : modelProgress;
        const totalScrollable = Math.max(document.documentElement.scrollHeight - sectionHeight, 1);
        const showNav = scrollY >= sectionHeight * 0.72 || window.location.hash === '#intro';

        let interpolatedModelState = interpolateState(current, next, easedModelProgress);
        if (currentSection.modelTransitionMode === 'clipOnly' && modelProgress > 0) {
          const wrapperReleaseProgress = smoothstep(0.35, 0.98, modelProgress);
          interpolatedModelState = {
            ...interpolatedModelState,
            x: lerp(current.x, interpolatedModelState.x, wrapperReleaseProgress),
            y: lerp(current.y, interpolatedModelState.y, wrapperReleaseProgress),
            z: lerp(current.z, interpolatedModelState.z, wrapperReleaseProgress),
            scale: lerp(current.scale, interpolatedModelState.scale, wrapperReleaseProgress),
            rotate: lerp(current.rotate, interpolatedModelState.rotate, wrapperReleaseProgress),
            tilt: lerp(current.tilt, interpolatedModelState.tilt, wrapperReleaseProgress),
            pitch: lerp(current.pitch, interpolatedModelState.pitch, wrapperReleaseProgress),
            spin: lerp(current.spin, interpolatedModelState.spin, wrapperReleaseProgress),
            floatTilt: lerp(current.floatTilt, interpolatedModelState.floatTilt, wrapperReleaseProgress),
            visualCenterLockStrength: lerp(
              current.visualCenterLockStrength ?? 0,
              interpolatedModelState.visualCenterLockStrength ?? 0,
              wrapperReleaseProgress
            ),
          };
        }
        if (currentSection.systemsSequence?.length) {
          const sequenceProgress = getSystemsSequenceProgress(currentSection, sectionProgress);
          const from = sequenceProgress.sequence[sequenceProgress.fromIndex]?.modelState || current;
          const to = sequenceProgress.sequence[sequenceProgress.toIndex]?.modelState || from;
          if (currentSection.wordStepScroll && from.asset && to.asset && from.asset !== to.asset) {
            interpolatedModelState = createFlavorSwapState(from, to, sequenceProgress.stepProgress, sequenceProgress.fromIndex);
          } else {
            const sequenceModelProgress = currentSection.wordStepScroll
              ? smoothstep(0.12, 0.92, sequenceProgress.stepProgress)
              : smoothstep(0, 1, sequenceProgress.stepProgress);

            interpolatedModelState = interpolateState(from, to, sequenceModelProgress);
          }

          if (currentSection.wordStepScroll) {
            // Immunity -> five-products: play the GLB's green-can exit (it rotates
            // right and rolls out of frame, clip 0.75 -> 0.9375). It finishes (rolled
            // out + faded) by ~0.9, well before the section boundary at 1.0, so the can
            // fully disappears while still on Immunity — THEN the rest of the scroll
            // (0.9 -> 1.0) crosses to the five-products page with no can in frame.
            const greenExitMotion = smoothstep(0.76, 0.88, rawSectionProgress);
            const greenExitFade = smoothstep(0.82, 0.9, rawSectionProgress);
            if (greenExitMotion > 0) {
              interpolatedModelState = {
                ...interpolatedModelState,
                clipProgress: lerp(interpolatedModelState.clipProgress ?? SCREEN2_CLIP.green, 7.5 / 8, greenExitMotion),
                opacity: lerp(interpolatedModelState.opacity ?? 1, 0, greenExitFade),
                // Track the scroll directly (no clip damping) so the roll-out keeps pace
                // with the scroll instead of crawling out in slow-motion.
                clipDirect: true,
              };
            }
          }
        }

        if (currentSection.flavorScroll) {
          const itemCount = currentSection.items?.length || 1;
          const flavorConfig = currentSection.flavorScroll;
          const rawFlavorProgress = clamp(sectionProgress * Math.max(itemCount - 1, 1), 0, flavorConfig.maxFlavor);
          const flavorAmount = clamp(rawFlavorProgress / Math.max(flavorConfig.maxFlavor, 1), 0, 1);

          interpolatedModelState = {
            ...interpolatedModelState,
            asset: current.asset,
            clipProgress: lerp(flavorConfig.clipStart, flavorConfig.clipEnd, flavorAmount),
            flavorProgress: rawFlavorProgress,
          };
        }

        if (currentSection.modelClipScroll && rawSectionProgress < modelTransitionStart) {
          const clipConfig = currentSection.modelClipScroll;
          const clipAmount = getModelClipScrollAmount(clipConfig, rawSectionProgress);
          const clipOpacityAmount = clipConfig.opacityFadeStartAt == null
            ? 0
            : smoothstep(
              clipConfig.opacityFadeStartAt,
              clipConfig.opacityFadeEndAt ?? 1,
              rawSectionProgress
            );
          const currentClipOpacity = interpolatedModelState.opacity ?? current.opacity ?? 1;
          interpolatedModelState = {
            ...interpolatedModelState,
            asset: current.asset,
            clipIdleLoop: false,
            opacity: lerp(currentClipOpacity, clipConfig.opacityEnd ?? 0, clipOpacityAmount),
            clipProgress: lerp(clipConfig.clipStart ?? 0, clipConfig.clipEnd ?? 1, clipAmount),
          };
        }

        if (currentSection.lineupClipScrub) {
          if (rawSectionProgress <= 0.004) {
            // Ambient revolver orbit at the landing (clipProgress 0 -> idle loop).
            interpolatedModelState = {
              ...interpolatedModelState,
              clipProgress: 0,
              clipIdleLoop: true,
            };
          } else {
            // Any scroll goes straight into the break-apart (clip 0.6 = blue already
            // at the front; 0.6->0.8 = the symmetric blue-centre showcase). No orbit
            // replay, so one scroll immediately starts the spread. The idle->scrub
            // hand-off is smoothed by the clip damping (which seeds from the live
            // orbit phase) so it eases to blue-front instead of jumping.
            const clip = 0.6 + rawSectionProgress * 0.2;
            interpolatedModelState = {
              ...interpolatedModelState,
              clipProgress: clamp(clip, 0.6, 0.8),
              clipIdleLoop: false,
            };
          }
        }

        if (currentSection.openCanScrub) {
          // Continue from the lineup showcase (clip 0.8, 3 cans): isolate the blue
          // can (fade green/orange/platform) and tilt to a top-down view.
          const p = rawSectionProgress;
          const isolate = smoothstep(0.0, 0.25, p);
          const topView = smoothstep(0.0, 0.35, p);
          // Green/orange slide off-frame (left/right) as the blue can rises to the
          // top-down view.
          const sideExit = smoothstep(0.05, 0.3, p);
          // Blue can plays its GLB exit spin in-frame first (clip 0.8->1.0: the can
          // rotates ry -38/+27/-37 while drifting left), THEN a code slide carries it
          // the rest of the way off-frame + fade. All finishes by ~0.71, inside the
          // sticky-pinned range (~0.74 for the 380vh panel), so the can disappears while
          // "NO PILLS" is still up, before the price scrolls in.
          const exit = smoothstep(0.42, 0.62, p);
          const slideOff = smoothstep(0.6, 0.7, p);
          const exitFade = smoothstep(0.63, 0.71, p);
          interpolatedModelState = {
            ...interpolatedModelState,
            asset: 'screen3Desk',
            clipIdleLoop: false,
            clipProgress: lerp(0.8, 1.0, exit),
            focusIsolation: isolate,
            sideExit,
            pitch: lerp(-0.085, 0.85, topView),
            scale: lerp(2.7, 2.8, topView),
            y: lerp(-0.2, 1.25, topView),
            x: lerp(0, -3.4, slideOff),
            opacity: lerp(1, 0, exitFade),
          };
        }

        const fruitExitTransition = window.__athoraFruitExitTransition;
        if (fruitExitTransition?.active) {
          const fruitState = sections.find((section) => section.id === 'fruit')?.modelState;
          const fruitExitDistance = Math.max(fruitExitTransition.fromTop - fruitExitTransition.toTop, 1);
          const fruitExitProgress = clamp((fruitExitTransition.fromTop - scrollY) / fruitExitDistance, 0, 1);
          const fruitExitClipProgress = smoothstep(0.15, 1, fruitExitProgress);
          const fruitExitFade = smoothstep(0.88, 1, fruitExitProgress);

          interpolatedModelState = {
            ...fruitState,
            entryMotion: undefined,
            opacity: lerp(fruitState?.opacity ?? 1, 0, fruitExitFade),
            clipProgress: lerp(
              fruitState?.clipProgress ?? SCREEN4_CLIP.fruitSettled,
              SCREEN4_CLIP.fruitStart,
              fruitExitClipProgress
            ),
          };
        }

        if (currentSection.id === 'fruit' && window.__athoraFruitEntryMode === 'settled') {
          interpolatedModelState = {
            ...interpolatedModelState,
            entryMotion: undefined,
            clipProgress: modelProgress > 0
              ? interpolatedModelState.clipProgress
              : SCREEN4_CLIP.fruitSettled,
          };
        }

        if (current.entryMotion && current.entryMotion.mode !== 'time' && scrollDirection !== 'up') {
          const entryRange = Math.max(current.entryMotion.range ?? 0.3, 0.001);
          const entryProgress = smoothstep(0, 1, clamp(rawSectionProgress / entryRange, 0, 1));
          const entryFrom = current.entryMotion.from || {};
          const entryAnchor = current.entryMotion.targetAnchor || {};

          interpolatedModelState = {
            ...interpolatedModelState,
            x: lerp(getAnchoredMotionValue(entryFrom, entryAnchor, 'x', interpolatedModelState.x), interpolatedModelState.x, entryProgress),
            y: lerp(getAnchoredMotionValue(entryFrom, entryAnchor, 'y', interpolatedModelState.y), interpolatedModelState.y, entryProgress),
            z: lerp(getAnchoredMotionValue(entryFrom, entryAnchor, 'z', interpolatedModelState.z), interpolatedModelState.z, entryProgress),
            scale: lerp(getAnchoredMotionValue(entryFrom, entryAnchor, 'scale', interpolatedModelState.scale), interpolatedModelState.scale, entryProgress),
            rotate: lerp(getAnchoredMotionValue(entryFrom, entryAnchor, 'rotate', interpolatedModelState.rotate ?? 0), interpolatedModelState.rotate ?? 0, entryProgress),
            tilt: lerp(getAnchoredMotionValue(entryFrom, entryAnchor, 'tilt', interpolatedModelState.tilt ?? 0), interpolatedModelState.tilt ?? 0, entryProgress),
            pitch: lerp(getAnchoredMotionValue(entryFrom, entryAnchor, 'pitch', interpolatedModelState.pitch ?? 0), interpolatedModelState.pitch ?? 0, entryProgress),
            opacity: lerp(getAnchoredMotionValue(entryFrom, entryAnchor, 'opacity', interpolatedModelState.opacity ?? 1), interpolatedModelState.opacity ?? 1, entryProgress),
            entryMotion: undefined,
          };
        }

        if (current.exitMotion && scrollDirection === 'up') {
          const exitRange = Math.max(current.exitMotion.range ?? 0.28, 0.001);
          const visibleProgress = smoothstep(0, 1, clamp(rawSectionProgress / exitRange, 0, 1));
          if (visibleProgress < 1) {
            const exitTo = current.exitMotion.to || {};
            const exitAnchor = current.exitMotion.targetAnchor || {};

            interpolatedModelState = {
              ...interpolatedModelState,
              x: lerp(getAnchoredMotionValue(exitTo, exitAnchor, 'x', interpolatedModelState.x), interpolatedModelState.x, visibleProgress),
              y: lerp(getAnchoredMotionValue(exitTo, exitAnchor, 'y', interpolatedModelState.y), interpolatedModelState.y, visibleProgress),
              z: lerp(getAnchoredMotionValue(exitTo, exitAnchor, 'z', interpolatedModelState.z), interpolatedModelState.z, visibleProgress),
              scale: lerp(getAnchoredMotionValue(exitTo, exitAnchor, 'scale', interpolatedModelState.scale), interpolatedModelState.scale, visibleProgress),
              rotate: lerp(getAnchoredMotionValue(exitTo, exitAnchor, 'rotate', interpolatedModelState.rotate ?? 0), interpolatedModelState.rotate ?? 0, visibleProgress),
              tilt: lerp(getAnchoredMotionValue(exitTo, exitAnchor, 'tilt', interpolatedModelState.tilt ?? 0), interpolatedModelState.tilt ?? 0, visibleProgress),
              pitch: lerp(getAnchoredMotionValue(exitTo, exitAnchor, 'pitch', interpolatedModelState.pitch ?? 0), interpolatedModelState.pitch ?? 0, visibleProgress),
              opacity: lerp(getAnchoredMotionValue(exitTo, exitAnchor, 'opacity', interpolatedModelState.opacity), interpolatedModelState.opacity, visibleProgress),
              entryMotion: undefined,
            };
          }
        }

        // Last-screen can: keep it anchored to its place in the 1100px access frame.
        // The can lives in a viewport-fixed canvas, so by default it stays glued to the
        // screen while the form/footer scroll past it (it appears to drift down relative
        // to the layout). Offset its position with the in-section scroll so it travels
        // WITH the content and holds its designed spot. Animation + fade-in untouched.
        if (currentSection.id === 'access' || interpolatedModelState.asset === 'lastScreen') {
          const accessModelState = sections.find((section) => section.id === 'access').modelState;
          // NOTE: the scroll-follow offset that keeps the can in its layout spot is
          // applied LIVE in the render loop (from window.scrollY) to avoid the
          // React-state lag that made the can drift then snap back.
          interpolatedModelState = {
            ...interpolatedModelState,
            x: accessModelState.x,
            y: accessModelState.y,
            z: accessModelState.z ?? 0,
            scale: accessModelState.scale,
            rotate: accessModelState.rotate ?? 0,
            tilt: accessModelState.tilt ?? 0,
            pitch: accessModelState.pitch ?? 0,
            spin: 0,
            floatTilt: 0,
            lockAnimatedPositions: true,
            lockVisualCenter: true,
            lockViewportPosition: true,
          };
        }

        // On the hydration screen the can is shown via a pre-rendered transparent frame
        // sequence (scrubbed by scroll) instead of the live 3D model — hide the 3D can
        // here so they don't double up. The frame layer sits over the same CSS background.
        if (currentSection.id === 'all-systems') {
          interpolatedModelState = { ...interpolatedModelState, opacity: 0 };
        }

        modelStateRef.current = interpolatedModelState;

        // Theme, systems tint and hero-berry opacity are written straight to CSS
        // variables on the app element each frame — no React re-render on scroll.
        const app = appRef && appRef.current;
        if (app) {
          const nextSection = sections[activeIndex + 1];

          // --- active theme (mirrors the former activeTheme useMemo) ---
          const currentTheme = SECTION_THEMES[currentSection?.theme || 'blue'];
          let theme = currentTheme;
          if (currentSection?.systemsSequence?.length) {
            const sp = getSystemsSequenceProgress(currentSection, sectionProgress);
            const fromTheme = SECTION_THEMES[sp.sequence[sp.fromIndex]?.theme || currentSection.theme];
            const toTheme = SECTION_THEMES[sp.sequence[sp.toIndex]?.theme || currentSection.theme];
            const nextTheme = nextSection ? SECTION_THEMES[nextSection.theme] : null;
            const seqTheme = mixTheme(fromTheme, toTheme, smoothstep(0, 1, sp.stepProgress));
            const exitP = nextTheme ? smoothstep(0.76, 0.98, rawSectionProgress) : 0;
            theme = exitP > 0 ? mixTheme(seqTheme, nextTheme, exitP) : seqTheme;
          } else if (currentSection?.type === 'systems' && nextSection?.type === 'systems') {
            theme = mixTheme(currentTheme, SECTION_THEMES[nextSection.theme], smoothstep(0.78, 1, sectionProgress));
          }

          // --- systems tint (mirrors the former systemsTintOpacity useMemo) ---
          let tint = 0;
          if (currentSection?.type === 'systems') {
            if (currentSection.systemsSequence?.length) {
              const sp = getSystemsSequenceProgress(currentSection, sectionProgress);
              const fromThemeKey = sp.sequence[sp.fromIndex]?.theme || currentSection.theme;
              const toThemeKey = sp.sequence[sp.toIndex]?.theme || fromThemeKey;
              const isBlueStep = fromThemeKey === 'blue' && toThemeKey === 'blue';
              const nextThemeKey = nextSection?.theme || 'blue';
              const tintExit = nextSection && nextThemeKey === 'blue' && toThemeKey !== 'blue' ? smoothstep(0.76, 0.98, rawSectionProgress) : 0;
              if (isBlueStep) tint = 0;
              else if (tintExit > 0) tint = lerp(0.86, 0, tintExit);
              else if (fromThemeKey === 'blue') tint = smoothstep(0.18, 1, sp.stepProgress) * 0.86;
              else tint = 0.86;
            } else if (currentSection.theme === 'blue' && nextSection?.type === 'systems') {
              tint = smoothstep(0.78, 1, sectionProgress) * 0.86;
            } else {
              tint = currentSection.theme === 'blue' ? 0 : 0.86;
            }
          }

          const berry = currentSection?.id === 'intro' ? 1 - smoothstep(0.14, 0.58, sectionProgress) : 0;
          writeCssVar(app, '--active-primary', 'primary', theme.primary);
          writeCssVar(app, '--active-secondary', 'secondary', theme.secondary);
          writeCssVar(app, '--active-glow', 'glow', theme.glow);
          writeCssVar(app, '--systems-tint-opacity', 'tint', String(tint));
          writeCssVar(app, '--hero-berry-opacity', 'berry', String(berry));
        }

        window.__athoraDebug = {
          activeIndex,
          sectionId: currentSection.id,
          rawSectionProgress,
          sectionProgress,
          scrollDirection,
          modelProgress,
          easedModelProgress,
          modelState: interpolatedModelState,
        };

        if (activeIndex !== navStateRef.current.activeIndex || showNav !== navStateRef.current.showNav) {
          navStateRef.current = { activeIndex, showNav };
          setNavState({ activeIndex, showNav });
        }
      });
    };

    const sync = () => {
      refreshMetrics();
      alignHashSection();
      update();
    };

    update();
    const delayedUpdates = [80, 220, 480, 900].map((delay) => window.setTimeout(sync, delay));
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', sync);
    window.addEventListener('hashchange', sync);
    window.addEventListener('load', sync);

    // The preloader collapses the full-height install panel (height -> 0) via React
    // state AFTER the delayed syncs above have run, with NO resize event. That shifts
    // every section up ~1 viewport, leaving the cached metrics stale — so at scrollY 0
    // the hook still thinks it's on 'installing' (opacity-0 can) and the intro looks
    // empty until you scroll a screen. Observe the document height so any layout change
    // (preloader collapse, late image/font loads) refreshes the cached metrics.
    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        refreshMetrics();
        update();
      });
      resizeObserver.observe(document.body);
    }

    return () => {
      cancelAnimationFrame(frame);
      delayedUpdates.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', sync);
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('load', sync);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  return { activeIndex: navState.activeIndex, showNav: navState.showNav, modelStateRef, scrollActivityRef };
}

function useStartAtPreloaderOnPageLoad() {
  useLayoutEffect(() => {
    const canControlScrollRestoration = 'scrollRestoration' in window.history;
    const previousScrollRestoration = canControlScrollRestoration ? window.history.scrollRestoration : null;
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;

    if (canControlScrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }

    if (window.location.hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }

    root.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const raf = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });

    const timer = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      root.style.scrollBehavior = previousScrollBehavior;
    }, 120);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      root.style.scrollBehavior = previousScrollBehavior;
      if (canControlScrollRestoration && previousScrollRestoration) {
        window.history.scrollRestoration = previousScrollRestoration;
      }
    };
  }, []);
}

function usePreloaderScrollLock(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;

    let frame = 0;
    let touchStartY = 0;

    const getIntroTop = () => {
      const intro = document.getElementById('intro');
      return intro ? intro.offsetTop : 0;
    };

    const cleanInstallHash = () => {
      if (window.location.hash === '#installing') {
        window.history.replaceState(null, '', '#intro');
      }
    };

    const scrollToIntro = () => {
      const introTop = getIntroTop();
      window.scrollTo({ top: introTop, left: 0, behavior: 'auto' });
    };

    const keepPastPreloader = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const introTop = getIntroTop();
        cleanInstallHash();

        if (window.scrollY < introTop - 2) {
          scrollToIntro();
        }
      });
    };

    const preventPreloaderWheel = (event) => {
      if (event.deltaY >= 0) return;

      if (window.scrollY <= getIntroTop() + 32) {
        event.preventDefault();
        cleanInstallHash();
        scrollToIntro();
      }
    };

    const preventPreloaderKey = (event) => {
      if (event.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return;

      const blockedKeys = new Set(['Home', 'PageUp', 'ArrowUp', 'Space']);
      if (!blockedKeys.has(event.code) && !blockedKeys.has(event.key)) return;
      if (event.code === 'Space' && !event.shiftKey) return;

      if (event.code === 'Home' || event.key === 'Home' || window.scrollY <= getIntroTop() + window.innerHeight * 0.5) {
        event.preventDefault();
        cleanInstallHash();
        scrollToIntro();
      }
    };

    const rememberTouchStart = (event) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const preventPreloaderTouch = (event) => {
      const currentY = event.touches[0]?.clientY ?? touchStartY;
      const draggingTowardPreloader = currentY > touchStartY + 4;

      if (draggingTowardPreloader && window.scrollY <= getIntroTop() + 32) {
        event.preventDefault();
        cleanInstallHash();
        scrollToIntro();
      }
    };

    keepPastPreloader();
    window.history.replaceState(null, '', '#intro');
    window.addEventListener('scroll', keepPastPreloader, { passive: true });
    window.addEventListener('resize', keepPastPreloader);
    window.addEventListener('hashchange', keepPastPreloader);
    window.addEventListener('popstate', keepPastPreloader);
    window.addEventListener('wheel', preventPreloaderWheel, { passive: false });
    window.addEventListener('keydown', preventPreloaderKey);
    window.addEventListener('touchstart', rememberTouchStart, { passive: true });
    window.addEventListener('touchmove', preventPreloaderTouch, { passive: false });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', keepPastPreloader);
      window.removeEventListener('resize', keepPastPreloader);
      window.removeEventListener('hashchange', keepPastPreloader);
      window.removeEventListener('popstate', keepPastPreloader);
      window.removeEventListener('wheel', preventPreloaderWheel);
      window.removeEventListener('keydown', preventPreloaderKey);
      window.removeEventListener('touchstart', rememberTouchStart);
      window.removeEventListener('touchmove', preventPreloaderTouch);
    };
  }, [enabled]);
}

function useControlledStepScroll(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;

    const scrollScrubSections = sections.filter((section) => section.scrollScrub);
    let settleFrame = 0;
    let maxLockTimer = 0;
    let locked = false;
    let lockedTargetTop = null;
    let lastInputAt = 0;
    let touchStartY = 0;
    let touchStepConsumed = false;

    const isEditableTarget = (target) =>
      Boolean(target?.closest?.('input, textarea, select, [contenteditable="true"]'));

    const getMaxScroll = () => Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    const clearFruitExitTransition = () => {
      window.__athoraFruitExitTransition = null;
    };

    // Inertial (smooth) scrolling for scrub ranges: discrete wheel notches accumulate
    // into a target that the page eases toward each frame, turning the choppy native
    // scroll into continuous motion so the scroll-driven 3D animation stops juddering.
    let smoothTarget = null;
    let smoothRaf = 0;
    const stopSmoothScroll = () => {
      if (smoothRaf) window.cancelAnimationFrame(smoothRaf);
      smoothRaf = 0;
      smoothTarget = null;
    };
    const smoothScrollStep = () => {
      if (smoothTarget == null) { smoothRaf = 0; return; }
      const current = window.scrollY;
      const diff = smoothTarget - current;
      const step = diff * 0.16;
      // Snap-and-stop once we're within ~1px OR the eased step rounds below a pixel.
      // Otherwise the integer scrollY never advances (0.16 * a few px < 1px) and the rAF
      // loop spins forever, pinning the scroll and overriding every other scroll attempt.
      if (Math.abs(diff) <= 1 || Math.abs(step) < 1) {
        window.scrollTo(0, Math.round(smoothTarget));
        smoothTarget = null;
        smoothRaf = 0;
        return;
      }
      window.scrollTo(0, current + step);
      smoothRaf = window.requestAnimationFrame(smoothScrollStep);
    };
    const smoothScrollBy = (delta) => {
      const base = smoothTarget == null ? window.scrollY : smoothTarget;
      smoothTarget = clamp(base + delta, 0, getMaxScroll());
      if (!smoothRaf) smoothRaf = window.requestAnimationFrame(smoothScrollStep);
    };

    const getDocumentTopById = (id) => {
      const element = document.getElementById(id);
      return element ? Math.round(window.scrollY + element.getBoundingClientRect().top) : null;
    };

    function isNativeScrollScrubRange(direction) {
      const currentTop = Math.round(window.scrollY);

      return scrollScrubSections.some((section) => {
        const sectionTop = getDocumentTopById(section.id);
        const targetTop = getDocumentTopById(section.scrollScrub.targetSectionId);
        if (sectionTop === null || targetTop === null) return false;
        // Optional offset so only the tail of a stepped section scrubs (the word
        // steps before it still snap normally).
        const scrubTop = sectionTop + (section.scrollScrub.startOffsetSteps || 0) * window.innerHeight;
        if (targetTop <= scrubTop) return false;

        if (direction > 0) {
          return currentTop >= scrubTop - 8 && currentTop < targetTop - 8;
        }

        return currentTop > scrubTop + 8 && currentTop <= targetTop + 8;
      });
    }

    const setFruitEntryModeForTarget = (direction, targetTop) => {
      const fruit = document.getElementById('fruit');
      if (!fruit) return;

      const fruitTop = Math.round(window.scrollY + fruit.getBoundingClientRect().top);
      const fruitBottom = fruitTop + Math.max(fruit.offsetHeight, window.innerHeight);
      const currentTop = Math.round(window.scrollY);
      const targetIsFruit = targetTop >= fruitTop - 8 && targetTop < fruitBottom - 8;

      if (!targetIsFruit) return;

      if (direction < 0 && currentTop > fruitTop + 8) {
        window.__athoraFruitEntryMode = 'settled';
        return;
      }

      if (direction > 0 && currentTop < fruitTop - 8) {
        window.__athoraFruitEntryMode = 'rollIn';
      }
    };

    const getStepTargets = () => {
      const maxScroll = getMaxScroll();
      const rawTargets = Array.from(document.querySelectorAll(STEP_SCROLL_SELECTOR))
        .filter((element) => element.id !== 'installing')
        .map((element) => Math.round(window.scrollY + element.getBoundingClientRect().top))
        .filter((top) => top > 0 && top <= maxScroll + 2)
        .map((top) => clamp(top, 0, maxScroll));

      rawTargets.push(maxScroll);

      return rawTargets
        .map((top) => Math.round(top))
        .sort((a, b) => a - b)
        .filter((top, index, targets) => index === 0 || Math.abs(top - targets[index - 1]) > 4);
    };

    const getNextTarget = (direction) => {
      const currentTop = Math.round(window.scrollY);
      const targets = getStepTargets();
      const threshold = 8;

      if (direction > 0) {
        return targets.find((top) => top > currentTop + threshold) ?? null;
      }

      for (let index = targets.length - 1; index >= 0; index -= 1) {
        if (targets[index] < currentTop - threshold) return targets[index];
      }

      return null;
    };

    const unlock = () => {
      locked = false;
      lockedTargetTop = null;
      clearFruitExitTransition();
      window.cancelAnimationFrame(settleFrame);
      window.clearTimeout(maxLockTimer);
    };

    const watchTargetSettlement = () => {
      window.cancelAnimationFrame(settleFrame);
      window.clearTimeout(maxLockTimer);

      const startedAt = performance.now();

      const check = () => {
        if (!locked) return;

        const nearTarget = lockedTargetTop === null || Math.abs(window.scrollY - lockedTargetTop) <= 3;
        const inputIsIdle = performance.now() - lastInputAt >= STEP_SCROLL_SETTLE_MS;
        const expired = performance.now() - startedAt >= STEP_SCROLL_MAX_LOCK_MS;

        if ((nearTarget && inputIsIdle) || expired) {
          unlock();
          return;
        }

        settleFrame = window.requestAnimationFrame(check);
      };

      maxLockTimer = window.setTimeout(unlock, STEP_SCROLL_MAX_LOCK_MS + STEP_SCROLL_SETTLE_MS + 120);
      settleFrame = window.requestAnimationFrame(check);
    };

    const moveOneStep = (direction) => {
      lastInputAt = performance.now();

      if (locked) return true;

      const targetTop = getNextTarget(direction);
      if (targetTop === null) return false;

      // Kill any in-flight scrub inertia so it can't fight (or override) this step jump.
      stopSmoothScroll();
      clearFruitExitTransition();
      setFruitEntryModeForTarget(direction, targetTop);
      if (direction < 0) {
        const fruitTop = getDocumentTopById('fruit');
        const currentTop = Math.round(window.scrollY);
        if (fruitTop !== null && Math.abs(currentTop - fruitTop) <= 24 && targetTop < fruitTop - 8) {
          window.__athoraFruitExitTransition = {
            active: true,
            fromTop: fruitTop,
            toTop: targetTop,
          };
        }
      }

      locked = true;
      lockedTargetTop = targetTop;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: targetTop, left: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      watchTargetSettlement();

      return true;
    };

    const handleWheel = (event) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || isEditableTarget(event.target)) return;

      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(delta) < STEP_SCROLL_WHEEL_THRESHOLD) return;
      const direction = delta > 0 ? 1 : -1;

      if (locked) {
        lastInputAt = performance.now();
        event.preventDefault();
        return;
      }

      if (isNativeScrollScrubRange(direction)) {
        // Let the browser scroll natively here — the frame-scrub layer tracks
        // window.scrollY, so the can flows continuously and smoothly with the scroll
        // (no custom easing/hijack, no word-by-word snapping).
        return;
      }

      if (moveOneStep(direction)) {
        event.preventDefault();
      }
    };

    const handleKeyDown = (event) => {
      if (event.defaultPrevented || isEditableTarget(event.target)) return;

      const directionByKey = {
        ArrowDown: 1,
        PageDown: 1,
        Space: event.shiftKey ? -1 : 1,
        ArrowUp: -1,
        PageUp: -1,
      };
      const direction = directionByKey[event.code] ?? directionByKey[event.key];
      if (!direction) return;

      if (locked) {
        lastInputAt = performance.now();
        event.preventDefault();
        return;
      }

      if (isNativeScrollScrubRange(direction)) return;

      if (moveOneStep(direction)) {
        event.preventDefault();
      }
    };

    const handleTouchStart = (event) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
      touchStepConsumed = false;
    };

    const handleTouchMove = (event) => {
      if (event.defaultPrevented || isEditableTarget(event.target)) return;

      const currentY = event.touches[0]?.clientY ?? touchStartY;
      const deltaY = touchStartY - currentY;

      if (locked) {
        lastInputAt = performance.now();
        event.preventDefault();
        return;
      }

      if (touchStepConsumed || Math.abs(deltaY) < STEP_SCROLL_TOUCH_THRESHOLD) return;

      touchStepConsumed = true;
      const direction = deltaY > 0 ? 1 : -1;
      if (isNativeScrollScrubRange(direction)) return;

      if (moveOneStep(direction)) {
        event.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    // While the JS step-scroll owns navigation, turn OFF CSS scroll-snap entirely.
    // moveOneStep already lands the scroll on exact section/claim targets, so mandatory
    // snap is redundant and actively fights the programmatic scroll at range boundaries
    // (it re-engaged mid-flight and snapped back, trapping the user on five-products).
    const html = document.documentElement;
    const previousSnapType = html.style.scrollSnapType;
    html.style.scrollSnapType = 'none';

    return () => {
      unlock();
      stopSmoothScroll();
      html.style.scrollSnapType = previousSnapType;
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [enabled]);
}

function useScrollScrubSnapMode(enabled) {
  useEffect(() => {
    const html = document.documentElement;
    const scrollScrubSections = sections.filter((section) => section.scrollScrub);

    if (!enabled || !scrollScrubSections.length) {
      html.classList.remove('athora-scroll-scrub');
      return undefined;
    }

    let frame = 0;

    const getDocumentTopById = (id) => {
      const element = document.getElementById(id);
      return element ? Math.round(window.scrollY + element.getBoundingClientRect().top) : null;
    };

    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const currentTop = Math.round(window.scrollY);
        const isInScrubRange = scrollScrubSections.some((section) => {
          const sectionTop = getDocumentTopById(section.id);
          const targetTop = getDocumentTopById(section.scrollScrub.targetSectionId);
          if (sectionTop === null || targetTop === null) return false;
          const scrubTop = sectionTop + (section.scrollScrub.startOffsetSteps || 0) * window.innerHeight;
          return currentTop >= scrubTop - 8 && currentTop <= targetTop + 8;
        });

        html.classList.toggle('athora-scroll-scrub', isInScrubRange);
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      html.classList.remove('athora-scroll-scrub');
    };
  }, [enabled]);
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

function normalizeObjectAfterScale(object, targetHeight = 3.35) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const largestAxis = Math.max(size.x, size.y, size.z);
  if (largestAxis <= 0) return;

  const nextScale = targetHeight / largestAxis;
  object.scale.setScalar(nextScale);
  object.position.set(
    object.position.x - center.x * nextScale,
    object.position.y - center.y * nextScale,
    object.position.z - center.z * nextScale
  );
}

function AthoraScene({ modelStateRef, scrollActivityRef, hidden = false, onCriticalAssetsReady }) {
  // modelStateRef is a shared ref written every scroll frame by useScrollModelState.
  // Reading it in the render loop (instead of a prop) keeps scrolling out of React.
  const mountRef = useRef(null);
  const onCriticalAssetsReadyRef = useRef(onCriticalAssetsReady);

  useEffect(() => {
    onCriticalAssetsReadyRef.current = onCriticalAssetsReady;
  }, [onCriticalAssetsReady]);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.1, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // Dynamic resolution: render at full res when the can is idle (crisp hero shot),
    // drop to a lower res while the user is actively scrolling (motion hides the
    // softness). renderer.render() is ~92% of per-frame JS time and ~16/28 of that
    // scales with pixel count, so this roughly halves the fill-rate cost during scroll.
    const HIGH_RATIO = Math.min(window.devicePixelRatio, 1);
    const LOW_RATIO = Math.max(HIGH_RATIO * 0.5, 0.45);
    let activeRatio = HIGH_RATIO;
    renderer.setPixelRatio(HIGH_RATIO);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.35;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnvironment = new RoomEnvironment();
    const environmentTexture = pmrem.fromScene(roomEnvironment, 0.04).texture;
    roomEnvironment.dispose();
    pmrem.dispose();
    const maxTextureAnisotropy = renderer.capabilities.getMaxAnisotropy();

    const root = new THREE.Group();
    scene.add(root);

    const modelWrap = new THREE.Group();
    root.add(modelWrap);

    const fallback = createFallbackCan();
    fallback.visible = false;
    modelWrap.add(fallback);

    const sceneVariants = [];
    const assetVariants = { fallback };
    const animationMixers = new Map();
    const warmupHandles = new Set();
    let activeVariants = new Set();
    let criticalAssetsReadySent = false;
    let deferredAssetLoadsScheduled = false;
    let disposed = false;

    const loader = new GLTFLoader();
    const getFlavorIndex = (mesh, materials) => {
      const ancestorNames = [];
      let parent = mesh.parent;
      while (parent) {
        ancestorNames.push(parent.name || '');
        parent = parent.parent;
      }

      const names = [
        mesh.name,
        ...ancestorNames,
        ...materials.map((material) => material.name || ''),
      ].join(' ');
      if (/blue|Cylinder002|250_ml002/i.test(names)) return 0;
      if (/orange|mango|Cylinder005|250_ml003/i.test(names)) return 1;
      if (/green|lime|lemon|Cylinder001|250_ml001/i.test(names)) return 2;
      return null;
    };

    const applyMaterialSettings = (material, settings = {}) => {
      Object.entries(settings).forEach(([key, value]) => {
        if (key === 'color') {
          material.color?.set?.(value);
        } else if (key in material) {
          material[key] = value;
        }
      });
    };

    const tuneCanMaterial = (material, materialProfile = SCREEN2_DEFAULT_MATERIALS) => {
      const name = material.name || '';
      const isAluminum = /aluminum|aluminium|scuffed/i.test(name);
      const isCanBody = /blue|orange|green/i.test(name);

      if (material.map) {
        material.map.anisotropy = Math.min(maxTextureAnisotropy, 8);
        material.map.needsUpdate = true;
      }

      if (!isAluminum && !isCanBody) return;

      material.envMap = environmentTexture;

      if (isAluminum) {
        applyMaterialSettings(material, materialProfile.aluminum);
      }

      if (isCanBody) {
        applyMaterialSettings(material, materialProfile.canBody);
      }

      material.needsUpdate = true;
    };

    const tuneLineupMaterial = (material) => {
      const name = material.name || '';
      if (/^Base\.001$/i.test(name)) {
        material.color?.set?.(0xf7f0dc);
        if ('metalness' in material) material.metalness = 0.18;
        if ('roughness' in material) material.roughness = 0.28;
        if ('envMapIntensity' in material) material.envMapIntensity = 1.9;
        if ('emissive' in material) material.emissive.set(0x8fc7ff);
        if ('emissiveIntensity' in material) material.emissiveIntensity = 0.035;
      }

      if (/^Glow$/i.test(name)) {
        material.color?.set?.(0xdce8ff);
        if ('emissive' in material) material.emissive.set(0xbfd8ff);
        if ('emissiveIntensity' in material) material.emissiveIntensity = 0.85;
        if ('metalness' in material) material.metalness = 0;
        if ('roughness' in material) material.roughness = 0.2;
        if ('envMapIntensity' in material) material.envMapIntensity = 2.1;
        material.transparent = true;
        material.opacity = 0.78;
        material.depthWrite = false;
      }

      material.needsUpdate = true;
    };

    const prepareClone = (clone, targetHeight = 3.35, options = {}) => {
      const renderMaterials = [];
      const flavorMeshes = [];
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
            const flavorIndex = options.flavorDriven || options.forceFlavorBaseOpacity
              ? getFlavorIndex(child, clonedMaterials)
              : null;
            if (flavorIndex !== null) {
              child.userData.flavorIndex = flavorIndex;
              flavorMeshes.push(child);
            }
            clonedMaterials.forEach((material) => {
              tuneCanMaterial(material, options.materialProfile);
              tuneLineupMaterial(material);
              material.transparent = material.transparent || material.opacity < 1;
              const baseOpacity = (options.flavorDriven || options.forceFlavorBaseOpacity) && flavorIndex !== null
                ? 1
                : (material.opacity ?? 1);
              material.userData.baseOpacity = baseOpacity;
              material.userData.baseTransparent = material.transparent;
              material.userData.baseDepthWrite = material.depthWrite;
              material.needsUpdate = true;
              renderMaterials.push({
                material,
                flavorIndex: child.userData.flavorIndex,
                lineupRole: child.userData.lineupRole,
              });
            });
          }
        }
      });
      if (options.normalizeAfterScale) {
        normalizeObjectAfterScale(clone, targetHeight);
      } else {
        normalizeObject(clone, targetHeight);
      }
      clone.userData.basePosition = clone.position.clone();
      clone.userData.baseScale = clone.scale.clone();
      clone.userData.baseRotation = clone.rotation.clone();
      clone.userData.renderMaterials = renderMaterials;
      clone.userData.flavorMeshes = flavorMeshes;
      clone.userData.lineupChildren = [];
      clone.traverse((child) => {
        if (child.userData.lineupOffset) clone.userData.lineupChildren.push(child);
      });
      clone.visible = false;
      modelWrap.add(clone);
      return clone;
    };

    const lockLocalPositions = (object) => {
      object.traverse((child) => {
        child.userData.lockedLocalPosition = child.position.clone();
      });
    };

    const bindClipsToScroll = (object, clips = [], options = {}) => {
      if (!clips.length) return;

      const nodeNames = new Set();
      object.traverse((child) => {
        if (child.name) nodeNames.add(child.name);
      });
      const validClips = clips
        .map((clip) => {
          const validTracks = clip.tracks.filter((track) => {
            const targetName = track.name.split('.')[0];
            if (options.excludePositionTracks && track.name.toLowerCase().includes('position')) return false;
            return !targetName || nodeNames.has(targetName);
          });

          return validTracks.length ? new THREE.AnimationClip(clip.name, clip.duration, validTracks) : null;
        })
        .filter(Boolean);

      if (!validClips.length) return;

      const mixer = new THREE.AnimationMixer(object);
      let duration = 0;
      validClips.forEach((clip) => {
        duration = Math.max(duration, clip.duration || 0);
        const action = mixer.clipAction(clip);
        action.reset();
        action.play();
      });
      mixer.setTime(0);
      animationMixers.set(object, { mixer, duration });
    };

    const applyStaticClipPose = (object, clips = [], progress = 0) => {
      if (!clips.length) return;

      const mixer = new THREE.AnimationMixer(object);
      let duration = 0;
      clips.forEach((clip) => {
        duration = Math.max(duration, clip.duration || 0);
        mixer.clipAction(clip).reset().play();
      });
      mixer.setTime(duration * clamp(progress, 0, 1));
      object.updateMatrixWorld(true);
      mixer.stopAllAction();
      mixer.uncacheRoot(object);
    };

    const recenterVariantToVisibleBounds = (variant) => {
      variant.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(variant);
      const center = new THREE.Vector3();
      box.getCenter(center);
      variant.position.sub(center);
      variant.updateMatrixWorld(true);
      variant.userData.basePosition = variant.position.clone();
      variant.userData.renderInitialized = false;
    };

    const wrapVariantWithStablePivot = (variant) => {
      const parent = variant.parent;
      const wrapper = new THREE.Group();
      wrapper.name = `${variant.name || 'variant'}Pivot`;

      if (parent) {
        parent.add(wrapper);
      }
      wrapper.add(variant);
      variant.visible = true;

      wrapper.visible = false;
      wrapper.userData.basePosition = wrapper.position.clone();
      wrapper.userData.baseScale = wrapper.scale.clone();
      wrapper.userData.baseRotation = wrapper.rotation.clone();
      wrapper.userData.renderMaterials = variant.userData.renderMaterials || [];
      wrapper.userData.lineupChildren = variant.userData.lineupChildren || [];
      wrapper.userData.renderInitialized = false;

      return wrapper;
    };

    const resolveVariant = (asset, sceneIndex) => (asset ? assetVariants[asset] : sceneVariants[sceneIndex]);

    const applyVariantOpacity = (variant, variantOpacity, targetState) => {
      const renderMaterials = variant.userData.renderMaterials || [];
      const flavorProgress = Number.isFinite(targetState.flavorProgress) ? targetState.flavorProgress : null;
      const visibleFlavorIndices = targetState.visibleFlavors?.length
        ? new Set(targetState.visibleFlavors.map((flavor) => SCREEN2_FLAVOR_INDEX[flavor]).filter((index) => index !== undefined))
        : null;
      const backgroundFlavorIndices = targetState.backgroundFlavors?.length
        ? new Set(targetState.backgroundFlavors.map((flavor) => SCREEN2_FLAVOR_INDEX[flavor]).filter((index) => index !== undefined))
        : null;
      const lineupIsolation = targetState.asset === 'screen3Desk'
        ? clamp(targetState.focusIsolation ?? 0, 0, 1)
        : 0;
      const visibleFlavorKey = visibleFlavorIndices ? [...visibleFlavorIndices].sort().join(',') : 'all';
      const backgroundFlavorKey = backgroundFlavorIndices ? [...backgroundFlavorIndices].sort().join(',') : 'none';
      const opacityKey = [
        Math.round(variantOpacity * 1000),
        flavorProgress === null ? 'x' : Math.round(flavorProgress * 1000),
        Math.round(lineupIsolation * 1000),
        visibleFlavorKey,
        backgroundFlavorKey,
        Math.round((targetState.backgroundFlavorOpacity ?? 1) * 1000),
      ].join(':');
      if (variant.userData.opacityKey === opacityKey) return;

      variant.userData.opacityKey = opacityKey;
      const flavorMeshes = variant.userData.flavorMeshes || [];
      flavorMeshes.forEach((mesh) => {
        const flavorIndex = mesh.userData.flavorIndex;
        const isBackgroundFlavor = backgroundFlavorIndices?.has(flavorIndex);
        mesh.visible = !visibleFlavorIndices || visibleFlavorIndices.has(flavorIndex) || isBackgroundFlavor;
      });

      renderMaterials.forEach(({ material, flavorIndex, lineupRole }) => {
        const isBackgroundFlavor = backgroundFlavorIndices?.has(flavorIndex);
        let flavorOpacity = 1;
        if (flavorProgress !== null && flavorIndex !== undefined) {
          const rawFlavorOpacity = clamp(1 - Math.abs(flavorIndex - flavorProgress), 0, 1);
          flavorOpacity = smoothstep(0, 1, rawFlavorOpacity);
        }

        if (isBackgroundFlavor && visibleFlavorIndices && !visibleFlavorIndices.has(flavorIndex)) {
          flavorOpacity = targetState.backgroundFlavorOpacity ?? 1;
        } else if (visibleFlavorIndices && flavorIndex !== undefined && !visibleFlavorIndices.has(flavorIndex)) {
          flavorOpacity = 0;
        }

        const lineupOpacity = lineupRole === 'lineup-side' || lineupRole === 'lineup-platform'
          ? 1 - lineupIsolation
          : 1;

        const nextOpacity = material.userData.baseOpacity * variantOpacity * flavorOpacity * lineupOpacity;
        // transparent / depthWrite are GL render state that the renderer applies every
        // frame — toggling them does NOT require a shader recompile. Setting needsUpdate
        // here forced ~20 program recompiles mid-fade (e.g. the green can exit into
        // five-products), which tanked the framerate. Update the state without needsUpdate.
        material.transparent = material.userData.baseTransparent || nextOpacity < 0.999;
        material.depthWrite = nextOpacity > 0.001 ? material.userData.baseDepthWrite : false;
        material.opacity = nextOpacity;
      });
    };

    const applyBoundAnimation = (variant, targetState, delta, elapsed) => {
      const boundAnimation = animationMixers.get(variant);
      if (!boundAnimation) return;

      const restoreLockedPositions = () => {
        if (!(targetState.lockAnimatedPositions || targetState.asset === 'lastScreen')) return;

        variant.traverse((child) => {
          const lockedPosition = child.userData.lockedLocalPosition;
          if (lockedPosition) child.position.copy(lockedPosition);
        });
      };

      if (targetState.clipAutoplay) {
        const speed = targetState.clipSpeed ?? 1;
        boundAnimation.mixer.update(delta * speed);
        restoreLockedPositions();
        variant.userData.lastClipProgress = null;
        return;
      }

      const targetClip = clamp(targetState.clipProgress ?? 0, 0, 1);
      const shouldIdleLoop = targetState.asset === 'screen3Desk'
        && targetState.clipIdleLoop
        && targetClip <= 0.001;
      let poseKey = `scroll:${Math.round(targetClip * 1000)}`;

      if (shouldIdleLoop) {
        const loopStart = clamp(targetState.clipIdleLoopStart ?? 0, 0, boundAnimation.duration);
        const loopEnd = clamp(targetState.clipIdleLoopEnd ?? boundAnimation.duration, loopStart + 0.001, boundAnimation.duration);
        const loopDuration = Math.max(loopEnd - loopStart, 0.001);
        const speed = targetState.clipIdleLoopSpeed ?? 1;
        const loopTime = loopStart + ((elapsed * speed) % loopDuration);
        boundAnimation.mixer.setTime(loopTime);
        variant.userData.lastClipProgress = null;
        // Seed the damped clip from the live orbit phase so that when the user
        // starts scrolling, the scrub eases from the current orbit pose to the
        // break-apart start (blue front) instead of snapping.
        variant.userData.displayedClip = loopTime / boundAnimation.duration;
        poseKey = `idle:${Math.round(loopTime * 1000)}`;
      } else {
        // Damp the displayed clip toward the target so discrete wheel-scroll steps
        // scrub the desk animation smoothly instead of jumping per scroll notch.
        let displayedClip = targetClip;
        // clipDirect (e.g. the green-can exit) is already driven smoothly by the native
        // scroll scrub, so adding clip damping on top just makes it crawl in slow-mo.
        // Track the scroll value 1:1 there; keep damping for the snap-stepped carousel.
        if (!targetState.clipDirect && (targetState.asset === 'screen3Desk' || targetState.asset === 'screen2AnimatedStack')) {
          const prev = variant.userData.displayedClip;
          if (prev == null) {
            displayedClip = targetClip;
          } else {
            const k = 1 - Math.exp(-10 * delta);
            let next = prev + (targetClip - prev) * k;
            // Cap the per-frame change so a large jump (e.g. the idle-orbit -> break-apart
            // hand-off) eases into a smooth turn instead of a blurred jump.
            const maxStep = 0.02;
            next = clamp(next, prev - maxStep, prev + maxStep);
            displayedClip = next;
          }
          variant.userData.displayedClip = displayedClip;
        } else {
          variant.userData.displayedClip = targetState.clipDirect ? targetClip : null;
        }
        if (Math.abs((variant.userData.lastClipProgress ?? -1) - displayedClip) > 0.0004) {
          boundAnimation.mixer.setTime(boundAnimation.duration * displayedClip);
          variant.userData.lastClipProgress = displayedClip;
        }
        poseKey = `scroll:${Math.round(displayedClip * 1000)}`;
      }

      const sideExit = clamp(targetState.sideExit ?? 0, 0, 1);
      const lineupChildren = variant.userData.lineupChildren || [];
      lineupChildren.forEach((child) => {
        const offset = child.userData.lineupOffset;
        if (offset) {
          if (child.userData.lineupBasePositionKey !== poseKey) {
            child.userData.lineupBasePosition = child.position.clone();
            child.userData.lineupBasePositionKey = poseKey;
          }
          const basePosition = child.userData.lineupBasePosition;
          // Slide the side cans (green left, orange right) off-frame as sideExit ramps.
          let sideX = 0;
          if (sideExit > 0 && child.userData.lineupRole === 'lineup-side') {
            const dir = /\.006/.test(child.name) ? -1 : 1;
            sideX = dir * sideExit * 4.2;
          }
          child.position.set(
            basePosition.x + offset.x + sideX,
            basePosition.y + offset.y,
            basePosition.z + offset.z
          );
        }
      });

      restoreLockedPositions();
    };

    const warmVariant = (variant) => {
      if (!variant) return;

      const previousWrapVisible = modelWrap.visible;
      const previousVariantVisible = variant.visible;
      const materialStates = [];
      const visibilityStates = [];

      variant.traverse((child) => {
        // Force every mesh visible during compile. Flavor meshes (orange/green cans)
        // are hidden until their step, so renderer.compile would otherwise skip them and
        // their shaders would compile on first reveal mid-scroll (e.g. the green-can exit
        // into five-products) — a ~20-program stall that tanked the framerate there.
        if (child.visible === false) {
          visibilityStates.push(child);
          child.visible = true;
        }
        if (!child.isMesh || !child.material) return;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          materialStates.push({
            material,
            colorWrite: material.colorWrite,
            depthWrite: material.depthWrite,
            transparent: material.transparent,
          });
          material.colorWrite = false;
          material.depthWrite = false;
          // Compile the transparent variant of the program too (the fade path uses it).
          material.transparent = true;
        });
      });

      modelWrap.visible = true;
      variant.visible = true;

      try {
        renderer.compile(scene, camera);
        renderer.render(scene, camera);
      } finally {
        materialStates.forEach(({ material, colorWrite, depthWrite, transparent }) => {
          material.colorWrite = colorWrite;
          material.depthWrite = depthWrite;
          material.transparent = transparent;
        });
        visibilityStates.forEach((child) => { child.visible = false; });
        variant.visible = previousVariantVisible;
        modelWrap.visible = previousWrapVisible;
      }
    };

    const scheduleWarmVariant = (variant, delay = 160) => {
      let handle;
      const run = () => {
        if (handle) warmupHandles.delete(handle);
        warmVariant(variant);
      };

      if ('requestIdleCallback' in window) {
        handle = {
          type: 'idle',
          id: window.requestIdleCallback(run, { timeout: delay + 800 }),
        };
      } else {
        handle = {
          type: 'timeout',
          id: window.setTimeout(run, delay),
        };
      }

      warmupHandles.add(handle);
    };

    const notifyCriticalAssetsReady = () => {
      if (disposed || criticalAssetsReadySent) return;
      criticalAssetsReadySent = true;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (!disposed) {
            onCriticalAssetsReadyRef.current?.();
            loadLastScreenAssetVariant();
            scheduleDeferredAssetLoads();
          }
        });
      });
    };

    let lastScreenAssetLoadStarted = false;
    function loadLastScreenAssetVariant() {
      if (disposed || lastScreenAssetLoadStarted || assetVariants.lastScreen) return;
      lastScreenAssetLoadStarted = true;

      loader.load(
        '/blender-files/screens/last-screen.glb',
        (gltf) => {
          if (disposed) return;
          const clone = gltf.scene.clone(true);
          const lastScreenVariant = prepareClone(clone, 3.6, { normalizeAfterScale: true });
          assetVariants.lastScreen = wrapVariantWithStablePivot(lastScreenVariant);
          lockLocalPositions(assetVariants.lastScreen);
          bindClipsToScroll(assetVariants.lastScreen, gltf.animations, {
            excludePositionTracks: true,
          });
          scheduleWarmVariant(assetVariants.lastScreen, 80);
        },
        undefined,
        () => {
          assetVariants.lastScreen = undefined;
        }
      );
    }

    const lastScreenPreloadHandle = {
      type: 'timeout',
      id: window.setTimeout(loadLastScreenAssetVariant, 650),
    };
    warmupHandles.add(lastScreenPreloadHandle);

    let screen4AssetLoadStarted = false;
    const loadScreen4AssetVariants = () => {
      if (disposed || screen4AssetLoadStarted || assetVariants.screen4Fruit || assetVariants.screen4Electrolytes) return;
      screen4AssetLoadStarted = true;

      loader.load(
        '/blender-files/screens/4screen-divided-by-two.glb',
        (gltf) => {
          if (disposed) return;
          const fruitClone = gltf.scene.clone(true);
          const electrolytesClone = gltf.scene.clone(true);
          const fruitVariant = prepareClone(fruitClone, 3.6, { normalizeAfterScale: true });
          const electrolytesVariant = prepareClone(electrolytesClone, 3.6, { normalizeAfterScale: true });
          applyStaticClipPose(electrolytesVariant, gltf.animations, 1);
          recenterVariantToVisibleBounds(electrolytesVariant);
          assetVariants.screen4Fruit = wrapVariantWithStablePivot(fruitVariant);
          assetVariants.screen4Electrolytes = wrapVariantWithStablePivot(electrolytesVariant);
          bindClipsToScroll(assetVariants.screen4Fruit, gltf.animations);
          scheduleWarmVariant(assetVariants.screen4Fruit, 620);
          scheduleWarmVariant(assetVariants.screen4Electrolytes, 700);
        },
        undefined,
        () => {
          screen4AssetLoadStarted = false;
          assetVariants.screen4Fruit = undefined;
          assetVariants.screen4Electrolytes = undefined;
        }
      );
    };

    const loadDeferredAssetVariants = () => {
      if (disposed) return;

      loader.load(
        '/blender-files/screens/3screen-on-desk-three.glb',
        (gltf) => {
          if (disposed) return;
          const clone = gltf.scene.clone(true);
          const lineupOffsets = [
            { match: /aluminium_can_250_ml005|250 ml\.005/i, x: 0 , y: 0, z: -0.01 },
            { match: /aluminium_can_250_ml006|250 ml\.006/i, x: -0.005, y: 0, z: 0.03 },
            { match: /aluminium_can_250_ml007|250 ml\.007/i, x: 0.005, y: 0, z: 0.03 },
          ];
          clone.traverse((child) => {
            if (/Cylinder\.006|Cylinder\.013/i.test(child.name)) {
              child.userData.lineupRole = 'lineup-platform';
            } else if (/aluminium can 250 ml\.005|250 ml\.005/i.test(child.name)) {
              child.userData.lineupRole = 'lineup-focus';
            } else if (/aluminium can 250 ml\.006|aluminium can 250 ml\.007|250 ml\.006|250 ml\.007/i.test(child.name)) {
              child.userData.lineupRole = 'lineup-side';
            }

            const offset = lineupOffsets.find(({ match }) => match.test(child.name));
            if (offset) {
              child.userData.lineupOffset = offset;
            }
          });
          assetVariants.screen3Desk = prepareClone(clone, 3.7);
          bindClipsToScroll(assetVariants.screen3Desk, gltf.animations);
          scheduleWarmVariant(assetVariants.screen3Desk, 520);
        },
        undefined,
        () => {
          assetVariants.screen3Desk = undefined;
        }
      );

      loadScreen4AssetVariants();
    };

    function scheduleDeferredAssetLoads() {
      if (disposed || deferredAssetLoadsScheduled) return;
      deferredAssetLoadsScheduled = true;

      const run = () => {
        if (disposed) return;
        if ('requestIdleCallback' in window) {
          const handle = {
            type: 'idle',
            id: window.requestIdleCallback(loadDeferredAssetVariants, { timeout: 2200 }),
          };
          warmupHandles.add(handle);
        } else {
          loadDeferredAssetVariants();
        }
      };

      const handle = {
        type: 'timeout',
        id: window.setTimeout(run, DEFERRED_ASSET_LOAD_DELAY_MS),
      };
      warmupHandles.add(handle);
    }

    const warmCriticalVariants = (variants) => {
      const pending = variants.filter(Boolean);
      let index = 0;

      const scheduleNext = (delay = 0) => {
        if (disposed) return;
        if (index >= pending.length) {
          notifyCriticalAssetsReady();
          return;
        }

        let handle;
        handle = {
          type: 'timeout',
          id: window.setTimeout(() => {
            warmupHandles.delete(handle);
            if (disposed) return;

            window.requestAnimationFrame(() => {
              if (disposed) return;
              warmVariant(pending[index]);
              index += 1;
              scheduleNext(CRITICAL_WARMUP_STAGGER_MS);
            });
          }, delay),
        };
        warmupHandles.add(handle);
      };

      scheduleNext();
    };

    loader.load(
      '/blender-files/screens/1screen-another-variant.glb',
      (gltf) => {
        const createVerticalVariant = (flavorIndex, materialProfile) => {
          const clone = gltf.scene.clone(true);
          const removableMeshes = [];

          clone.traverse((child) => {
            if (!child.isMesh || !child.material) return;
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            if (getFlavorIndex(child, materials) !== flavorIndex) {
              removableMeshes.push(child);
            }
          });
          removableMeshes.forEach((child) => child.parent?.remove(child));

          return prepareClone(clone, 3.35, { materialProfile, forceFlavorBaseOpacity: true });
        };

        assetVariants.screen2VerticalBlue = createVerticalVariant(0, SCREEN2_VERTICAL_MATERIALS.blue);
        assetVariants.screen2VerticalOrange = createVerticalVariant(1, SCREEN2_VERTICAL_MATERIALS.orange);
        assetVariants.screen2VerticalGreen = createVerticalVariant(2, SCREEN2_VERTICAL_MATERIALS.green);

        const animatedClone = gltf.scene.clone(true);
        assetVariants.screen2AnimatedStack = prepareClone(animatedClone, 3.35, {
          materialProfile: SCREEN2_TILTED_MATERIALS,
          flavorDriven: true,
        });
        bindClipsToScroll(assetVariants.screen2AnimatedStack, gltf.animations);

        warmCriticalVariants([
          assetVariants.screen2VerticalBlue,
          assetVariants.screen2AnimatedStack,
        ]);
        scheduleWarmVariant(assetVariants.screen2VerticalOrange, 260);
        scheduleWarmVariant(assetVariants.screen2VerticalGreen, 360);
      },
      undefined,
      () => {
        assetVariants.screen2VerticalBlue = undefined;
        assetVariants.screen2VerticalOrange = undefined;
        assetVariants.screen2VerticalGreen = undefined;
        assetVariants.screen2AnimatedStack = undefined;
        notifyCriticalAssetsReady();
      }
    );

    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const key = new THREE.DirectionalLight(0xffffff, 2.45);
    key.position.set(3.4, 4.8, 4.6);
    scene.add(key);
    const frontGloss = new THREE.SpotLight(0xffffff, 30, 14, Math.PI / 6, 0.42, 1.25);
    frontGloss.position.set(-2.6, 1.2, 5.8);
    frontGloss.target.position.set(0.35, -0.2, 0);
    scene.add(frontGloss);
    scene.add(frontGloss.target);
    const coolRim = new THREE.DirectionalLight(0x9ff7ff, 1.8);
    coolRim.position.set(-4.2, -0.6, 3.2);
    scene.add(coolRim);
    // The two coloured PointLights were dropped: their subtle bottom glow is largely
    // carried by the environment map, but they added real per-fragment cost (distance
    // attenuation x full-screen) that hurt FPS during scroll transitions. The brand tint
    // is folded into the cool rim instead.
    coolRim.color.setHex(0x6fdcff);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    // Switch render resolution only on mode change (hysteresis) — never every frame —
    // so a scroll gesture costs at most two framebuffer reallocations.
    const setRenderScale = (ratio) => {
      if (activeRatio === ratio) return;
      activeRatio = ratio;
      renderer.setPixelRatio(ratio);
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    resize();
    window.addEventListener('resize', resize);

    const clock = new THREE.Clock();
    const visualLockBox = new THREE.Box3();
    const visualLockCenter = new THREE.Vector3();
    let raf = 0;
    let wasShowingModel = false;
    // Render-on-demand bookkeeping: the scene is only redrawn while something is actually
    // moving (scrolling, settling after a scroll, an entry/auto-play animation). When idle
    // it stops drawing entirely — 0 GPU/CPU, no heat, no "everything lags" feeling.
    let lastRenderTarget = null;
    let dirtyUntil = 0;
    const RENDER_SETTLE_MS = 900; // keep drawing this long after the last change so the
    // position/clip easing finishes and the final idle frame is crisp.
    const entryMotionState = {
      id: null,
      startedAt: 0,
      justStarted: false,
    };

    const applyVariantTransform = (variant, state, elapsed, immediate = false) => {
      const viewportScale = mount.clientWidth < 620 ? 0.92 : 1;
      const basePosition = variant.userData.basePosition || new THREE.Vector3();
      const baseScale = variant.userData.baseScale || new THREE.Vector3(1, 1, 1);
      const baseRotation = variant.userData.baseRotation || new THREE.Euler();
      const lockViewportPosition = state.lockViewportPosition || state.asset === 'lastScreen';
      const visualCenterLockStrength = state.asset === 'lastScreen'
        ? 1
        : clamp(state.visualCenterLockStrength ?? (state.lockVisualCenter ? 1 : 0), 0, 1);
      // No idle "breathing": the can holds a steady scale; it only changes when the
      // scroll drives state.scale. (Removed the per-frame sine pulse that made the can
      // drift on its own — the client's "банки прыгают просто так".)
      const liveScale = state.scale * viewportScale;
      // Last-screen can travels with the page as you scroll within the access frame.
      // Computed live from window.scrollY (not React state) so there is no lag/snap.
      let scrollFollowY = 0;
      if (state.asset === 'lastScreen') {
        const accessEl = document.getElementById('access');
        if (accessEl) {
          const accessTop = accessEl.getBoundingClientRect().top + window.scrollY;
          const scrollWithin = Math.max(window.scrollY - accessTop, 0);
          scrollFollowY = scrollWithin * 0.0063; // ~viewport-world-height / viewport-px
        }
      }
      const targetPosition = new THREE.Vector3(
        basePosition.x + state.x,
        basePosition.y + state.y + scrollFollowY,
        basePosition.z + (state.z ?? 0)
      );
      const targetScale = new THREE.Vector3(
        baseScale.x * liveScale,
        baseScale.y * liveScale,
        baseScale.z * liveScale
      );
      const targetRotationX = baseRotation.x + (state.pitch ?? 0);
      // spin defaults to 0 (no continuous self-rotation) and the float-tilt sine is gone,
      // so the can is fully still unless the scroll moves it.
      const targetRotationY = baseRotation.y + (state.rotate ?? 0) + elapsed * (state.spin ?? 0);
      const targetRotationZ = baseRotation.z + (state.tilt ?? 0);

      if (lockViewportPosition) {
        variant.position.copy(targetPosition);
        variant.scale.copy(targetScale);
        variant.rotation.set(targetRotationX, targetRotationY, targetRotationZ);
        variant.userData.renderInitialized = true;
      } else if (immediate || !variant.userData.renderInitialized) {
        variant.position.copy(targetPosition);
        variant.scale.copy(targetScale);
        variant.rotation.set(targetRotationX, targetRotationY, targetRotationZ);
        variant.userData.renderInitialized = true;
      } else {
        variant.position.lerp(targetPosition, 0.08);
        variant.scale.lerp(targetScale, 0.08);
        variant.rotation.x = lerp(variant.rotation.x, targetRotationX, 0.07);
        variant.rotation.y = lerp(variant.rotation.y, targetRotationY, 0.07);
        variant.rotation.z = lerp(variant.rotation.z, targetRotationZ, 0.07);
      }

      if (visualCenterLockStrength > 0 && lockViewportPosition) {
        variant.updateMatrixWorld(true);
        visualLockBox.setFromObject(variant);
        visualLockBox.getCenter(visualLockCenter);
        variant.position.x += (targetPosition.x - visualLockCenter.x) * visualCenterLockStrength;
        variant.position.y += (targetPosition.y - visualLockCenter.y) * visualCenterLockStrength;
        variant.position.z += (targetPosition.z - visualLockCenter.z) * visualCenterLockStrength;
        variant.updateMatrixWorld(true);
      } else if (visualCenterLockStrength > 0) {
        variant.updateMatrixWorld(true);
        visualLockBox.setFromObject(variant);
        visualLockBox.getCenter(visualLockCenter);
        variant.position.x += (targetPosition.x - visualLockCenter.x) * visualCenterLockStrength;
        variant.position.y += (targetPosition.y - visualLockCenter.y) * visualCenterLockStrength;
        variant.position.z += (targetPosition.z - visualLockCenter.z) * visualCenterLockStrength;
        variant.updateMatrixWorld(true);
      }

    };

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.033);
      const elapsed = clock.elapsedTime;
      let target = modelStateRef.current;

      // Drop to low render resolution while actively scrolling, restore full res
      // ~0.22s after the last scroll event so the settled frame is crisp. Event-driven
      // (scrollActivityRef is stamped by the scroll handler) so it can't flap at low fps.
      const sinceScroll = performance.now() - (scrollActivityRef?.current ?? 0);
      setRenderScale(sinceScroll < 220 ? LOW_RATIO : HIGH_RATIO);

      const entryMotion = target.entryMotion;
      if (entryMotion) {
        const motionId = entryMotion.id || `${target.asset || target.scene}-entry`;
        if (entryMotionState.id !== motionId) {
          entryMotionState.id = motionId;
          entryMotionState.startedAt = elapsed;
          entryMotionState.justStarted = true;
        }

        const entryProgress = smoothstep(
          0,
          1,
          clamp((elapsed - entryMotionState.startedAt) / Math.max(entryMotion.duration ?? 0.9, 0.001), 0, 1)
        );
        if (entryProgress < 1) {
          const from = entryMotion.from || {};
          target = {
            ...target,
            x: lerp(from.x ?? target.x, target.x, entryProgress),
            y: lerp(from.y ?? target.y, target.y, entryProgress),
            z: lerp(from.z ?? target.z, target.z, entryProgress),
            scale: lerp(from.scale ?? target.scale, target.scale, entryProgress),
            rotate: lerp(from.rotate ?? target.rotate ?? 0, target.rotate ?? 0, entryProgress),
            tilt: lerp(from.tilt ?? target.tilt ?? 0, target.tilt ?? 0, entryProgress),
            pitch: lerp(from.pitch ?? target.pitch ?? 0, target.pitch ?? 0, entryProgress),
            clipProgress: lerp(from.clipProgress ?? target.clipProgress ?? 0, target.clipProgress ?? 0, entryProgress),
            opacity: lerp(from.opacity ?? target.opacity, target.opacity, entryProgress),
          };
        }
      } else {
        entryMotionState.id = null;
        entryMotionState.justStarted = false;
      }

      // --- render-on-demand gate ---
      // Mark the scene dirty whenever the scroll-driven state object changes identity
      // (useScrollModelState hands a fresh object every scroll frame) or an animation is
      // live, then keep drawing for a short settle window so easings finish cleanly.
      const nowMs = performance.now();
      if (target !== lastRenderTarget) {
        lastRenderTarget = target;
        dirtyUntil = nowMs + RENDER_SETTLE_MS;
      }
      const scrolling = nowMs - (scrollActivityRef?.current ?? 0) < RENDER_SETTLE_MS;
      const continuousAnim = !!target.clipAutoplay || !!target.entryMotion;
      if (!scrolling && !continuousAnim && nowMs >= dirtyUntil) {
        // Idle: hold the last drawn frame, draw nothing.
        raf = requestAnimationFrame(animate);
        return;
      }

      if (
        target.asset === 'screen4Fruit'
        || target.asset === 'screen4Electrolytes'
        || target.fromAsset === 'screen4Fruit'
        || target.fromAsset === 'screen4Electrolytes'
        || target.toAsset === 'screen4Fruit'
        || target.toAsset === 'screen4Electrolytes'
      ) {
        loadScreen4AssetVariants();
      }

      const assetBlend = clamp(target.assetBlend ?? 1, 0, 1);
      const fromVariant = resolveVariant(target.fromAsset ?? target.asset, target.fromScene ?? target.scene);
      const toVariant = resolveVariant(target.toAsset ?? target.asset, target.toScene ?? target.scene);
      const wantedVariant = resolveVariant(target.asset, target.scene);
      const visibleModels = [];

      if (fromVariant && toVariant && fromVariant !== toVariant && assetBlend < 0.999) {
        const fromOpacity = target.opacity * (1 - assetBlend);
        const toOpacity = target.opacity * assetBlend;

        if (fromOpacity > 0.001) visibleModels.push({ variant: fromVariant, opacity: fromOpacity, state: target });
        if (toOpacity > 0.001) visibleModels.push({ variant: toVariant, opacity: toOpacity, state: target });
      } else if (wantedVariant && target.opacity > 0.001) {
        visibleModels.push({ variant: wantedVariant, opacity: target.opacity, state: target });
      }

      (target.secondaryModels || []).forEach((secondaryState) => {
        const secondaryVariant = resolveVariant(secondaryState.asset, secondaryState.scene);
        const secondaryOpacity = secondaryState.opacity ?? target.opacity ?? 1;
        if (secondaryVariant && secondaryOpacity > 0.001 && !visibleModels.some((model) => model.variant === secondaryVariant)) {
          visibleModels.push({ variant: secondaryVariant, opacity: secondaryOpacity, state: secondaryState });
        }
      });

      const visibleSet = new Set(visibleModels.map((model) => model.variant));
      const shouldShowModel = visibleModels.length > 0;
      modelWrap.visible = shouldShowModel;
      modelWrap.position.set(0, 0, 0);
      modelWrap.scale.setScalar(1);
      modelWrap.rotation.set(0, 0, 0);

      if (!shouldShowModel) {
        wasShowingModel = false;
        activeVariants.forEach((variant) => {
          variant.visible = false;
          variant.userData.renderInitialized = false;
        });
        activeVariants = new Set();
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
        return;
      }

      activeVariants.forEach((variant) => {
        if (!visibleSet.has(variant)) {
          variant.visible = false;
          variant.userData.renderInitialized = false;
        }
      });
      visibleModels.forEach(({ variant, opacity, state }) => {
        variant.visible = true;
        applyBoundAnimation(variant, state, delta, elapsed);
        applyVariantOpacity(variant, opacity, state);
        applyVariantTransform(variant, state, elapsed, entryMotionState.justStarted || !wasShowingModel || !activeVariants.has(variant));
      });
      activeVariants = visibleSet;
      entryMotionState.justStarted = false;

      renderer.render(scene, camera);
      wasShowingModel = true;
      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      warmupHandles.forEach((handle) => {
        if (handle.type === 'idle' && 'cancelIdleCallback' in window) {
          window.cancelIdleCallback(handle.id);
        } else {
          window.clearTimeout(handle.id);
        }
      });
      window.removeEventListener('resize', resize);
      environmentTexture.dispose();
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

  return <div className={`scene ${hidden ? 'scene-hidden' : ''}`} ref={mountRef} aria-label="ATHORA 3D product model" />;
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

function ChromeDots({ homeHref = '#intro', onHomeClick }) {
  const socials = [
    { label: 'Instagram', icon: '/figma-nav/social-instagram.svg' },
    { label: 'X', icon: '/figma-nav/social-x.svg' },
    { label: 'TikTok', icon: '/figma-nav/social-tiktok.svg' },
  ];

  return (
    <div className="chrome-dots" aria-label="Social links">
      {socials.map((item) => (
        <a className="social-button" href={homeHref} aria-label={item.label} key={item.label} onClick={onHomeClick}>
          <img src={item.icon} alt="" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

function AthoraLogo({
  large = false,
  className = '',
  asImage = false,
  wordmarkSrc = '/figma-lineup/athora-access-vector-wordmark.svg',
}) {
  return (
    <div className={`${large ? 'athora-logo athora-logo-large' : 'athora-logo'} ${className}`.trim()} aria-label="ATHORA">
      {asImage ? (
        <img
          className="athora-logo-wordmark"
          src={wordmarkSrc}
          alt="ATHORA"
        />
      ) : (
        <span className="athora-logo-text">ATHORA</span>
      )}
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
        <path d={NAV_FRAME_PATH} fill="#1D1D1D" fillOpacity="0.08" style={{ mixBlendMode: 'plus-lighter' }} />
        <path d={NAV_FRAME_PATH} fill="#1D1D1D" fillOpacity="0.035" style={{ mixBlendMode: 'color-burn' }} />
        <path d={NAV_FRAME_PATH} fill="url(#nav-frame-bottom)" fillOpacity="0.16" style={{ mixBlendMode: 'plus-lighter' }} />
        <path d={NAV_FRAME_PATH} fill="url(#nav-frame-top)" fillOpacity="0.065" style={{ mixBlendMode: 'plus-lighter' }} />
        <path d={NAV_FRAME_STROKE_PATH} fill="white" fillOpacity="0.025" mask="url(#nav-frame-mask)" />
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
          <feBlend mode="screen" in2="shape" result="effect1_innerShadow" />
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
        <img className="figma-bg-berry" src="/figma-hero/berry-right.png" alt="" />
      </div>
    </div>
  );
}

function FixedHeroSequenceBackground({ visible }) {
  // berry opacity is driven by the inherited --hero-berry-opacity CSS variable,
  // written straight to the .app element each scroll frame (no React re-render).
  const className = ['hero-sequence-bg', visible ? 'hero-sequence-bg-visible' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className} aria-hidden="true">
      <FigmaHeroBackground />
    </div>
  );
}

function FixedSystemsBackground({ visible }) {
  return <div className={`systems-fixed-bg ${visible ? 'systems-fixed-bg-visible' : ''}`} aria-hidden="true" />;
}

function FixedDetailMorphBackground({ visible }) {
  return <div className={`detail-morph-bg ${visible ? 'detail-morph-bg-visible' : ''}`} aria-hidden="true" />;
}

function skipLongScrollToSection(event, sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  event?.preventDefault();

  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  const previousSnapType = root.style.scrollSnapType;
  const targetTop = window.scrollY + target.getBoundingClientRect().top;
  const currentTop = window.scrollY;
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
  const distance = targetTop - currentTop;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.location.hash !== `#${sectionId}`) {
    window.history.pushState(null, '', `#${sectionId}`);
  }

  root.style.scrollBehavior = 'auto';
  root.style.scrollSnapType = 'none';

  if (Math.abs(distance) > window.innerHeight * 1.35 && !prefersReducedMotion) {
    const stagingOffset = Math.min(window.innerHeight * 0.42, 380);
    const stagingTop = clamp(
      targetTop + (distance < 0 ? stagingOffset : -stagingOffset),
      0,
      maxScroll
    );

    window.scrollTo({ top: stagingTop, left: 0, behavior: 'auto' });
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        root.style.scrollBehavior = previousScrollBehavior;
        window.scrollTo({ top: targetTop, left: 0, behavior: 'smooth' });
      });
    });
  } else {
    window.scrollTo({ top: targetTop, left: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  window.setTimeout(() => {
    root.style.scrollBehavior = previousScrollBehavior;
    root.style.scrollSnapType = previousSnapType;
  }, prefersReducedMotion ? 80 : 720);
}

function Navigation({ activeIndex = 0, showNav, preloaderLocked, legal = false }) {
  const homeHref = legal ? '/' : preloaderLocked ? '#intro' : '#installing';
  const productHref = legal ? '/#all-systems' : '#all-systems';
  const systemHref = legal ? '/#simplicity' : '#simplicity';
  const accessHref = legal ? '/#access' : '#access';
  const handleHomeClick = !legal && preloaderLocked
    ? (event) => skipLongScrollToSection(event, 'intro')
    : undefined;

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
      <div className="nav-liquid-field" aria-hidden="true" />
      <NavFrameGlass />
      <ChromeDots homeHref={homeHref} onHomeClick={handleHomeClick} />
      <a className="nav-mark" href={homeHref} aria-label="ATHORA home" onClick={handleHomeClick}>
        {/*
        <img src="/figma-nav/nav-union.svg" alt="" aria-hidden="true" />
        */}
        <img src="/figma-nav/Union.svg" alt="" aria-hidden="true" />
      </a>
      <nav aria-label="Primary navigation">
        <a href={productHref}>Product</a>
        <a href={systemHref}>System</a>
        <a className="nav-pill" href={accessHref}>Get access</a>
      </nav>
      {!legal ? (
        <div className="section-count" aria-label={`Section ${activeIndex + 1} of ${sections.length}`}>
          {String(activeIndex + 1).padStart(2, '0')} / {sections.length}
        </div>
      ) : null}
    </header>
  );
}

function InstallSection({ section, onIntroReveal, criticalAssetsReady = false }) {
  const [isComplete, setIsComplete] = useState(false);
  const meterRef = useRef(null);
  const progressLabelRef = useRef(null);
  const videoRef = useRef(null);
  const criticalAssetsReadyRef = useRef(criticalAssetsReady);

  useEffect(() => {
    criticalAssetsReadyRef.current = criticalAssetsReady;
  }, [criticalAssetsReady]);

  useEffect(() => {
    let raf = 0;
    const startedAt = performance.now();
    let lastLabelProgress = -1;
    let completed = false;
    let renderedProgress = 0;
    let finishStartedAt = 0;
    let finishStartProgress = 0;

    const renderProgress = (progressValue, useCssMotion = true) => {
      const safeProgress = clamp(progressValue, 0, 1);
      const progressPercent = safeProgress * 100;
      const nextLabelProgress = Math.round(progressPercent);
      const meter = meterRef.current;
      const label = progressLabelRef.current;

      if (meter) {
        meter.classList.toggle('install-meter-css-progress', useCssMotion);
        meter.style.setProperty('--progress-ratio', safeProgress.toFixed(5));
        meter.setAttribute('aria-label', `Installation progress ${nextLabelProgress} percent`);
      }

      if (label) {
        const meterWidth = meter?.clientWidth || 0;
        const labelWidth = label.offsetWidth || 76;
        const travel = Math.max(meterWidth - labelWidth, 0);

        label.style.transform = useCssMotion
          ? 'translate3d(0, -50%, 0)'
          : `translate3d(${(travel * safeProgress).toFixed(2)}px, -50%, 0)`;

        if (nextLabelProgress !== lastLabelProgress) {
          label.textContent = `${nextLabelProgress}%`;
          lastLabelProgress = nextLabelProgress;
        }
      }
    };

    const tick = (now) => {
      const elapsed = now - startedAt;
      const timeProgress = clamp(elapsed / PRELOADER_DURATION_MS, 0, 1);
      const canFinish = criticalAssetsReadyRef.current || elapsed >= PRELOADER_FORCE_COMPLETE_MS;
      let progressValue = timeProgress;

      if (timeProgress >= 1 && canFinish) {
        if (!finishStartedAt) {
          finishStartedAt = now;
          finishStartProgress = renderedProgress;
        }
        const finishProgress = smoothstep(
          0,
          1,
          clamp((now - finishStartedAt) / PRELOADER_ASSET_FINISH_MS, 0, 1)
        );
        progressValue = lerp(finishStartProgress, 1, finishProgress);
      } else if (!canFinish) {
        progressValue = Math.min(timeProgress, PRELOADER_ASSET_WAIT_PROGRESS);
      }

      renderedProgress = Math.max(renderedProgress, progressValue);
      renderProgress(renderedProgress, !finishStartedAt);

      if (renderedProgress >= 0.9995 && !completed) {
        completed = true;
        renderProgress(1, false);
        setIsComplete(true);
      }

      if (!completed) {
        raf = requestAnimationFrame(tick);
      }
    };

    renderProgress(0, true);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!isComplete) return undefined;

    const video = videoRef.current;
    if (video) {
      const lastFrameTime = Number.isFinite(video.duration) && video.duration > 0 ? Math.max(video.duration - 0.04, 0) : null;
      if (lastFrameTime !== null) {
        video.currentTime = lastFrameTime;
      }
      video.pause();
    }

    const timer = window.setTimeout(() => {
      onIntroReveal?.();
    }, PRELOADER_COMPLETE_HOLD_MS);

    return () => window.clearTimeout(timer);
  }, [isComplete, onIntroReveal]);

  return (
    <section className={`panel install-panel ${SECTION_THEMES[section.theme].className}`} id={section.id}>
      <video
        ref={videoRef}
        className="install-video"
        src="/blender-files/screens/preloader.webm"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <AthoraLogo large asImage wordmarkSrc="/figma-lineup/athora-preloader-wordmark.svg" />
      <div
        ref={meterRef}
        className="install-meter install-meter-css-progress"
        aria-label="Installation progress 0 percent"
        style={{ '--progress-ratio': '0' }}
      >
        <div className="install-fill" />
        <strong ref={progressLabelRef}>0%</strong>
      </div>
      <p className="install-copy">{section.subcopy}</p>
    </section>
  );
}

function PreloaderTransitionOverlay({ phase }) {
  if (phase === 'idle' || phase === 'done') return null;

  return (
    <div className={`intro-reveal-overlay intro-reveal-overlay-${phase}`} aria-hidden="true">
      <div className="intro-reveal-ui">
        <AthoraLogo large asImage wordmarkSrc="/figma-lineup/athora-preloader-wordmark.svg" />
        <div className="install-meter install-meter-complete" aria-label="Installation progress 100 percent" style={{ '--progress-ratio': '1' }}>
          <div className="install-fill" />
          <strong>100%</strong>
        </div>
        <p className="install-copy">Installing...</p>
      </div>
    </div>
  );
}

function IntroSection({ section, isActive }) {
  return (
    <section
      className={`panel intro-panel ${isActive ? 'intro-berries-active' : ''} ${SECTION_THEMES[section.theme].className}`}
      id={section.id}
    >
      <div className="intro-berry-field" aria-hidden="true">
        <span className="intro-berry-shadow intro-berry-shadow-main" />
        <span className="intro-berry-shadow intro-berry-shadow-left" />
        <img className="intro-berry intro-berry-left" src="/figma-hero/image-3.svg" alt="" />
        <img className="intro-berry intro-berry-center" src="/figma-hero/berry-center.svg" alt="" />
      </div>
      {/*
      <div className="intro-controls" aria-hidden="true">
        <button className="glass-arrow glass-arrow-left" type="button" tabIndex="-1">
          <span />
        </button>
        <button className="glass-arrow glass-arrow-right" type="button" tabIndex="-1">
          <span />
        </button>
      </div>
      */}
    </section>
  );
}

function SystemsSection({ section }) {
  const isFigmaSystems = Boolean(section.figmaVariant);
  const isWordStepScroll = Boolean(section.wordStepScroll && section.items.length > 1);
  const wordStepCount = clamp(section.wordStepCount || section.items.length, 1, section.items.length);
  const stackRef = useRef(null);
  const rawWordProgress = usePinnedStackProgress(stackRef, isWordStepScroll ? wordStepCount : 1);
  const activeWordIndex = clamp(Math.round(rawWordProgress), 0, section.items.length - 1);
  const renderSystemsCopy = (animated = false) => (
    <div className="systems-copy">
      <p className="pretitle">{section.pretitle}</p>
      <div className="systems-list">
        {section.items.map((item, index) => {
          const distance = animated ? index - activeWordIndex : index;
          const trailingDistance = Math.max(distance, 0);
          const opacity = animated
            ? distance < -0.08
              ? clamp(1 + distance * 1.7, 0, 1)
              : clamp(1 - trailingDistance * 0.41, 0, 1)
            : undefined;
          const blur = animated
            ? distance < 0
              ? Math.min(Math.abs(distance) * 1.6, 3.2)
              : Math.min(trailingDistance * 2.2, 4.4)
            : undefined;
          const colorAlpha = animated ? clamp(1 - Math.abs(distance) * 0.6, 0.4, 1) : undefined;
          const isActiveWord = animated && Math.abs(distance) < 0.12;

          return (
            <h2
              className={isFigmaSystems ? `systems-word systems-word-${index}` : ''}
              key={item}
              style={
                animated
                  ? {
                      opacity,
                      color: `rgba(255, 255, 255, ${colorAlpha})`,
                      filter: blur > 0 ? `blur(${blur}px)` : 'none',
                      textShadow: 'none',
                      transform: `translate3d(0, ${distance * 1.11}em, 0)`,
                    }
                  : undefined
              }
            >
              {item}
            </h2>
          );
        })}
      </div>
    </div>
  );

  if (isWordStepScroll) {
    return (
      <section
        className={`panel systems-panel systems-panel-step-scroll systems-panel-figma systems-panel-figma-${section.figmaVariant} ${SECTION_THEMES[section.theme].className}`}
        id={section.id}
        ref={stackRef}
        style={{ '--systems-step-height': `${wordStepCount * 100}vh` }}
      >
        {section.items.slice(0, wordStepCount).map((item, index) => (
          <span
            aria-hidden="true"
            className="systems-step-snap"
            key={`systems-step-${item}`}
            style={{ top: `${index * 100}vh` }}
          />
        ))}
        <div className="systems-step-stage">
          {renderSystemsCopy(true)}
          <ScrollDown />
        </div>
      </section>
    );
  }

  return (
    <section
      className={`panel systems-panel ${
        isFigmaSystems ? `systems-panel-figma systems-panel-figma-${section.figmaVariant}` : ''
      } ${SECTION_THEMES[section.theme].className}`}
      id={section.id}
    >
      {renderSystemsCopy(false)}
      {isFigmaSystems && section.figmaCan && (
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
  const hasStickyMotion = Boolean(section.modelClipScroll || section.scrollScrub);
  const desktopLines = section.headlineLines || [section.headline];
  const mobileLines = section.mobileHeadlineLines || desktopLines;
  const hasMobileLines = Boolean(section.mobileHeadlineLines);
  const content = (
    <>
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
      {section.figmaClaim === 'open-can' ? (
        <p className="open-label" aria-hidden="true">
          <span className="open-letter open-letter-o">O</span>
          <span className="open-letter open-letter-p">P</span>
          <span className="open-letter open-letter-e">E</span>
          <span className="open-letter open-letter-n">N</span>
        </p>
      ) : (
        <ScrollDown />
      )}
    </>
  );

  return (
    <section
      className={`panel claim-panel ${hasStickyMotion ? 'claim-panel-sticky-motion' : ''} ${
        isFigmaClaim ? `figma-claim-panel figma-claim-${section.figmaClaim}` : ''
      } ${
        SECTION_THEMES[section.theme].className
      }`}
      id={section.id}
    >
      {hasStickyMotion ? <div className="claim-motion-stage">{content}</div> : content}
    </section>
  );
}

function usePinnedStackProgress(sectionRef, itemCount, scrollSegments = null) {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(-1);

  useEffect(() => {
    if (itemCount <= 1) return undefined;

    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;

        const sectionTop = window.scrollY + section.getBoundingClientRect().top;
        // When scrollSegments is given, map progress over just that many viewports
        // (so extra tail height added for an exit animation does not slow the words).
        const scrollRange = Math.max(
          scrollSegments != null ? scrollSegments * window.innerHeight : section.offsetHeight - window.innerHeight,
          1
        );
        const rawProgress = clamp((window.scrollY - sectionTop) / scrollRange, 0, 1) * (itemCount - 1);
        const nextProgress = Math.round(rawProgress * 1000) / 1000;

        if (Math.abs(nextProgress - progressRef.current) > 0.002) {
          progressRef.current = nextProgress;
          setProgress(nextProgress);
        }
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [itemCount, sectionRef, scrollSegments]);

  return progress;
}

function useSmoothedProgress(targetProgress, durationMs = 900, easing = 'easeInOut') {
  const [progress, setProgress] = useState(targetProgress);
  const progressRef = useRef(targetProgress);
  const frameRef = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(frameRef.current);

    const start = progressRef.current;
    const delta = targetProgress - start;
    if (Math.abs(delta) < 0.001) {
      progressRef.current = targetProgress;
      setProgress(targetProgress);
      return undefined;
    }

    const startedAt = window.performance.now();
    const duration = Math.max(180, durationMs * Math.min(Math.abs(delta), 1));

    const tick = (now) => {
      const linearProgress = clamp((now - startedAt) / duration, 0, 1);
      const easedProgress =
        easing === 'linear'
          ? linearProgress
          : linearProgress < 0.5
          ? 4 * linearProgress * linearProgress * linearProgress
          : 1 - Math.pow(-2 * linearProgress + 2, 3) / 2;
      const nextProgress = start + delta * easedProgress;

      progressRef.current = nextProgress;
      setProgress(nextProgress);

      if (linearProgress < 1) {
        frameRef.current = window.requestAnimationFrame(tick);
      }
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [durationMs, easing, targetProgress]);

  return progress;
}

function ClaimStackSection({ section }) {
  const stackRef = useRef(null);
  const claims = section.claims || [];
  const progress = usePinnedStackProgress(stackRef, claims.length);
  const animatedProgress = useSmoothedProgress(progress, 520, 'linear');

  return (
    <section
      className={`panel claim-stack-panel figma-claim-panel figma-claim-stack ${SECTION_THEMES[section.theme].className}`}
      id={section.id}
      ref={stackRef}
      style={{ '--claim-count': claims.length, '--claim-stack-height': `${claims.length * 100}vh` }}
    >
      {claims.map((claim, index) => (
        <span
          aria-hidden="true"
          className="claim-stack-snap"
          id={index === 0 ? undefined : claim.id}
          key={`snap-${claim.id}`}
          style={{ top: `${index * 100}vh` }}
        />
      ))}
      <div className="claim-stack-stage">
        <div className="claim-stack-copy">
          {claims.map((claim, index) => {
            const desktopLines = claim.headlineLines || [claim.headline];
            const mobileLines = claim.mobileHeadlineLines || desktopLines;
            const hasMobileLines = Boolean(claim.mobileHeadlineLines);
            const distance = index - animatedProgress;
            const absDistance = Math.abs(distance);
            const opacity = clamp(1 - absDistance * 1.65, 0, 1);
            const translateY = distance * 48;
            const blur = Math.min(absDistance * 6, 8);

            return (
              <h2
                aria-hidden={opacity < 0.05 ? true : undefined}
                className={`claim-stack-heading ${hasMobileLines ? 'has-mobile-lines' : ''}`}
                key={claim.id}
                style={{
                  opacity,
                  filter: `blur(${blur}px)`,
                  transform: `translate3d(-50%, calc(-50% + ${translateY}px), 0)`,
                }}
              >
                <span className="claim-line-set claim-line-set-desktop">
                  {desktopLines.map((line) => (
                    <span key={`desktop-${claim.id}-${line}`}>{line}</span>
                  ))}
                </span>
                {hasMobileLines ? (
                  <span className="claim-line-set claim-line-set-mobile" aria-hidden="true">
                    {mobileLines.map((line) => (
                      <span key={`mobile-${claim.id}-${line}`}>{line}</span>
                    ))}
                  </span>
                ) : null}
              </h2>
            );
          })}
        </div>
        <ScrollDown />
      </div>
    </section>
  );
}

function ProductLineupSection({ section }) {
  const isScrollScrub = Boolean(section.scrollScrub);
  const content = (
    <>
      <img
        className="lineup-brand-wordmark lineup-brand-vector"
        src="/figma-lineup/athora-vector-wordmark.svg"
        alt="ATHORA"
        draggable="false"
      />
      <ScrollDown />
    </>
  );

  return (
    <section
      className={`panel lineup-panel figma-lineup-panel ${
        isScrollScrub ? 'lineup-panel-scroll-scrub' : ''
      } ${SECTION_THEMES[section.theme].className}`}
      id={section.id}
      style={isScrollScrub ? { '--lineup-scroll-scrub-height': section.scrollScrub.height || '220vh' } : undefined}
    >
      {isScrollScrub ? <div className="lineup-scroll-scrub-stage">{content}</div> : content}
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

function PriceStackSection({ section }) {
  const stackRef = useRef(null);
  const prices = section.prices || [];
  const progress = usePinnedStackProgress(stackRef, prices.length);
  const animatedProgress = useSmoothedProgress(progress, 1250, 'linear');
  const firstPrice = prices[0];
  const finalPrice = prices[prices.length - 1];
  const valueSequence = section.valueSequence || prices.map((price) => price.value);
  const valueProgress = animatedProgress * Math.max(valueSequence.length - 1, 0);
  const labelProgress = animatedProgress;
  const finalValueTighten = smoothstep(valueSequence.length - 2.15, valueSequence.length - 1, valueProgress);

  return (
    <section
      className={`panel price-panel figma-price-panel figma-price-stack ${SECTION_THEMES[section.theme].className}`}
      id={section.id}
      ref={stackRef}
      style={{ '--price-stack-height': `${prices.length * 100}vh` }}
    >
      {prices.map((price, index) => (
        <span
          aria-hidden="true"
          className="price-stack-snap"
          id={index === 0 ? undefined : price.id}
          key={`price-snap-${price.id}`}
          style={{ top: `${index * 100}vh` }}
        />
      ))}
      <div className="price-stack-stage">
        <div className="price-stack-copy">
          <div className="price-stack-pretitles" aria-hidden="true">
            {firstPrice?.pretitle ? (
              <p
                className="price-stack-pretitle"
                style={{
                  opacity: 1 - labelProgress,
                  filter: `blur(${Math.min(labelProgress * 6, 8)}px)`,
                  transform: `translate3d(-50%, calc(-50% + ${labelProgress * -48}px), 0)`,
                }}
              >
                {firstPrice.pretitle}
              </p>
            ) : null}
            {finalPrice?.pretitle ? (
              <p
                className="price-stack-pretitle"
                style={{
                  opacity: labelProgress,
                  filter: `blur(${Math.min((1 - labelProgress) * 6, 8)}px)`,
                  transform: `translate3d(-50%, calc(-50% + ${(1 - labelProgress) * 48}px), 0)`,
                }}
              >
                {finalPrice.pretitle}
              </p>
            ) : null}
          </div>
          <h2
            className="price-stack-heading"
            aria-label={`$${valueSequence[0] || firstPrice?.value || ''} to $${
              valueSequence[valueSequence.length - 1] || finalPrice?.value || ''
            } per day`}
          >
            <span className="price-leading-value" style={{ transform: `translate3d(${finalValueTighten * 0.34}em, 0, 0)` }}>
              <span className="price-currency" aria-hidden="true">
                $
              </span>
              <span className="price-value-window" aria-hidden="true">
              {valueSequence.map((value, index) => {
                const distance = index - valueProgress;
                const absDistance = Math.abs(distance);
                const opacity = clamp(1 - absDistance * 1.6, 0, 1);

                return (
                  <span
                    className="price-value-number"
                    key={`price-value-${value}-${index}`}
                    style={{
                      opacity,
                      filter: `blur(${Math.min(absDistance * 6, 8)}px)`,
                      transform: `translate3d(0, ${distance * 1.18}em, 0)`,
                    }}
                  >
                    {value}
                  </span>
                );
              })}
              </span>
            </span>
            <span className="price-suffix" aria-hidden="true">
              / DAY
              {section.footnote && <sup>{section.footnote}</sup>}
            </span>
          </h2>
        </div>
        <ScrollDown />
      </div>
    </section>
  );
}

function NutritionSection({ section }) {
  const isFruit = section.variant === 'fruit';
  const isScrollScrub = Boolean(section.scrollScrub);
  const stackRef = useRef(null);
  const stackItems = section.stackItems || [];
  const progress = usePinnedStackProgress(stackRef, stackItems.length);
  const animatedProgress = useSmoothedProgress(progress, 700, 'linear');
  const panelClassName = `panel nutrition-panel nutrition-panel-${section.variant} ${
    isScrollScrub ? 'nutrition-panel-scroll-scrub' : ''
  } ${SECTION_THEMES[section.theme].className}`;
  const panelStyle = isFruit
    ? { '--nutrition-stack-height': `${stackItems.length * 100}vh` }
    : isScrollScrub
      ? { '--nutrition-scroll-scrub-height': section.scrollScrub.height || '180vh' }
      : undefined;

  return (
    <section
      className={panelClassName}
      id={section.id}
      ref={isFruit ? stackRef : undefined}
      style={panelStyle}
    >
      {isFruit ? (
        <>
          {stackItems.map((item, index) => (
            <span
              aria-hidden="true"
              className="nutrition-stack-snap"
              id={index === 0 ? undefined : item.id}
              key={`nutrition-snap-${item.id}`}
              style={{ top: `${index * 100}vh` }}
            />
          ))}
          <div className="nutrition-stack-stage">
            <div className="nutrition-stack-copy nutrition-stack-copy-animated" aria-label={stackItems.map((item) => Array.isArray(item.label) ? item.label.join(' ') : item.label).join(' ')}>
              {stackItems.map((item, index) => {
                const lines = Array.isArray(item.label) ? item.label : [item.label];
                const distance = index - animatedProgress;
                const absDistance = Math.abs(distance);
                const activeAmount = 1 - smoothstep(0.12, 0.72, absDistance);
                const mutedOpacity = clamp(0.42 - Math.max(absDistance - 1, 0) * 0.12, 0.22, 0.42);
                const opacity = lerp(mutedOpacity, 1, activeAmount);
                const blur = lerp(Math.min(absDistance * 6, 8), 0, activeAmount);
                const translateY = distance * 62;
                const fontSize = lerp(52, 76, activeAmount);
                const lineHeight = lerp(1.05, 0.99, activeAmount);
                const letterSpacing = lerp(0.42, 0.76, activeAmount);
                const textShadowAlpha = lerp(0, 0.22, activeAmount);

                return (
                  <div
                    aria-hidden={opacity < 0.12 ? true : undefined}
                    className={`nutrition-stack-word nutrition-stack-word-${index}`}
                    key={item.id}
                    style={{
                      opacity,
                      filter: `blur(${blur}px)`,
                      transform: `translate3d(0, ${translateY}px, 0)`,
                      fontSize: `${fontSize}px`,
                      lineHeight,
                      letterSpacing: `${letterSpacing}px`,
                      textShadow: `0 1.366px 35.516px rgba(4, 14, 36, ${textShadowAlpha})`,
                      zIndex: Math.round(activeAmount * 10),
                    }}
                  >
                    {lines.map((line) => (
                      <span key={`${item.id}-${line}`}>{line}</span>
                    ))}
                  </div>
                );
              })}
            </div>
            <ScrollDown />
          </div>
        </>
      ) : (
        <div className={isScrollScrub ? 'nutrition-scroll-scrub-stage' : undefined}>
          <h2 className="nutrition-electrolytes-title">
            {section.headlineLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <ScrollDown />
        </div>
      )}
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
          className="access-email-form"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <label>
            <span className="sr-only">{section.inputLabel}</span>
            <input type="email" required placeholder={section.inputLabel} aria-label={section.inputLabel} />
          </label>
          <button type="submit" aria-label={submitted ? 'Requested' : 'Submit email'}>
            <svg className="access-submit-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M7 17L17 7" />
              <path d="M10 7H17V14" />
            </svg>
          </button>
        </form>
        <p>
          <span>By joining, you agree to the </span>
          <a href="/terms">Terms</a>
          <span> and </span>
          <a href="/privacy">Privacy Policy</a>
        </p>
      </div>
      <img
        className="access-brand-wordmark"
        src="/figma-lineup/athora-access-vector-wordmark.svg"
        alt=""
        aria-hidden="true"
      />
      <footer className="footer-links access-footer-links">
        {LEGAL_LINKS.map((link, index) => (
          <React.Fragment key={link.path}>
            {index > 0 ? <span>&bull;</span> : null}
            <a href={link.path}>{link.label}</a>
          </React.Fragment>
        ))}
        <span className="footer-spacer" />
        <span>&copy; 2026 ATHORA</span>
        <span>&bull;</span>
        <span>ALL RIGHTS RESERVED</span>
      </footer>
    </section>
  );
}

function ScrollDown() {
  return null;
}

function FixedScrollDown({ visible }) {
  return (
    <p className={`fixed-scroll-down ${visible ? 'fixed-scroll-down-visible' : ''}`} aria-hidden={!visible}>
      Scroll down
    </p>
  );
}

function LegalBodyBlock({ block, index }) {
  if (block.type === 'space') {
    return <span className="legal-space" aria-hidden="true" key={`space-${index}`} />;
  }

  if (block.type === 'list') {
    return (
      <ul key={`list-${index}`}>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return <p key={`p-${index}`}>{block.text}</p>;
}

function LegalFooter({ page }) {
  return (
    <footer className="legal-footer">
      <img className="legal-footer-wordmark" src={page.wordmark} alt="ATHORA" draggable="false" />
      <div className="legal-footer-row">
        <div className="legal-footer-links">
          {LEGAL_LINKS.map((link, index) => (
            <React.Fragment key={link.path}>
              {index > 0 ? <span>&bull;</span> : null}
              <a href={link.path}>{link.label}</a>
            </React.Fragment>
          ))}
        </div>
        <div className="legal-footer-copyright">
          <span>&copy; 2026 ATHORA</span>
          <span>&bull;</span>
          <span>ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </footer>
  );
}

function LegalPage({ page }) {
  useEffect(() => {
    document.documentElement.classList.add('legal-document');
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    return () => {
      document.documentElement.classList.remove('legal-document');
    };
  }, [page.slug]);

  return (
    <div
      className={`legal-page legal-page-${page.slug}`}
      style={{
        '--active-primary': '#061dff',
        '--active-secondary': '#03e5f0',
        '--active-glow': '#7bf9ff',
        '--legal-height': `${page.height}px`,
      }}
    >
      <div className="legal-background" aria-hidden="true">
        <img className="legal-bg-image" src={page.background} alt="" draggable="false" />
        <img className="legal-rect legal-rect-25" src="/figma-legal/rectangle-25.svg" alt="" draggable="false" />
        <img className="legal-rect legal-rect-23" src="/figma-legal/rectangle-23.svg" alt="" draggable="false" />
        <img className="legal-rect legal-rect-24" src="/figma-legal/rectangle-24.svg" alt="" draggable="false" />
      </div>
      <Navigation showNav legal />
      <main className="legal-shell">
        <section className="legal-frame" aria-labelledby={`${page.slug}-title`}>
          <div className="legal-copy">
            <h1 id={`${page.slug}-title`}>{page.title}</h1>
            <div className="legal-body">
              {page.blocks.map((block, index) => (
                <LegalBodyBlock block={block} index={index} key={`${block.type}-${index}`} />
              ))}
            </div>
          </div>
          <LegalFooter page={page} />
        </section>
      </main>
    </div>
  );
}

const SectionRenderer = React.memo(function SectionRenderer({ section, onIntroReveal, isActive, criticalAssetsReady }) {
  switch (section.type) {
    case 'install':
      return <InstallSection section={section} onIntroReveal={onIntroReveal} criticalAssetsReady={criticalAssetsReady} />;
    case 'intro':
      return <IntroSection section={section} isActive={isActive} />;
    case 'systems':
      return <SystemsSection section={section} />;
    case 'claim':
      return <ClaimSection section={section} />;
    case 'claim-stack':
      return <ClaimStackSection section={section} />;
    case 'lineup':
      return <ProductLineupSection section={section} />;
    case 'open':
      return <OpenSection section={section} />;
    case 'price':
      return <PriceSection section={section} />;
    case 'price-stack':
      return <PriceStackSection section={section} />;
    case 'nutrition':
      return <NutritionSection section={section} />;
    case 'benefits':
      return <BenefitsSection section={section} />;
    case 'split-claim':
      return <SplitClaimSection section={section} />;
    case 'access':
      return <AccessSection section={section} />;
    default:
      return <ClaimSection section={section} />;
  }
});

// Pre-rendered transparent frame sequence scrubbed by scroll (cheap + smooth, replaces
// the live 3D can). Transparent WebP over the existing CSS background. The sequence spans
// from `fromSection` (first frame = upright can on the intro screen) through `toSection`
// (carousel + exit), so the can is present from the first screen after the preloader.
const FRAME_SCRUB = {
  count: 304,
  path: '/frames/hydration-webp',
  fromSection: 'intro',
  toSection: 'all-systems',
  // Piecewise scrub: the intro screen plays frames 0 -> splitFrame (can stands up and
  // tilts), so by the time you reach the hydration screen the can is already semi-
  // horizontal (frame ~splitFrame) instead of still vertical over the text. The rest of
  // the sequence (splitFrame -> count) plays across all-systems (carousel + exit).
  // Lower splitFrame = the can stays vertical for less scroll on intro.
  splitFrame: 120,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

function FlavorFrameScrub({ active }) {
  const config = FRAME_SCRUB;
  const canvasRef = useRef(null);
  const framesRef = useRef([]);

  useEffect(() => {
    const imgs = [];
    for (let i = 1; i <= config.count; i += 1) {
      const img = new Image();
      img.decoding = 'async';
      img.src = `${config.path}/${String(i).padStart(4, '0')}.webp`;
      imgs.push(img);
    }
    framesRef.current = imgs;
    // Pre-decode the opening frames so the very first scrub is hitch-free.
    Promise.allSettled(imgs.slice(0, 32).map((im) => im.decode?.())).catch(() => {});
    return () => { framesRef.current = []; };
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    // Draw at 1:1 with the source (1440-wide frames) — upscaling beyond the source only
    // softens it, so cap the backing store near the source width rather than full DPR.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    let raf = 0;
    let lastIdx = -1;

    const sizeCanvas = () => {
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
    };

    const draw = (force) => {
      raf = 0;
      const fromEl = document.getElementById(config.fromSection);
      const toEl = document.getElementById(config.toSection);
      if (!fromEl || !toEl) return;
      // Piecewise: intro plays 0..splitFrame, all-systems plays splitFrame..count-1.
      const introTop = window.scrollY + fromEl.getBoundingClientRect().top;
      const toTop = window.scrollY + toEl.getBoundingClientRect().top;
      const endY = toTop + toEl.offsetHeight - window.innerHeight;
      const last = config.count - 1;
      const split = clamp(config.splitFrame ?? Math.round(last / 2), 0, last);
      let frame;
      if (window.scrollY < toTop) {
        const p1 = clamp((window.scrollY - introTop) / Math.max(toTop - introTop, 1), 0, 1);
        frame = p1 * split;
      } else {
        const p2 = clamp((window.scrollY - toTop) / Math.max(endY - toTop, 1), 0, 1);
        frame = split + p2 * (last - split);
      }
      const idx = clamp(Math.round(frame), 0, last);
      if (idx === lastIdx && !force) return;
      const dir = idx >= lastIdx ? 1 : -1;
      lastIdx = idx;
      const img = framesRef.current[idx];
      // Warm-decode the next frames in the scroll direction so upcoming frames are ready
      // to draw instantly (no mid-scroll decode hitch).
      for (let k = 1; k <= 10; k += 1) {
        const j = idx + dir * k;
        const ahead = framesRef.current[j];
        if (ahead && ahead.complete && ahead.naturalWidth) ahead.decode?.().catch(() => {});
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (img && img.complete && img.naturalWidth) {
        const cw = canvas.width;
        const ch = canvas.height;
        const fw = img.naturalWidth;
        const fh = img.naturalHeight;
        const s = Math.max(cw / fw, ch / fh) * config.scale; // cover
        const dw = fw * s;
        const dh = fh * s;
        ctx.drawImage(img, (cw - dw) / 2 + config.offsetX * dpr, (ch - dh) / 2 + config.offsetY * dpr, dw, dh);
      }
    };

    sizeCanvas();
    draw(true);
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => draw(false)); };
    const onResize = () => { sizeCanvas(); draw(true); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    // Frames decode async; redraw the current frame a few times while they land.
    const warm = window.setInterval(() => draw(true), 250);
    const stopWarm = window.setTimeout(() => window.clearInterval(warm), 6000);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.cancelAnimationFrame(raf);
      window.clearInterval(warm);
      window.clearTimeout(stopWarm);
    };
  }, [config]);

  return (
    <canvas
      ref={canvasRef}
      className={`frame-scrub ${active ? 'frame-scrub-active' : ''}`}
      aria-hidden="true"
    />
  );
}

function LandingApp() {
  useStartAtPreloaderOnPageLoad();

  const appRef = useRef(null);
  const { activeIndex, showNav, modelStateRef, scrollActivityRef } = useScrollModelState(appRef);
  const activeSection = sections[activeIndex];
  const [preloaderLocked, setPreloaderLocked] = useState(false);
  const [introRevealPhase, setIntroRevealPhase] = useState('idle');
  const [introSceneHeld, setIntroSceneHeld] = useState(false);
  const [sceneBootAllowed, setSceneBootAllowed] = useState(false);
  // No 3D scene in the frames-version: nothing to wait for, so the preloader doesn't
  // gate on scene assets.
  const [criticalSceneReady, setCriticalSceneReady] = useState(true);
  const [criticalImagesReady, setCriticalImagesReady] = useState(false);
  const introRevealPhaseRef = useRef('idle');
  const introRevealTimersRef = useRef([]);
  const restoreScrollStylesRef = useRef(() => {});
  const markCriticalSceneReady = useCallback(() => {
    setCriticalSceneReady(true);
  }, []);
  const criticalAssetsReady = criticalSceneReady && criticalImagesReady;

  useEffect(() => {
    introRevealPhaseRef.current = introRevealPhase;
  }, [introRevealPhase]);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      Promise.all([
        ...CRITICAL_PRELOAD_IMAGE_SOURCES.map(preloadImageSource),
        ...CRITICAL_PRELOAD_BINARY_SOURCES.map(preloadBinarySource),
      ]).then(() => {
        if (!cancelled) setCriticalImagesReady(true);
      });
    }, PRELOADER_ASSET_LOAD_START_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSceneBootAllowed(true);
    }, PRELOADER_SCENE_BOOT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      introRevealTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      introRevealTimersRef.current = [];
      restoreScrollStylesRef.current();
    };
  }, []);

  usePreloaderScrollLock(preloaderLocked);
  useControlledStepScroll(preloaderLocked && introRevealPhase === 'done');
  useScrollScrubSnapMode(preloaderLocked && introRevealPhase === 'done');

  useLayoutEffect(() => {
    if (!preloaderLocked || introRevealPhase !== 'done') return undefined;

    const intro = document.getElementById('intro');
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = 'auto';

    const scrollPastPreloader = () => {
      const introTop = intro ? intro.offsetTop : 0;
      window.scrollTo({ top: introTop, left: 0, behavior: 'auto' });
    };

    const raf = window.requestAnimationFrame(scrollPastPreloader);
    const timer = window.setTimeout(() => {
      scrollPastPreloader();
      root.style.scrollBehavior = previousScrollBehavior;
    }, 80);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      root.style.scrollBehavior = previousScrollBehavior;
    };
  }, [preloaderLocked, introRevealPhase]);

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
      setPreloaderLocked(true);
      setIntroSceneHeld(false);
      restoreScrollStylesRef.current();
      setIntroRevealPhase('done');
      return;
    }

    setIntroSceneHeld(true);
    setIntroRevealPhase('preparing');

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo(0, intro.offsetTop);

        const revealTimer = window.setTimeout(() => {
          setIntroRevealPhase('revealing');
        }, INTRO_REVEAL_PREP_MS);

        const doneTimer = window.setTimeout(() => {
          setPreloaderLocked(true);
          restoreScrollStylesRef.current();
          setIntroRevealPhase('done');

          const sceneRevealTimer = window.setTimeout(() => {
            setIntroSceneHeld(false);
          }, INTRO_SCENE_REVEAL_DELAY_MS);
          introRevealTimersRef.current.push(sceneRevealTimer);
        }, INTRO_REVEAL_PREP_MS + INTRO_REVEAL_DURATION_MS + 80);

        introRevealTimersRef.current.push(revealTimer, doneTimer);
      });
    });
  }, []);

  const hideSceneDuringIntroReveal = introSceneHeld || (introRevealPhase !== 'idle' && introRevealPhase !== 'done');
  const showDetailMorphBg = false;

  return (
    <div
      ref={appRef}
      className={`app ${preloaderLocked ? 'app-preloader-locked' : ''}`}
    >
      <FixedHeroSequenceBackground visible={activeIndex === 1} />
      <FixedSystemsBackground
        visible={
          activeSection?.type === 'systems' ||
          activeSection?.type === 'claim-stack' ||
          activeSection?.id === 'lineup' ||
          activeSection?.id === 'open-can' ||
          activeSection?.type === 'price-stack' ||
          activeSection?.type === 'nutrition' ||
          activeSection?.id === 'simplicity' ||
          activeSection?.id === 'access'
        }
      />
      <FixedDetailMorphBackground visible={showDetailMorphBg} />
      {/* 3D scene removed — cans are pre-rendered frame sequences scrubbed by scroll. */}
      <FlavorFrameScrub active={activeSection?.id === 'intro' || activeSection?.id === 'all-systems'} />
      <Navigation activeIndex={activeIndex} showNav={showNav} preloaderLocked={preloaderLocked} />
      <FixedScrollDown visible={preloaderLocked && introRevealPhase === 'done' && activeSection?.id !== 'access'} />
      <PreloaderTransitionOverlay phase={introRevealPhase} />
      <main>
        {sections.map((section, index) => (
          <SectionRenderer
            section={section}
            key={section.id}
            onIntroReveal={startIntroReveal}
            isActive={activeIndex === index}
            criticalAssetsReady={criticalAssetsReady}
          />
        ))}
      </main>
    </div>
  );
}

function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  const legalPage = LEGAL_PAGES[normalizedPath];

  if (legalPage) {
    return <LegalPage page={legalPage} />;
  }

  return <LandingApp />;
}

createRoot(document.getElementById('root')).render(<App />);
