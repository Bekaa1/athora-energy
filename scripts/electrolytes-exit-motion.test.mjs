import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

function getSectionBlock(id) {
  const start = source.indexOf(`id: '${id}'`);
  assert.notEqual(start, -1, `${id} section should exist`);

  const remainingSource = source.slice(start + 1);
  const nextSectionMatch = remainingSource.match(/\r?\n  \{\r?\n    id: '/);
  assert.ok(nextSectionMatch, `${id} section should be followed by another section`);
  const nextSection = start + 1 + nextSectionMatch.index;

  return source.slice(start, nextSection);
}

test('electrolytes completes the existing GLB roll-out before simplicity becomes active', () => {
  const block = getSectionBlock('electrolytes');
  const startAt = Number(block.match(/startAt:\s*(\d+(?:\.\d+)?),/)?.[1]);
  const endAt = Number(block.match(/endAt:\s*(\d+(?:\.\d+)?),/)?.[1]);

  assert.match(block, /modelTransitionStart:\s*1/, 'electrolytes should stay the active source section during its exit');
  assert.match(block, /scrollScrub:\s*\{/, 'electrolytes should provide a pinned scroll range before simplicity');
  assert.match(block, /targetSectionId:\s*'simplicity'/, 'the scrub range should end at the simplicity section');
  assert.match(block, /height:\s*'260vh'/, 'the scrub section should be long enough for a smooth pinned roll-out');
  assert.match(block, /modelClipScroll:\s*\{/, 'electrolytes should use existing clip scroll tracking');
  assert.match(block, /clipStart:\s*SCREEN4_CLIP\.electrolytes/, 'the roll-out should start from the electrolytes pose');
  assert.match(block, /clipEnd:\s*SCREEN4_CLIP\.rollOut/, 'the GLB clip should reach the final roll-out pose');
  assert.match(block, /easing:\s*'linear'/, 'the GLB roll-out should be scrubbed linearly by scroll progress');
  assert.match(block, /opacityFadeStartAt:\s*0\.5/, 'the remaining GLB edge should start fading only after most of the roll-out');
  assert.match(block, /opacityFadeEndAt:\s*0\.6/, 'the remaining GLB edge should be hidden before simplicity can enter the viewport');
  assert.equal(startAt, 0, `roll-out should begin with the first pixel of electrolytes scroll; startAt was ${startAt}`);
  assert.ok(endAt >= 0.55 && endAt <= 0.6, `roll-out should finish before the pinned stage releases; endAt was ${endAt}`);
  assert.doesNotMatch(block, /modelExitMotion:\s*\{/, 'electrolytes should not add wrapper-level exit transforms');
  assert.doesNotMatch(source, /function applyModelExitMotion/, 'manual wrapper exit helper should not be used for this GLB animation');
  assert.match(source, /currentSection\.modelClipScroll/, 'scroll model should apply section-local clip tracking before section changes');
});

test('linear model clip scroll maps raw section progress directly to GLB time', () => {
  assert.match(source, /function getModelClipScrollAmount/, 'clip scroll progress should be calculated in a named helper');
  assert.match(
    source,
    /clipConfig\.easing\s*===\s*'linear'\s*\?\s*rawClipAmount\s*:\s*smoothstep\(0,\s*1,\s*rawClipAmount\)/s,
    'linear clip scroll should bypass smoothstep and use raw scroll progress'
  );
  assert.match(source, /opacityFadeStartAt/, 'clip scroll should support a late opacity fade for GLB clips that do not fully leave the frame');
  assert.match(source, /opacity:\s*lerp\([^)]*clipOpacityAmount/s, 'the late fade should be applied through model opacity, not wrapper transforms');
});

test('controlled step scrolling yields to native scroll inside the electrolytes scrub range', () => {
  assert.match(source, /function isNativeScrollScrubRange/, 'native scrub ranges should be detected before step scrolling');
  assert.match(source, /scrollScrubSections/, 'controlled step scrolling should derive ranges from section config');
  assert.match(source, /html\.classList\.toggle\('athora-scroll-scrub'/, 'snap should be disabled while inside a scrub range');
  assert.match(styles, /html\.athora-scroll-scrub\s*\{[^}]*scroll-snap-type:\s*none;/s, 'CSS should disable scroll snap during the scrub range');
  assert.match(styles, /\.nutrition-panel-scroll-scrub\s*\{[^}]*min-height:\s*var\(--nutrition-scroll-scrub-height/s, 'electrolytes should have extra scroll distance');
  assert.match(styles, /\.nutrition-scroll-scrub-stage\s*\{[^}]*position:\s*sticky;/s, 'the electrolytes visual should stay pinned while scrubbing');
  assert.match(styles, /\.nutrition-scroll-scrub-stage\s*\{[^}]*z-index:\s*8;/s, 'the pinned electrolytes stage should layer above the following section until release');
});
