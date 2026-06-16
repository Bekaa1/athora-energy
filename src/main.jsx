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
    modelState: {
      x: 0,
      y: -0.065,
      z: 0,
      scale: 0.86,
      rotate: 0.02,
      tilt: 0,
      scene: 3,
      opacity: 1,
      asset: 'screen1',
      clipProgress: 1,
      spin: 0,
      floatTilt: 0.01,
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
    systemsSequence: [
      {
        theme: 'blue',
        modelState: {
          x: 1.34,
          y: -0.92,
          z: 0,
          scale: 1.38,
          rotate: -0.64,
          tilt: -0.42,
          pitch: -0.4,
          scene: 3,
          opacity: 1,
          asset: 'screen2Blue',
          clipProgress: 0,
          spin: 0,
          floatTilt: 0.01,
        },
      },
      {
        theme: 'orange',
        modelState: {
          x: 1.94,
          y: -0.92,
          z: 0,
          scale: 1.38,
          rotate: -0.64,
          tilt: -0.42,
          pitch: -0.4,
          scene: 3,
          opacity: 1,
          asset: 'screen2Orange',
          clipProgress: 0,
          spin: 0,
          floatTilt: 0.01,
        },
      },
      {
        theme: 'green',
        modelState: {
          x: 1.34,
          y: -0.92,
          z: 0,
          scale: 1.38,
          rotate: -0.64,
          tilt: -0.42,
          pitch: -0.4,
          scene: 3,
          opacity: 1,
          asset: 'screen2Green',
          clipProgress: 0,
          spin: 0,
          floatTilt: 0.01,
        },
      },
      {
        theme: 'green',
        modelState: {
          x: 1.34,
          y: -0.92,
          z: 0,
          scale: 1.38,
          rotate: -0.64,
          tilt: -0.42,
          pitch: -0.4,
          scene: 3,
          opacity: 1,
          asset: 'screen2Green',
          clipProgress: 0,
          spin: 0,
          floatTilt: 0.01,
        },
      },
    ],
    modelTransitionStart: 0.82,
    modelState: {
      x: 1.34,
      y: -0.92,
      z: 0,
      scale: 1.38,
      rotate: -0.64,
      tilt: -0.42,
      pitch: -0.4,
      scene: 3,
      opacity: 1,
      asset: 'screen2Blue',
      clipProgress: 0,
      spin: 0,
      floatTilt: 0.01,
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
    modelState: {
      x: -0.12,
      y: -0.22,
      z: 0,
      scale: 1.04,
      rotate: 0,
      tilt: 0,
      pitch: 0,
      scene: 3,
      opacity: 1,
      asset: 'screen3Desk',
      clipProgress: 0,
      spin: 0,
      floatTilt: 0,
    },
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
    modelState: { x: -1.85, y: 0.08, z: 0, scale: 0.88, rotate: -0.75, scene: 3, opacity: 0 },
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

const INTRO_REVEAL_PREP_MS = 420;
const INTRO_REVEAL_DURATION_MS = 1050;
const INTRO_SCENE_REVEAL_DELAY_MS = 120;
const PRELOADER_DURATION_MS = 3000;
const PRELOADER_COMPLETE_HOLD_MS = 1500;

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

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function hexToRgb(hex) {
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

function interpolateState(a, b, t) {
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
    clipProgress: lerp(a.clipProgress ?? 0, b.clipProgress ?? 0, t),
    flavorProgress: lerp(a.flavorProgress ?? 0, b.flavorProgress ?? a.flavorProgress ?? 0, t),
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

    const getDocumentTop = (element) => window.scrollY + element.getBoundingClientRect().top;

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
        const metrics = sections
          .map((section) => {
            const element = document.getElementById(section.id);
            if (!element) return null;

            const top = getDocumentTop(element);
            return {
              top,
              height: Math.max(element.offsetHeight, sectionHeight),
            };
          })
          .filter(Boolean);

        if (!metrics.length) return;

        const scrollY = window.scrollY;
        let activeIndex = metrics.findIndex((metric, index) => {
          const nextTop = metrics[index + 1]?.top ?? Number.POSITIVE_INFINITY;
          return scrollY >= metric.top - 1 && scrollY < nextTop - 1;
        });

        if (activeIndex === -1) {
          activeIndex = scrollY < metrics[0].top ? 0 : metrics.length - 1;
        }

        const currentMetric = metrics[activeIndex];
        const nextMetric = metrics[Math.min(activeIndex + 1, metrics.length - 1)];
        const sectionEnd = nextMetric?.top > currentMetric.top ? nextMetric.top : currentMetric.top + currentMetric.height;
        const currentSection = sections[activeIndex];
        const rawSectionProgress = clamp((scrollY - currentMetric.top) / Math.max(sectionEnd - currentMetric.top, 1), 0, 1);
        const sectionProgress = currentSection.systemsSequence?.length
          ? clamp((scrollY - currentMetric.top) / Math.max(currentMetric.height - sectionHeight, 1), 0, 1)
          : rawSectionProgress;
        const current = currentSection.modelState;
        const next = sections[Math.min(activeIndex + 1, sections.length - 1)].modelState;
        const modelTransitionStart = currentSection.modelTransitionStart ?? 0;
        const modelProgress =
          modelTransitionStart > 0
            ? clamp((sectionProgress - modelTransitionStart) / Math.max(1 - modelTransitionStart, 0.001), 0, 1)
            : sectionProgress;
        const totalScrollable = Math.max(document.documentElement.scrollHeight - sectionHeight, 1);
        const showNav = scrollY >= sectionHeight * 0.72 || window.location.hash === '#intro';

        let interpolatedModelState = interpolateState(current, next, modelProgress);
        if (currentSection.systemsSequence?.length) {
          const sequenceProgress = getSystemsSequenceProgress(currentSection, sectionProgress);
          const from = sequenceProgress.sequence[sequenceProgress.fromIndex]?.modelState || current;
          const to = sequenceProgress.sequence[sequenceProgress.toIndex]?.modelState || from;
          const sequenceModelProgress = smoothstep(0, 1, sequenceProgress.stepProgress);

          interpolatedModelState = interpolateState(from, to, sequenceModelProgress);
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

        setState({
          progress: clamp(scrollY / totalScrollable, 0, 1),
          activeIndex,
          sectionProgress,
          showNav,
          modelState: interpolatedModelState,
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

function AthoraScene({ modelState, hidden = false }) {
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.25;
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
    let activeVariant = null;

    const loader = new GLTFLoader();
    const getFlavorIndex = (mesh, materials) => {
      const names = [
        mesh.name,
        mesh.parent?.name,
        ...materials.map((material) => material.name || ''),
      ].join(' ');
      if (/blue|Cylinder002|250_ml002/i.test(names)) return 0;
      if (/orange|mango|Cylinder005|250_ml003/i.test(names)) return 1;
      if (/green|lime|lemon|Cylinder001|250_ml001/i.test(names)) return 2;
      return null;
    };

    const tuneCanMaterial = (material) => {
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
        material.color?.set?.(0xe7eef0);
        if ('metalness' in material) material.metalness = 1;
        if ('roughness' in material) material.roughness = 0.14;
        if ('envMapIntensity' in material) material.envMapIntensity = 2.75;
      }

      if (isCanBody) {
        material.color?.set?.(0xffffff);
        if ('metalness' in material) material.metalness = Math.max(material.metalness ?? 0, 0.14);
        if ('roughness' in material) material.roughness = Math.min(material.roughness ?? 0.54, 0.28);
        if ('envMapIntensity' in material) material.envMapIntensity = 1.78;
        if ('clearcoat' in material) material.clearcoat = 0.68;
        if ('clearcoatRoughness' in material) material.clearcoatRoughness = 0.11;
        if ('reflectivity' in material) material.reflectivity = 0.62;
      }

      material.needsUpdate = true;
    };

    const prepareClone = (clone, targetHeight = 3.35, options = {}) => {
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
            const flavorIndex = options.flavorDriven ? getFlavorIndex(child, clonedMaterials) : null;
            if (flavorIndex !== null) {
              child.userData.flavorIndex = flavorIndex;
            }
            clonedMaterials.forEach((material) => {
              tuneCanMaterial(material);
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

    const bindClipsToScroll = (object, clips = []) => {
      if (!clips.length) return;

      const mixer = new THREE.AnimationMixer(object);
      let duration = 0;
      clips.forEach((clip) => {
        duration = Math.max(duration, clip.duration || 0);
        const action = mixer.clipAction(clip);
        action.reset();
        action.play();
      });
      mixer.setTime(0);
      animationMixers.set(object, { mixer, duration });
    };

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
        bindClipsToScroll(assetVariants.screen1, gltf.animations);
      },
      undefined,
      () => {
        assetVariants.screen1 = undefined;
      }
    );

    loader.load(
      '/blender-files/screens/2screen-blue-orange-green.glb',
      (gltf) => {
        const createFlavorVariant = (flavorIndex) => {
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

          const variant = prepareClone(clone, 3.35);
          // Keep each flavor in the exported base pose; the full GLB animation can move
          // isolated cans outside our camera after we remove the other flavors.
          return variant;
        };

        assetVariants.screen2Blue = createFlavorVariant(0);
        assetVariants.screen2Orange = createFlavorVariant(1);
        assetVariants.screen2Green = createFlavorVariant(2);
      },
      undefined,
      () => {
        assetVariants.screen2Blue = undefined;
        assetVariants.screen2Orange = undefined;
        assetVariants.screen2Green = undefined;
      }
    );

    loader.load(
      '/blender-files/screens/3screen-on-desk-three.glb',
      (gltf) => {
        const clone = gltf.scene.clone(true);
        const deskParts = [];
        const lineupOffsets = [
          { match: /aluminium_can_250_ml005|250 ml\.005/i, x: -0.23, y: 0, z: 0 },
          { match: /aluminium_can_250_ml006|250 ml\.006/i, x: 0.12, y: 0, z: 0 },
          { match: /aluminium_can_250_ml007|250 ml\.007/i, x: 0.25, y: 0, z: 0 },
        ];
        clone.traverse((child) => {
          const materials = child.material ? (Array.isArray(child.material) ? child.material : [child.material]) : [];
          const materialNames = materials.map((material) => material.name || '').join(' ');
          if (/Cylinder\.?006|Cylinder\.?013/i.test(child.name) || /Glow|Base\.001/i.test(materialNames)) {
            deskParts.push(child);
            return;
          }
          const offset = lineupOffsets.find(({ match }) => match.test(child.name));
          if (offset) {
            child.userData.lineupOffset = offset;
          }
        });
        deskParts.forEach((child) => child.parent?.remove(child));
        assetVariants.screen3Desk = prepareClone(clone, 3.7);
        bindClipsToScroll(assetVariants.screen3Desk, gltf.animations);
      },
      undefined,
      () => {
        assetVariants.screen3Desk = undefined;
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
    const cyan = new THREE.PointLight(0x00ecff, 16, 9);
    cyan.position.set(-3, -1.8, 2.8);
    scene.add(cyan);
    const blue = new THREE.PointLight(0x0427ff, 10, 8);
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

      const wantedVariant = target.asset ? assetVariants[target.asset] : sceneVariants[target.scene];
      const shouldShowModel = target.opacity > 0.001 && Boolean(wantedVariant);
      modelWrap.visible = shouldShowModel;

      if (!shouldShowModel) {
        if (activeVariant) {
          activeVariant.visible = false;
          activeVariant = null;
        }
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
        return;
      }

      const boundAnimation = animationMixers.get(wantedVariant);
      if (boundAnimation) {
        boundAnimation.mixer.setTime(boundAnimation.duration * clamp(target.clipProgress ?? 0, 0, 1));
        wantedVariant.traverse((child) => {
          const offset = child.userData.lineupOffset;
          if (offset) {
            if (!child.userData.lineupBasePosition) {
              child.userData.lineupBasePosition = child.position.clone();
            }
            const basePosition = child.userData.lineupBasePosition;
            child.position.set(
              basePosition.x + offset.x,
              basePosition.y + offset.y,
              basePosition.z + offset.z
            );
          }
        });
      }
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
      modelWrap.rotation.x = lerp(modelWrap.rotation.x, target.pitch ?? 0, 0.05);
      modelWrap.rotation.y = lerp(modelWrap.rotation.y, target.rotate + elapsed * (target.spin ?? 0.26), 0.05);
      modelWrap.rotation.z = lerp(
        modelWrap.rotation.z,
        (target.tilt ?? 0) + Math.sin(elapsed * 0.6) * (target.floatTilt ?? 0.055),
        0.05
      );

      modelWrap.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          let flavorOpacity = 1;
          if (Number.isFinite(target.flavorProgress) && child.userData.flavorIndex !== undefined) {
            const rawFlavorOpacity = clamp(1 - Math.abs(child.userData.flavorIndex - target.flavorProgress), 0, 1);
            flavorOpacity = smoothstep(0, 1, rawFlavorOpacity);
          }

          materials.forEach((material) => {
            if (material.userData.baseOpacity === undefined) {
              material.userData.baseOpacity = material.opacity ?? 1;
            }
            material.opacity = material.userData.baseOpacity * target.opacity * flavorOpacity;
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

function ChromeDots({ homeHref = '#intro' }) {
  const socials = [
    { label: 'Instagram', icon: '/figma-nav/social-instagram.svg' },
    { label: 'X', icon: '/figma-nav/social-x.svg' },
    { label: 'TikTok', icon: '/figma-nav/social-tiktok.svg' },
  ];

  return (
    <div className="chrome-dots" aria-label="Social links">
      {socials.map((item) => (
        <a className="social-button" href={homeHref} aria-label={item.label} key={item.label}>
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
        <img className="figma-bg-berry" src="/figma-hero/berry-right.svg" alt="" />
      </div>
    </div>
  );
}

function FixedHeroSequenceBackground({ visible, berryOpacity }) {
  const className = [
    'hero-sequence-bg',
    visible ? 'hero-sequence-bg-visible' : '',
    berryOpacity > 0.01 ? 'hero-sequence-bg-with-berry' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className} style={{ '--hero-berry-opacity': berryOpacity }} aria-hidden="true">
      <FigmaHeroBackground />
    </div>
  );
}

function FixedSystemsBackground({ visible }) {
  return <div className={`systems-fixed-bg ${visible ? 'systems-fixed-bg-visible' : ''}`} aria-hidden="true" />;
}

function Navigation({ activeIndex = 0, showNav, preloaderLocked, legal = false }) {
  const homeHref = legal ? '/' : preloaderLocked ? '#intro' : '#installing';
  const productHref = legal ? '/#all-systems' : '#all-systems';
  const systemHref = legal ? '/#simplicity' : '#simplicity';
  const accessHref = legal ? '/#access' : '#access';

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
      <ChromeDots homeHref={homeHref} />
      <a className="nav-mark" href={homeHref} aria-label="ATHORA home">
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

function InstallSection({ section, onIntroReveal }) {
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const startedAt = performance.now();

    const tick = (now) => {
      const elapsed = now - startedAt;
      const progressValue = clamp(elapsed / PRELOADER_DURATION_MS, 0, 1);
      setProgress(Math.round(progressValue * 100));
      if (elapsed < PRELOADER_DURATION_MS) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (progress < 100) return undefined;

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
  }, [onIntroReveal, progress]);

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
      <p className="intro-scroll">{section.subcopy}</p>
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
                      textShadow: isActiveWord ? '0 1.366px 35.516px rgba(4, 14, 36, 0.22)' : 'none',
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

function usePinnedStackProgress(sectionRef, itemCount) {
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
        const scrollRange = Math.max(section.offsetHeight - window.innerHeight, 1);
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
  }, [itemCount, sectionRef]);

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
            const distance = index - progress;
            const absDistance = Math.abs(distance);
            const opacity = clamp(1 - absDistance * 1.55, 0, 1);
            const translateY = distance * 112;
            const scale = 1 - Math.min(absDistance * 0.035, 0.06);
            const blur = Math.min(absDistance * 7, 9);

            return (
              <h2
                aria-hidden={opacity < 0.05 ? true : undefined}
                className={`claim-stack-heading ${hasMobileLines ? 'has-mobile-lines' : ''}`}
                key={claim.id}
                style={{
                  opacity,
                  filter: `blur(${blur}px)`,
                  transform: `translate3d(-50%, calc(-50% + ${translateY}vh), 0) scale(${scale})`,
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
  return (
    <section className={`panel lineup-panel figma-lineup-panel ${SECTION_THEMES[section.theme].className}`} id={section.id}>
      <div className="lineup-desk" aria-hidden="true" />
      <img
        className="lineup-brand-wordmark lineup-brand-vector"
        src="/figma-lineup/athora-vector-wordmark.svg"
        alt="ATHORA"
        draggable="false"
      />
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
  return <p className="scroll-down">Scroll down</p>;
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

function SectionRenderer({ section, onIntroReveal, isActive }) {
  switch (section.type) {
    case 'install':
      return <InstallSection section={section} onIntroReveal={onIntroReveal} />;
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

function LandingApp() {
  useStartAtPreloaderOnPageLoad();

  const { activeIndex, sectionProgress, modelState, showNav } = useScrollModelState();
  const activeSection = sections[activeIndex];
  const systemsTintOpacity = useMemo(() => {
    const currentSection = sections[activeIndex];
    const nextSection = sections[activeIndex + 1];

    if (currentSection?.type !== 'systems') return 0;
    if (currentSection.systemsSequence?.length) {
      const sequenceProgress = getSystemsSequenceProgress(currentSection, sectionProgress);
      const fromTheme = sequenceProgress.sequence[sequenceProgress.fromIndex]?.theme || currentSection.theme;
      const toTheme = sequenceProgress.sequence[sequenceProgress.toIndex]?.theme || fromTheme;
      const isBlueStep = fromTheme === 'blue' && toTheme === 'blue';

      if (isBlueStep) return 0;
      if (fromTheme === 'blue') {
        return smoothstep(0.18, 1, sequenceProgress.stepProgress) * 0.86;
      }

      return 0.86;
    }

    if (currentSection.theme === 'blue' && nextSection?.type === 'systems') {
      return smoothstep(0.78, 1, sectionProgress) * 0.86;
    }

    return currentSection.theme === 'blue' ? 0 : 0.86;
  }, [activeIndex, sectionProgress]);
  const activeTheme = useMemo(() => {
    const currentSection = sections[activeIndex];
    const nextSection = sections[activeIndex + 1];
    const currentTheme = SECTION_THEMES[currentSection?.theme || 'blue'];

    if (currentSection?.systemsSequence?.length) {
      const sequenceProgress = getSystemsSequenceProgress(currentSection, sectionProgress);
      const fromTheme = SECTION_THEMES[sequenceProgress.sequence[sequenceProgress.fromIndex]?.theme || currentSection.theme];
      const toTheme = SECTION_THEMES[sequenceProgress.sequence[sequenceProgress.toIndex]?.theme || currentSection.theme];

      return mixTheme(fromTheme, toTheme, smoothstep(0, 1, sequenceProgress.stepProgress));
    }

    if (currentSection?.type === 'systems' && nextSection?.type === 'systems') {
      const morphProgress = smoothstep(0.78, 1, sectionProgress);
      return mixTheme(currentTheme, SECTION_THEMES[nextSection.theme], morphProgress);
    }

    return currentTheme;
  }, [activeIndex, sectionProgress]);
  const heroBerryOpacity = activeSection?.id === 'intro' ? 1 - smoothstep(0.14, 0.58, sectionProgress) : 0;
  const [preloaderLocked, setPreloaderLocked] = useState(false);
  const [introRevealPhase, setIntroRevealPhase] = useState('idle');
  const [introSceneHeld, setIntroSceneHeld] = useState(false);
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

  usePreloaderScrollLock(preloaderLocked);

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

  return (
    <div
      className="app"
      style={{
        '--active-primary': activeTheme.primary,
        '--active-secondary': activeTheme.secondary,
        '--active-glow': activeTheme.glow,
        '--systems-tint-opacity': systemsTintOpacity,
      }}
    >
      <FixedHeroSequenceBackground visible={activeIndex === 1} berryOpacity={heroBerryOpacity} />
      <FixedSystemsBackground visible={activeSection?.type === 'systems'} />
      <AthoraScene modelState={modelState} hidden={hideSceneDuringIntroReveal} />
      <Navigation activeIndex={activeIndex} showNav={showNav} preloaderLocked={preloaderLocked} />
      <PreloaderTransitionOverlay phase={introRevealPhase} />
      <main>
        {sections.map((section, index) => (
          <SectionRenderer
            section={section}
            key={section.id}
            onIntroReveal={startIntroReveal}
            isActive={activeIndex === index}
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
