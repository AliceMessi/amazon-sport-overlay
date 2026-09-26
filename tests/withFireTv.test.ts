import {
  applyFireTvManifest,
  type AndroidManifest,
} from '../plugins/withFireTv';

function createManifest(): AndroidManifest {
  return {
    manifest: {
      application: [
        {
          $: {},
          activity: [
            {
              $: { 'android:name': '.MainActivity' },
              'intent-filter': [
                {
                  action: [{ $: { 'android:name': 'android.intent.action.MAIN' } }],
                  category: [
                    { $: { 'android:name': 'android.intent.category.LAUNCHER' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };
}

describe('applyFireTvManifest', () => {
  test('configures the launcher activity for Fire TV', () => {
    const result = applyFireTvManifest(createManifest());
    const application = result.manifest.application?.[0];
    const activity = application?.activity?.[0];
    const features = result.manifest['uses-feature'] ?? [];
    const intentFilter = activity?.['intent-filter']?.[0];

    expect(activity?.$['android:banner']).toBe('@drawable/tv_banner');
    expect(intentFilter?.category).toContainEqual({
      $: { 'android:name': 'android.intent.category.LEANBACK_LAUNCHER' },
    });
    expect(features).toContainEqual({
      $: {
        'android:name': 'android.software.leanback',
        'android:required': 'false',
      },
    });
    expect(features).toContainEqual({
      $: {
        'android:name': 'android.hardware.touchscreen',
        'android:required': 'false',
      },
    });
  });

  test('removes legacy and dependency permissions while keeping internet access', () => {
    const manifest = createManifest();
    manifest.manifest['uses-permission'] = [
      { $: { 'android:name': 'android.permission.INTERNET' } },
      { $: { 'android:name': 'android.permission.READ_EXTERNAL_STORAGE' } },
      { $: { 'android:name': 'android.permission.WRITE_EXTERNAL_STORAGE' } },
      { $: { 'android:name': 'android.permission.OPEN_DOCUMENT_TREE' } },
      { $: { 'android:name': 'android.permission.SYSTEM_ALERT_WINDOW' } },
      {
        $: {
          'android:name': 'android.permission.VIBRATE',
          'tools:node': 'remove',
        },
      },
    ];

    const result = applyFireTvManifest(manifest);
    const repeatedResult = applyFireTvManifest(result);
    const expectedPermissions = [
      { $: { 'android:name': 'android.permission.INTERNET' } },
      {
        $: {
          'android:name': 'android.permission.READ_EXTERNAL_STORAGE',
          'tools:node': 'remove',
        },
      },
      {
        $: {
          'android:name': 'android.permission.WRITE_EXTERNAL_STORAGE',
          'tools:node': 'remove',
        },
      },
      {
        $: {
          'android:name': 'android.permission.OPEN_DOCUMENT_TREE',
          'tools:node': 'remove',
        },
      },
      {
        $: {
          'android:name': 'android.permission.SYSTEM_ALERT_WINDOW',
          'tools:node': 'remove',
        },
      },
      {
        $: {
          'android:name': 'android.permission.VIBRATE',
          'tools:node': 'remove',
        },
      },
    ];

    expect(result.manifest['uses-permission']).toEqual(expectedPermissions);
    expect(repeatedResult.manifest['uses-permission']).toEqual(
      expectedPermissions,
    );
  });

  test('hardens the application against backup, cleartext, and link discovery', () => {
    const manifest = createManifest();
    manifest.manifest.queries = [{ $: {} }];

    const result = applyFireTvManifest(manifest);
    const application = result.manifest.application?.[0];

    expect(application?.$['android:allowBackup']).toBe('false');
    expect(application?.$['android:usesCleartextTraffic']).toBe('false');
    expect(result.manifest.queries).toEqual([
      { $: { 'tools:node': 'removeAll' } },
    ]);
  });

  test('is idempotent', () => {
    const manifest = applyFireTvManifest(createManifest());
    const result = applyFireTvManifest(manifest);

    expect(result.manifest['uses-feature']).toHaveLength(2);
    expect(result.manifest.application?.[0].activity?.[0]['intent-filter']?.[0].category).toHaveLength(
      2,
    );
  });

  test('rejects manifests without a main activity', () => {
    expect(() => applyFireTvManifest({ manifest: {} })).toThrow('MainActivity');
  });
});
