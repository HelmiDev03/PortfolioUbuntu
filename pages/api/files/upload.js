import { getSupabaseServerClient } from '../../../lib/supabase';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    // Validate required environment variables
    const missing = [];
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push('SUPABASE_URL');
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push('SUPABASE_SERVICE_ROLE');
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET
    if (!bucket) missing.push('SUPABASE_BUCKET');
    if (missing.length) {
      return res.status(500).json({ error: 'Missing environment variables', missing });
    }

    const { fileName, dataUrl, pathPrefix = '' } = req.body;
    if (!fileName || !dataUrl) return res.status(400).json({ error: 'Missing fileName or dataUrl' });

    // dataUrl format: data:<mime>;base64,<data>
    const [meta, b64] = dataUrl.split(',');
    if (!meta || !b64) return res.status(400).json({ error: 'Invalid dataUrl' });
    const mimeMatch = /^data:([^;]+);base64$/i.exec(meta);
    const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const buffer = Buffer.from(b64, 'base64');

    const supabase = getSupabaseServerClient();

    // Build a storage path: optional prefix + timestamp + fileName
    const safePrefix = String(pathPrefix || '').replace(/(^\/|\/$)/g, '');
    const ts = Date.now();
    const storagePath = `${safePrefix ? safePrefix + '/' : ''}${ts}-${fileName}`;

    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(storagePath, buffer, { contentType: mimeType, upsert: false });
    if (upErr) {
      console.error('Supabase upload error', upErr);
      return res.status(500).json({ error: 'Upload failed', details: upErr.message || upErr.error || upErr });
    }

    // Get public URL (assumes bucket public or using signed URL in future)
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    const publicUrl = pub?.publicUrl || null;

    return res.status(201).json({
      success: true,
      storagePath,
      mimeType,
      sizeBytes: buffer.length,
      publicUrl,
      bucket,
    });
  } catch (e) {
    console.error('Upload error', e);
    return res.status(500).json({ error: 'Upload failed', details: e?.message || String(e) });
  }
}
