import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import urlRoutes from './routes/urlRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js';
import { redirectUrl } from './controllers/urlController.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: frontendUrl
}));
app.use(express.json());

// Routes
app.use('/api/urls', urlRoutes);
app.use('/api/playlists', playlistRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasSupabaseUrl = !!process.env.SUPABASE_URL;
  const hasSupabaseKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasSupabaseUrl || !hasSupabaseKey) {
    return res.status(200).json({
      success: true,
      status: 'NEEDS CONFIGURATION',
      message: 'Micro-URL API is running, but missing user-provided Supabase credentials (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)'
    });
  }

  res.status(200).json({
    success: true,
    status: 'READY',
    message: 'Micro-URL API is running and Supabase credentials are provided'
  });
});

// Redirect endpoint for short URLs
app.get('/:shortCode', redirectUrl);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
