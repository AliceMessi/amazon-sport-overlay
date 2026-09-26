import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import appConfig from '../app.json';
import packageJson from '../package.json';

type Plugin = string | [string, Record<string, unknown>];

describe('TV build configuration', () => {
  test('uses the React Native TV runtime matching Expo SDK 57', () => {
    expect(packageJson.dependencies['react-native']).toBe(
      'npm:react-native-tvos@0.86-stable',
    );
  });

  test('omits auto-installed peers that would duplicate the TV runtime', () => {
    const npmConfig = readFileSync(join(process.cwd(), '.npmrc'), 'utf8');

    expect(npmConfig.trim()).toBe('omit=peer');
  });

  test('enables the React Native TV config plugin for every prebuild', () => {
    const plugins = appConfig.expo.plugins as Plugin[];

    expect(plugins).toContainEqual([
      '@react-native-tvos/config-tv',
      { isTV: true },
    ]);
    expect(appConfig.expo.scheme).toBeUndefined();
  });

  test('blocks permissions inherited from transitive dependencies', () => {
    expect(appConfig.expo.android?.blockedPermissions).toEqual([
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.OPEN_DOCUMENT_TREE',
      'android.permission.SYSTEM_ALERT_WINDOW',
      'android.permission.VIBRATE',
    ]);
  });

  test('builds the sandbox from the project root context', () => {
    const dockerfile = readFileSync(
      join(process.cwd(), 'sandbox', 'Dockerfile'),
      'utf8',
    );

    expect(dockerfile).toContain(
      'COPY package.json package-lock.json .npmrc ./',
    );
    expect(dockerfile).not.toContain('COPY repo/');
  });
});
