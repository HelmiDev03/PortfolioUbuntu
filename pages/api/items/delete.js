import { connectToDatabase } from '../../../lib/mongodb';
import Item from '../../../models/Item';

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

  if (item.type === 'file') {
    await Item.deleteOne({ path });
    return res.status(200).json({ success: true });
  }

  // Folder: delete folder and all descendants
  await Item.deleteMany({ $or: [ { path }, { path: { $regex: `^${path}/` } } ] });
  return res.status(200).json({ success: true });
}
