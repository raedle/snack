// NOTE(cedric): add a workaround for the "in-between" Asset registry resolvement.
// We should default to the simple plain React Native assets, but we can't do that
// for Snack assets. That has to be resolved manually.

import { PixelRatio } from 'react-native';
// @ts-ignore
import AssetSourceResolver from 'react-native/Libraries/Image/AssetSourceResolver';
// @ts-ignore
import { setCustomSourceTransformer } from 'react-native/Libraries/Image/resolveAssetSource';

export function registerSnackAssetSourceTransformer() {
  setCustomSourceTransformer(
    (resolver: any) => resolveSnackAssetSource(resolver.asset) || resolver.defaultAsset()
  );
}

export function resolveSnackAssetSource(assetMeta: any) {
  try {
    // The main issue is that `expo-asset` falls back to our main cloud CDN for assets.
    // But Snack has it's own CDN and needs to load from there instead.
    if (assetMeta.uri?.includes('snack-code-uploads.s3.us-west-1.amazonaws.com')) {
      const meta = assetMeta;

      const scale = AssetSourceResolver.pickScale(meta.scales, PixelRatio.get());
      const index = meta.scales.findIndex((s: number) => s === scale);
      const hash = meta.fileHashes ? meta.fileHashes[index] || meta.fileHashes[0] : meta.hash;

      return { uri: assetMeta.uri, hash };
    }
  } catch (e) {}

  return null;
}
