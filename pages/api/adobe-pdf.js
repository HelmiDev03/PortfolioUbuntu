// Adobe PDF Services API integration
// This is a Next.js API route that securely handles Adobe PDF Services API calls

// Real Adobe PDF Services integration entrypoint
// Requires env: ADOBE_CLIENT_ID, ADOBE_CLIENT_SECRET, ADOBE_ORG_ID, ADOBE_TECHNICAL_ACCOUNT_ID, ADOBE_PRIVATE_KEY
// npm install @adobe/pdfservices-node-sdk
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  return res.status(410).json({
    error: 'Adobe PDF route removed',
    message: 'This endpoint is deprecated. Files are now handled via Supabase Storage.',
  });
}
