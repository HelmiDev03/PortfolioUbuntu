import mongoose, { Schema } from 'mongoose';

const ItemSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['folder', 'file'], required: true },
    path: { type: String, required: true, unique: true }, // e.g. /home/helmi/Documents or /home/helmi/Documents/Notes
    parentPath: { type: String, required: true }, // e.g. /home/helmi/Documents

    // For folders, we can store children names for faster list, but truth is in documents
    children: { type: [String], default: [] },

    // Supabase storage metadata for files
    storagePath: { type: String, default: null }, // path inside the bucket
    mimeType: { type: String, default: null },
    sizeBytes: { type: Number, default: null },
    publicUrl: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
