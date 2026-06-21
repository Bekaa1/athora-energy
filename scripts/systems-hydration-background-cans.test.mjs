import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8');

function getSystemsSequenceFirstState() {
  const sequenceStart = source.indexOf('systemsSequence: [');
  assert.notEqual(sequenceStart, -1, 'systemsSequence should exist');

  const modelStateStart = source.indexOf('modelState: {', sequenceStart);
  assert.notEqual(modelStateStart, -1, 'hydration modelState should exist');

  const remainingSource = source.slice(modelStateStart + 1);
  const nextThemeMatch = remainingSource.match(/\r?\n\s*\{\r?\n\s*theme:\s*'orange'/);
  assert.ok(nextThemeMatch, 'hydration modelState should be followed by the orange systems step');
  const nextTheme = modelStateStart + 1 + nextThemeMatch.index;

  return source.slice(modelStateStart, nextTheme);
}

test('hydration keeps the blue can active while showing the rear cans', () => {
  const hydrationState = getSystemsSequenceFirstState();

  assert.match(hydrationState, /visibleFlavors:\s*\['blue'\]/, 'blue should remain the active hydration can');
  assert.match(
    hydrationState,
    /backgroundFlavors:\s*\['orange',\s*'green'\]/,
    'orange and green cans should remain visible behind the blue can'
  );
  assert.match(
    hydrationState,
    /backgroundFlavorOpacity:\s*1/,
    'rear cans should be visible at full model opacity on the hydration screen'
  );
});

test('flavor opacity supports background flavors without promoting them to active flavors', () => {
  assert.match(
    source,
    /backgroundFlavors:\s*t\s*<\s*assetSwitchAt\s*\?\s*a\.backgroundFlavors\s*:\s*b\.backgroundFlavors/,
    'background flavors should survive state interpolation so the renderer can see them'
  );
  assert.match(source, /backgroundFlavorIndices/, 'background flavors should be resolved separately from visible flavors');
  assert.match(
    source,
    /isBackgroundFlavor\s*=\s*backgroundFlavorIndices\?\.has\(flavorIndex\)/,
    'materials should be able to identify rear flavor cans'
  );
  assert.match(
    source,
    /flavorOpacity\s*=\s*targetState\.backgroundFlavorOpacity\s*\?\?\s*1/,
    'rear flavor cans should use the configured background opacity instead of the active flavor crossfade'
  );
});
