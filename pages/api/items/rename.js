import { connectToDatabase } from '../../../lib/mongodb';
import Item from '../../../models/Item';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  await connectToDatabase();

  const { oldPath, newName } = req.body;
  if (!oldPath || !newName) return res.status(400).json({ error: 'Missing fields' });

  const item = await Item.findOne({ path: oldPath });
  if (!item) return res.status(404).json({ error: 'Item not found' });

  const parentPath = item.parentPath;
  const newPath = parentPath === '/' ? `/${newName}` : `${parentPath}/${newName}`;

  // Check conflict
  const conflict = await Item.findOne({ path: newPath });
  if (conflict) return res.status(409).json({ error: 'Destination already exists' });

  // Update parent's children array
  const parent = await Item.findOne({ path: parentPath, type: 'folder' });
  if (parent) {
    parent.children = (parent.children || []).map((c) => (c === item.name ? newName : c));
    await parent.save();
  }

  if (item.type === 'file') {
    item.name = newName;
    item.path = newPath;
    await item.save();
    return res.status(200).json({ success: true, path: newPath });
  }

  // Rename folder: update this folder and all descendants' paths and parentPath
  const oldPrefix = item.path;
  const newPrefix = newPath;

  // Update the folder itself
  item.name = newName;
  item.path = newPath;
  await item.save();

  // Fetch all descendants
  const descendants = await Item.find({ path: { $regex: `^${oldPrefix}/` } });
  for (const d of descendants) {
    d.path = d.path.replace(oldPrefix + '/', newPrefix + '/');
    d.parentPath = d.parentPath.replace(oldPrefix, newPrefix);
    await d.save();
  }

  return res.status(200).json({ success: true, path: newPath });
}
