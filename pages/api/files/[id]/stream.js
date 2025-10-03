import { getBucket } from '../../../../lib/gridfs';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).send('Method not allowed');
  try {
    const { id } = req.query;
    const bucket = await getBucket();
    const objectId = new mongoose.Types.ObjectId(id);

    res.setHeader('Content-Type', 'application/pdf');
    const downloadStream = bucket.openDownloadStream(objectId);

    downloadStream.on('error', (err) => {
      console.error('GridFS stream error', err);
      if (!res.headersSent) res.status(404).end('File not found');
    });
    downloadStream.pipe(res);
  } catch (e) {
    console.error('Stream error', e);
    if (!res.headersSent) res.status(500).end('Stream failed');
  }
}
