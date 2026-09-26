import type { ConfigPlugin } from '@expo/config-plugins';

type AndroidElement = {
  $: Record<string, string>;
};

type AndroidActivity = AndroidElement & {
  'intent-filter'?: {
    action?: AndroidElement[];
    category?: AndroidElement[];
  }[];
};

export type AndroidManifest = {
  manifest: {
    'uses-feature'?: AndroidElement[];
    'uses-permission'?: AndroidElement[];
    queries?: AndroidElement[];
    application?: {
      activity?: AndroidActivity[];
    }[];
  };
};

export function applyFireTvManifest(manifest: AndroidManifest): AndroidManifest;

declare const withFireTv: ConfigPlugin;

export default withFireTv;
