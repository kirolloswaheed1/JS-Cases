import { put } from '@vercel/blob';

/**
 * Storage adapter.
 *
 * The /api/upload-design route uses this module to persist:
 *   - preview PNG (for customer & order admin)
 *   - print-ready PNG (high resolution, for production)
 *   - editable JSON (so customers/admins can re-open or audit the design)
 *
 * Three providers are supported. Switch via STORAGE_PROVIDER env var.
 *
 *   STORAGE_PROVIDER=placeholder   → returns mock URLs, nothing is actually uploaded.
 *                                    Use this in local dev when you don't have credentials.
 *   STORAGE_PROVIDER=supabase      → uploads to Supabase Storage (bucket: SUPABASE_BUCKET).
 *   STORAGE_PROVIDER=cloudinary    → uploads to Cloudinary (folder: CLOUDINARY_FOLDER).
 *   STORAGE_PROVIDER=vercel-blob   → uploads to Vercel Blob.
 *
 * To change provider: set STORAGE_PROVIDER + the corresponding credentials. No code changes.
 */

export interface StoredFile {
  url: string;
  key: string;
}

export interface StorageAdapter {
  uploadPng: (key: string, base64DataUrl: string) => Promise<StoredFile>;
  uploadJson: (key: string, json: unknown) => Promise<StoredFile>;
}

/* ----------------------------- Placeholder ----------------------------- */

const placeholderAdapter: StorageAdapter = {
  async uploadPng(key) {
    return {
      url: `https://placeholder.local/${encodeURIComponent(key)}`,
      key,
    };
  },
  async uploadJson(key) {
    return {
      url: `https://placeholder.local/${encodeURIComponent(key)}`,
      key,
    };
  },
};

/* ----------------------------- Supabase -------------------------------- */
/* Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_BUCKET
   Uses raw fetch against the Storage REST API so we don't need the SDK as a dep. */

function base64DataUrlToBuffer(dataUrl: string): { buffer: Buffer; mime: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('Invalid data URL');
  return { mime: match[1], buffer: Buffer.from(match[2], 'base64') };
}

function makeSupabaseAdapter(): StorageAdapter {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const bucket = process.env.SUPABASE_BUCKET || 'js-cases-designs';

  async function upload(path: string, body: Buffer, contentType: string): Promise<StoredFile> {
    const res = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': contentType,
        'x-upsert': 'true',
      },
      // Cast through Uint8Array — Buffer is a Uint8Array subclass but newer
      // @types/node typings don't accept it as BodyInit directly.
      body: new Uint8Array(body),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Supabase upload failed: ${res.status} ${t}`);
    }
    const publicUrl = `${url}/storage/v1/object/public/${bucket}/${path}`;
    return { url: publicUrl, key: path };
  }

  return {
    async uploadPng(keyName, base64DataUrl) {
      const { buffer, mime } = base64DataUrlToBuffer(base64DataUrl);
      return upload(keyName, buffer, mime);
    },
    async uploadJson(keyName, json) {
      const buf = Buffer.from(JSON.stringify(json));
      return upload(keyName, buf, 'application/json');
    },
  };
}

/* ---------------------------- Vercel Blob ------------------------------ */
/* Requires: BLOB_STORE_ID + VERCEL_OIDC_TOKEN on Vercel/OIDC
   Or BLOB_READ_WRITE_TOKEN if you later choose token auth. */

function makeVercelBlobAdapter(): StorageAdapter {
  async function upload(path: string, body: Buffer, contentType: string): Promise<StoredFile> {
    const blob = await put(path, body, {
      access: 'public',
      contentType,
      allowOverwrite: true,
      addRandomSuffix: false,
    });

    return {
      url: blob.url,
      key: blob.pathname,
    };
  }

  return {
    async uploadPng(keyName, base64DataUrl) {
      const { buffer, mime } = base64DataUrlToBuffer(base64DataUrl);
      return upload(keyName, buffer, mime);
    },

    async uploadJson(keyName, json) {
      const buf = Buffer.from(JSON.stringify(json));
      return upload(keyName, buf, 'application/json');
    },
  };
}

/* ----------------------------- Cloudinary ------------------------------ */
/* Requires: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET */

async function sha1Hex(input: string): Promise<string> {
  const { createHash } = await import('crypto');
  return createHash('sha1').update(input).digest('hex');
}

function makeCloudinaryAdapter(): StorageAdapter {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const folder = process.env.CLOUDINARY_FOLDER || 'js-cases-designs';

  async function upload(publicId: string, dataUrl: string, resourceType: 'image' | 'raw'): Promise<StoredFile> {
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
    const signature = await sha1Hex(paramsToSign + apiSecret);

    const form = new FormData();
    form.append('file', dataUrl);
    form.append('api_key', apiKey);
    form.append('timestamp', String(timestamp));
    form.append('folder', folder);
    form.append('public_id', publicId);
    form.append('signature', signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/${resourceType}/upload`, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Cloudinary upload failed: ${res.status} ${t}`);
    }
    const json = (await res.json()) as { secure_url: string; public_id: string };
    return { url: json.secure_url, key: json.public_id };
  }

  return {
    async uploadPng(keyName, base64DataUrl) {
      return upload(keyName, base64DataUrl, 'image');
    },
    async uploadJson(keyName, json) {
      const dataUrl = `data:application/json;base64,${Buffer.from(JSON.stringify(json)).toString('base64')}`;
      return upload(keyName, dataUrl, 'raw');
    },
  };
}

/* ---------------------------- Factory ---------------------------------- */

export function getStorage(): StorageAdapter {
  const provider = process.env.STORAGE_PROVIDER || 'placeholder';

  switch (provider) {
    case 'supabase':
      return makeSupabaseAdapter();

    case 'cloudinary':
      return makeCloudinaryAdapter();

    case 'vercel-blob':
      return makeVercelBlobAdapter();

    case 'placeholder':
    default:
      return placeholderAdapter;
  }
}