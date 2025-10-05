import { connectToDatabase } from '../../../lib/mongodb';
import Item from '../../../models/Item';

function ensureLeadingSlash(p) { return p.startsWith('/') ? p : '/' + p; }

async function seedIfEmpty() {
  const count = await Item.countDocuments();
  if (count > 0) return;
  const now = new Date();
  const docs = [
    { name: '/', type: 'folder', path: '/', parentPath: '/', children: ['home'] },
    { name: 'home', type: 'folder', path: '/home', parentPath: '/', children: ['helmi'] },
    { name: 'helmi', type: 'folder', path: '/home/helmi', parentPath: '/home', children: ['Documents'] },
    { name: 'Documents', type: 'folder', path: '/home/helmi/Documents', parentPath: '/home/helmi', children: ['README.txt', 'Projects'] },
    { name: 'README.txt', type: 'file', path: '/home/helmi/Documents/README.txt', parentPath: '/home/helmi/Documents' },
    { name: 'Projects', type: 'folder', path: '/home/helmi/Documents/Projects', parentPath: '/home/helmi/Documents', children: ['portfolio-notes.txt'] },
    { name: 'portfolio-notes.txt', type: 'file', path: '/home/helmi/Documents/Projects/portfolio-notes.txt', parentPath: '/home/helmi/Documents/Projects' },
  ];
  for (const d of docs) {
    await Item.create(d);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  await connectToDatabase();
  await seedIfEmpty();

  const { path = '/home/helmi/Documents' } = req.query;
  const targetPath = ensureLeadingSlash(decodeURIComponent(path));

  const folder = await Item.findOne({ path: targetPath, type: 'folder' }).lean();
  if (!folder) return res.status(404).json({ error: 'Folder not found' });

  const childrenDocs = await Item.find({ parentPath: targetPath }).sort({ type: -1, name: 1 }).lean();

  // Convert to basic items first
  const itemsRaw = childrenDocs.map((d) => ({
    name: d.name,
    type: d.type,
    path: d.path,
    parentPath: d.parentPath,
    storagePath: d.storagePath || null,
    mimeType: d.mimeType || null,
    sizeBytes: d.sizeBytes || null,
    publicUrl: d.publicUrl || null,
  }));

  // Filter out files that no longer exist in storage (e.g., deleted from Supabase directly)
  const items = await (async () => {
    const checks = itemsRaw.map(async (it) => {
      if (it.type !== 'file' || !it.publicUrl) return { ok: true, item: it };
      try {
        const resp = await fetch(it.publicUrl, { method: 'HEAD' });
        return { ok: resp.ok, item: it };
      } catch {
        return { ok: false, item: it };
      }
    });
    const results = await Promise.all(checks);
    return results.filter(r => r.ok).map(r => r.item);
  })();

  return res.status(200).json({
    folder: { name: folder.name, path: folder.path, children: folder.children || [] },
    items,
  });
}
