import mongoose from 'mongoose';
import { connectToDatabase } from './mongodb';
import { GridFSBucket } from 'mongodb';

export async function getBucket() {
  await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) throw new Error('No MongoDB connection');
  return new GridFSBucket(db, { bucketName: 'pdfs' });
}
