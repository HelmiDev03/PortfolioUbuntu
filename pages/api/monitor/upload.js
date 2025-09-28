import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Discord webhook configuration
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// Upload file to Discord
async function uploadToDiscord(filePath, fileName, mimeType) {
  try {
    const FormData = require('form-data');
    const form = new FormData();
    
    // Add the file first
    form.append('files[0]', fs.createReadStream(filePath), {
      filename: fileName,
      contentType: mimeType || 'video/mp4'
    });
    
    // Create the message content
    const currentTime = new Date().toLocaleString();
    const messageContent = `🎥 **Face Gesture Recording**\n📅 **Time:** ${currentTime}\n📁 **File:** ${fileName}`;
    
    // Add the payload with proper structure
    const payload = {
      content: messageContent,
      username: "Face Gesture Monitor",
      avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png"
    };
    
    form.append('payload_json', JSON.stringify(payload));

    console.log('[Discord] Sending to webhook with payload:', payload);

    // Send to Discord using node-fetch
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      body: form,
      headers: {
        ...form.getHeaders()
      }
    });

    if (response.ok) {
      const result = await response.text();
      console.log('[Discord] File uploaded successfully to Discord channel');
      return { success: true, response: result };
    } else {
      const errorText = await response.text();
      console.error('[Discord] Upload failed:', response.status, errorText);
      throw new Error(`Discord upload failed: ${response.status} ${errorText}`);
    }
  } catch (error) {
    console.error('[Discord] Upload failed:', error);
    throw error;
  }
}

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  const raw = Array.isArray(xff) ? xff[0] : (xff || '');
  const candidate = raw.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  // Sanitize: remove non-alphanumeric and dots/colons
  const safe = candidate.replace(/[^a-zA-Z0-9\.:_-]/g, '_');
  // Normalize IPv6 localhost ::1 to 127.0.0.1
  return safe === '::1' ? '127.0.0.1' : safe;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Files will be uploaded to Discord only
  console.log('[API] Setting up IncomingForm');
  
  const form = new IncomingForm({ 
    multiples: false, 
    keepExtensions: true,
    // Add more debug options
    maxFileSize: 100 * 1024 * 1024, // 100MB max
  });

  form.parse(req, async (err, fields, files) => {
    try {
      console.log('[API] parse start');
      if (err) {
        console.error('Form parse error:', err);
        return res.status(400).json({ error: 'Invalid upload' });
      }

      console.log('[API] fields:', fields);
      console.log('[API] files keys:', Object.keys(files || {}));
      const file = files.file || files.blob || files.video;
      if (!file) {
        console.warn('[API] No file provided');
        return res.status(400).json({ error: 'No file uploaded. Use multipart/form-data with field name "file".' });
      }
      
      // Debug the file object structure
      console.log('[API] File object keys:', Object.keys(file));
      console.log('[API] File details:', {
        originalFilename: file.originalFilename,
        newFilename: file.newFilename,
        size: file.size,
        mimetype: file.mimetype,
      });

      const ip = getClientIp(req);
      // Generate timestamp in format YYYYMMDD_HHmmss
      const now = new Date();
      const timestamp = now.toISOString()
        .replace(/[-:]/g, '')
        .replace('T', '_')
        .split('.')[0];
      // Format: ip_timestamp.mp4 to ensure unique filenames
      const finalName = `${ip}_${timestamp}.mp4`;

      // formidable v3 stores file as { filepath }
      // Handle both array and single file cases
      const fileObj = Array.isArray(file) ? file[0] : file;
      
      // Get the filepath - formidable v3 uses filepath, v2 uses path
      const tempPath = fileObj.filepath || fileObj.path;
      
      if (!tempPath) {
        console.error('[API] missing tempPath on uploaded file');
        // Try direct access to the first file if it's an array
        if (files.file && Array.isArray(files.file) && files.file[0]) {
          console.log('[API] Trying first file in array');
          return res.status(500).json({ error: 'Upload failed: file structure unexpected' });
        }
        return res.status(500).json({ error: 'Upload failed: missing temp file path' });
      }

      console.log('[API] Temp file path:', tempPath);
      console.log('[API] Will upload to Discord with name:', finalName);
      
      try {
        // Check if file exists and has content
        const stats = fs.statSync(tempPath);
        console.log('[API] Temp file exists:', stats.isFile(), 'size:', stats.size);
        if (stats.size === 0) {
          console.error('[API] Temp file is empty (0 bytes)');
          return res.status(400).json({ error: 'Uploaded file is empty' });
        }
        
        // Upload to Discord
        console.log('[API] Uploading to Discord...');
        const discordResult = await uploadToDiscord(tempPath, finalName, fileObj.mimetype || 'video/mp4');
        
        console.log('[API] Discord upload successful:', discordResult);
        
        // Clean up temporary file after successful upload
        try {
          fs.unlinkSync(tempPath);
          console.log('[API] Temporary file cleaned up:', tempPath);
        } catch (cleanupErr) {
          console.warn('[API] Failed to cleanup temp file:', cleanupErr.message);
        }
        
      } catch (uploadErr) {
        console.error('[API] Error during Discord upload:', uploadErr);
        
        // Clean up temporary file even if upload failed
        try {
          fs.unlinkSync(tempPath);
          console.log('[API] Temporary file cleaned up after error:', tempPath);
        } catch (cleanupErr) {
          console.warn('[API] Failed to cleanup temp file after error:', cleanupErr.message);
        }
        
        return res.status(500).json({ error: 'Failed to upload to Discord: ' + uploadErr.message });
      }

      // Get current ISO time for logs
      const logTime = new Date().toISOString();
      console.log(`[API] [${logTime}] Upload completed for:`, finalName);
      
      // Return response indicating Discord upload
      return res.status(200).json({
        ok: true,
        filename: finalName,
        storage: 'discord',
        timestamp: logTime,
        note: 'Uploaded to Discord channel with unique filename format: ip_timestamp.mp4',
      });
    } catch (e) {
      console.error('Upload error:', e);
      return res.status(500).json({ error: 'Server error during upload' });
    }
  });
}
