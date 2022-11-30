import * as Logger from '../Logger';

export type SnackApiCode = {
  id: string;
  hashId: string;
  sdkVersion: string;
  created: string;
  previewLocation: string;
  status: string; // probably should be an enum or string literals
  username: string;
  code: Record<string, { type: 'CODE' | 'ASSET'; contents: string }>;
  dependencies: Record<string, { version: string; wantedVersion: string }>;
  manifest: {
    sdkVersion: string;
    description: string;
    dependencies: Record<string, string>;
  }
}

export async function fetchCodeBySnackIdentifier(snackIdentifier: string): Promise<SnackApiCode | null> {
  try {
    const res = await fetch(`https://exp.host/--/api/v2/snack/${snackIdentifier}`, {
      method: 'GET',
      headers: {
        'Snack-Api-Version': '3.0.0',
      },
    });
    return await res.json();
  } catch (err) {
    Logger.error(`Failed fetch snack with identifier: ${snackIdentifier}`, err);
  }

  return null;
}
