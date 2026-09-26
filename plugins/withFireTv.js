const {
  withAndroidManifest,
  withDangerousMod,
} = require('@expo/config-plugins');
const { copyFile, mkdir } = require('node:fs/promises');
const path = require('node:path');

const leanbackFeature = 'android.software.leanback';
const touchscreenFeature = 'android.hardware.touchscreen';
const leanbackCategory = 'android.intent.category.LEANBACK_LAUNCHER';
const allowedPermissions = new Set(['android.permission.INTERNET']);

function setRequiredFeature(manifest, name, required) {
  const features = (manifest.manifest['uses-feature'] ??= []);
  const feature = features.find((item) => item.$['android:name'] === name);

  if (feature) {
    feature.$['android:required'] = required;
    return;
  }

  features.push({
    $: {
      'android:name': name,
      'android:required': required,
    },
  });
}

function applyFireTvManifest(manifest) {
  const activity = manifest.manifest.application?.[0]?.activity?.find(
    (item) => item.$['android:name'] === '.MainActivity',
  );

  if (!activity) {
    throw new Error('Fire TV configuration requires an Android MainActivity');
  }

  const application = manifest.manifest.application[0];
  application.$['android:allowBackup'] = 'false';
  application.$['android:usesCleartextTraffic'] = 'false';
  manifest.manifest.queries = [{ $: { 'tools:node': 'removeAll' } }];

  const intentFilter = (activity['intent-filter'] ??= []).find((filter) =>
    filter.action?.some(
      (item) => item.$['android:name'] === 'android.intent.action.MAIN',
    ),
  );

  if (!intentFilter) {
    throw new Error('Fire TV configuration requires a MAIN intent filter');
  }

  const categories = (intentFilter.category ??= []);
  if (
    !categories.some((item) => item.$['android:name'] === leanbackCategory)
  ) {
    categories.push({ $: { 'android:name': leanbackCategory } });
  }

  setRequiredFeature(manifest, leanbackFeature, 'false');
  setRequiredFeature(manifest, touchscreenFeature, 'false');
  manifest.manifest['uses-permission'] = (
    manifest.manifest['uses-permission'] ?? []
  ).map((item) =>
    allowedPermissions.has(item.$['android:name'])
      ? item
      : {
          $: {
            ...item.$,
            'tools:node': 'remove',
          },
        },
  );
  activity.$['android:banner'] = '@drawable/tv_banner';

  return manifest;
}

function withFireTv(config) {
  let nextConfig = withAndroidManifest(config, (manifestConfig) => {
    applyFireTvManifest(manifestConfig.modResults);
    return manifestConfig;
  });

  nextConfig = withDangerousMod(nextConfig, [
    'android',
    async (modConfig) => {
      const source = path.join(
        modConfig.modRequest.projectRoot,
        'assets',
        'tv-banner.png',
      );
      const targetDirectory = path.join(
        modConfig.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'res',
        'drawable-xhdpi',
      );

      await mkdir(targetDirectory, { recursive: true });
      await copyFile(source, path.join(targetDirectory, 'tv_banner.png'));

      return modConfig;
    },
  ]);

  return nextConfig;
}

module.exports = withFireTv;
module.exports.applyFireTvManifest = applyFireTvManifest;
