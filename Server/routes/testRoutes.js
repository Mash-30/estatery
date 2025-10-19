import express from 'express';

const router = express.Router();

// Test route to verify CORS is working
router.get('/cors-test', (req, res) => {
  res.json({
    message: 'CORS is working!',
    origin: req.get('Origin') || 'No origin header',
    timestamp: new Date().toISOString(),
    headers: {
      'Access-Control-Allow-Origin': req.get('Origin') || '*',
      'Access-Control-Allow-Credentials': 'true'
    }
  });
});

// Preflight test route
router.options('/cors-test', (req, res) => {
  res.status(200).end();
});

export default router;
