import { connectToDatabase } from '../../../lib/mongodb';
import Item from '../../../models/Item';

function ensureLeadingSlash(p) { return p.startsWith('/') ? p : '/' + p; }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  await connectToDatabase();

  const { name, type, parentPath, storagePath = null, mimeType = null, sizeBytes = null, publicUrl = null } = req.body;
  if (!name || !type || !parentPath) return res.status(400).json({ error: 'Missing fields' });
  if (!['folder', 'file'].includes(type)) return res.status(400).json({ error: 'Invalid type' });

  const cleanParent = ensureLeadingSlash(parentPath);
  const path = cleanParent === '/' ? `/${name}` : `${cleanParent}/${name}`;

  const parent = await Item.findOne({ path: cleanParent, type: 'folder' });
  if (!parent) return res.status(404).json({ error: 'Parent folder not found' });

  const exists = await Item.findOne({ path });
  if (exists) return res.status(409).json({ error: 'Item already exists' });

  await Item.create({
    name,
    type,
    path,
    parentPath: cleanParent,
    children: type === 'folder' ? [] : undefined,
    storagePath: type === 'file' ? storagePath : null,
    mimeType: type === 'file' ? mimeType : null,
    sizeBytes: type === 'file' ? sizeBytes : null,
    publicUrl: type === 'file' ? publicUrl : null,
  });

  // update parent children list
  parent.children = Array.from(new Set([...(parent.children || []), name]));
  await parent.save();

  return res.status(201).json({ success: true, path });
}
