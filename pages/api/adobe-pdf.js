// Adobe PDF Services API integration
// This is a Next.js API route that securely handles Adobe PDF Services API calls

// Real Adobe PDF Services integration entrypoint
// Requires env: ADOBE_CLIENT_ID, ADOBE_CLIENT_SECRET, ADOBE_ORG_ID, ADOBE_TECHNICAL_ACCOUNT_ID, ADOBE_PRIVATE_KEY
// npm install @adobe/pdfservices-node-sdk
import * as PDFServicesSdk from '@adobe/pdfservices-node-sdk';
import { Readable } from 'stream';

function dataUrlToBuffer(dataUrl) {
  const comma = dataUrl.indexOf(',');
  if (comma === -1) throw new Error('Invalid data URL');
  const base64 = dataUrl.slice(comma + 1);
  return Buffer.from(base64, 'base64');
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, pdfData, fileName } = req.body || {};

    // Log the request (for debugging)
    console.log(`Processing PDF action: ${action}, fileName: ${fileName}`);

    // Guard: ensure SDK is available
    if (!PDFServicesSdk || !PDFServicesSdk.Credentials || !PDFServicesSdk.PDFProperties) {
      return res.status(501).json({ success: false, error: 'Adobe SDK not installed or incompatible. Run: npm install @adobe/pdfservices-node-sdk' });
    }

    // Only support explicit real actions. No simulation.
    switch (action) {
      case 'analyze': {
        // Validate env presence for Service Principal (OAuth) flow
        const required = ['ADOBE_CLIENT_ID','ADOBE_CLIENT_SECRET'];
        const missing = required.filter((k) => !process.env[k]);
        if (missing.length) {
          return res.status(501).json({ success: false, error: 'Adobe credentials not configured', missing });
        }

        if (!pdfData || !fileName) {
          return res.status(400).json({ success: false, error: 'Missing pdfData or fileName' });
        }

        try {
          // Build credentials from service principal (OAuth2) env vars
          const credentials = PDFServicesSdk.Credentials
            .servicePrincipalCredentialsBuilder()
            .withClientId(process.env.ADOBE_CLIENT_ID)
            .withClientSecret(process.env.ADOBE_CLIENT_SECRET)
            .build();

          const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

          // We'll use the PDF Properties API to get document metadata
          const PDFProps = PDFServicesSdk.PDFProperties;
          const inputBuffer = dataUrlToBuffer(pdfData);
          const stream = Readable.from(inputBuffer);
          const inputRef = PDFServicesSdk.FileRef.createFromStream(stream, 'application/pdf');

          const operation = PDFProps.PDFPropertiesOperation.createNew();
          operation.setInput(inputRef);

          const result = await operation.execute(executionContext);
          const props = await result.getJSON();

          return res.status(200).json({
            success: true,
            metadata: {
              analyzedBy: 'Adobe PDF Services API',
              fileName,
              properties: props,
            },
          });
        } catch (err) {
          console.error('Adobe analyze error:', err);
          return res.status(502).json({ success: false, error: 'Adobe analyze failed', details: err.message });
        }
      }
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error processing PDF:', error);
    return res.status(500).json({ error: 'Error processing PDF', details: error.message });
  }
}
