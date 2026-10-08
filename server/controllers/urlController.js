import { createShortUrl, getUrlByShortCode, incrementClickCount } from '../services/urlService.js';

// Regex for basic URL validation
const isValidUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (e) {
    return false;
  }
};

export const shortenUrl = async (req, res, next) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ success: false, message: 'originalUrl is required' });
    }

    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({ success: false, message: 'Invalid URL. Only HTTP and HTTPS are supported.' });
    }

    const urlData = await createShortUrl(originalUrl);
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

    res.status(201).json({
      success: true,
      data: {
        id: urlData.id,
        originalUrl: urlData.original_url,
        shortCode: urlData.short_code,
        shortUrl: `${baseUrl}/${urlData.short_code}`,
        clicks: urlData.clicks
      }
    });
  } catch (error) {
    next(error);
  }
};

export const redirectUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    
    if (!shortCode) {
      return res.status(400).json({ success: false, message: 'shortCode is required' });
    }

    const urlData = await getUrlByShortCode(shortCode);

    if (!urlData) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    // Increment click count asynchronously
    incrementClickCount(urlData.id, urlData.clicks);

    // Redirect to original URL
    res.redirect(302, urlData.original_url);
  } catch (error) {
    next(error);
  }
};

export const getUrlStats = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    
    if (!shortCode) {
      return res.status(400).json({ success: false, message: 'shortCode is required' });
    }

    const urlData = await getUrlByShortCode(shortCode);

    if (!urlData) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        shortCode: urlData.short_code,
        originalUrl: urlData.original_url,
        clicks: urlData.clicks,
        createdAt: urlData.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};
