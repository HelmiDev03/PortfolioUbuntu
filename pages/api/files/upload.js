import { getBucket } from '../../../lib/gridfs';

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
    const { fileName, dataUrl } = req.body;
    if (!fileName || !dataUrl) return res.status(400).json({ error: 'Missing fileName or dataUrl' });

    // dataUrl format: data:application/pdf;base64,AAAA
    const base64 = dataUrl.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');

    const bucket = await getBucket();
    const uploadStream = bucket.openUploadStream(fileName, { contentType: 'application/pdf' });

    await new Promise((resolve, reject) => {
      uploadStream.end(buffer, (err) => (err ? reject(err) : resolve()))
    });

    return res.status(201).json({ success: true, fileId: uploadStream.id.toString() });
  } catch (e) {
    console.error('GridFS upload error', e);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
