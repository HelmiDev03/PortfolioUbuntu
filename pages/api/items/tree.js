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

  return res.status(200).json({
    folder: { name: folder.name, path: folder.path, children: folder.children || [] },
    items: childrenDocs.map((d) => ({
      name: d.name,
      type: d.type,
      path: d.path,
      parentPath: d.parentPath,
      cloudId: d.cloudId || null,
      adobeMetadata: d.adobeMetadata || null,
      fileId: d.fileId || null,
    })),
  });
}
