import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

// Import API handlers
import valuationHandler from './api/valuation.ts';
import stripeWebhookHandler from './api/stripe-webhook.ts';
import createCheckoutSessionHandler from './api/create-checkout-session.ts';
import generateAnalysisHandler from './api/generate-analysis.ts';
import runAnalysisHandler from './api/run-analysis.ts';
import createBillingPortalHandler from './api/create-billing-portal.ts';
import createSubscriptionSessionHandler from './api/create-subscription-session.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Map API routes
  app.all('/api/valuation', express.json(), (req, res) => valuationHandler(req as any, res as any));
  app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), (req, res) => stripeWebhookHandler(req as any, res as any));
  app.all('/api/create-checkout-session', express.json(), (req, res) => createCheckoutSessionHandler(req as any, res as any));
  app.all('/api/generate-analysis', express.json(), (req, res) => generateAnalysisHandler(req as any, res as any));
  app.all('/api/run-analysis', express.json(), (req, res) => runAnalysisHandler(req as any, res as any));
  app.all('/api/create-billing-portal', express.json(), (req, res) => createBillingPortalHandler(req as any, res as any));
  app.all('/api/create-subscription-session', express.json(), (req, res) => createSubscriptionSessionHandler(req as any, res as any));

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
