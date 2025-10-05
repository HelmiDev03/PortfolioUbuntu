import { connectToDatabase } from '../../../lib/mongodb';
import Item from '../../../models/Item';
import { getSupabaseServerClient } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  await connectToDatabase();

  const { path } = req.body;
  if (!path) return res.status(400).json({ error: 'Missing path' });

  const item = await Item.findOne({ path });
  if (!item) return res.status(404).json({ error: 'Item not found' });

  // Remove from parent's children
  const parent = await Item.findOne({ path: item.parentPath, type: 'folder' });
  if (parent) {
    parent.children = (parent.children || []).filter((n) => n !== item.name);
    await parent.save();
  }

  // Prepare Supabase client and bucket
  const bucket = process.env.SUPABASE_BUCKET || 'pdfs';
  const supabase = getSupabaseServerClient();

  if (item.type === 'file') {
    // Try deleting from storage if we have a storagePath
    if (item.storagePath) {
      const { error: rmErr } = await supabase.storage.from(bucket).remove([item.storagePath]);
      if (rmErr) {
        // Log but continue DB deletion
        console.error('Supabase remove error (file):', rmErr);
      }
    }
    await Item.deleteOne({ path });
    return res.status(200).json({ success: true, deletedFromStorage: Boolean(item.storagePath) });
  }

  // Folder: delete folder and all descendants
  // Collect all descendant files to remove from storage
  const descendants = await Item.find({ $or: [ { path }, { path: { $regex: `^${path}/` } } ] });
  const storageKeys = descendants
    .filter((d) => d.type === 'file' && d.storagePath)
    .map((d) => d.storagePath);

  // Batch remove in chunks to be safe
  const chunkSize = 100;
  for (let i = 0; i < storageKeys.length; i += chunkSize) {
    const chunk = storageKeys.slice(i, i + chunkSize);
    const { error: rmErr } = await supabase.storage.from(bucket).remove(chunk);
    if (rmErr) {
      console.error('Supabase remove error (folder chunk):', rmErr, 'chunk start index:', i);
      // Continue attempting to delete other chunks
    }
  }

  await Item.deleteMany({ $or: [ { path }, { path: { $regex: `^${path}/` } } ] });
  return res.status(200).json({ success: true, deletedCount: descendants.length, storageFilesTried: storageKeys.length });
}
