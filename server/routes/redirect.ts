import { Request, Response } from 'express';

// Simple in-memory store for demo (in production, use a database)
const shortLinks = new Map<string, string>();

export function handleShortLink(req: Request, res: Response) {
  const { code } = req.params;
  
  if (!code) {
    return res.status(400).json({ error: 'Short code required' });
  }

  // For invitation links, we can reconstruct the token from the short code
  // In a real app, you'd store this mapping in a database
  const storedToken = shortLinks.get(code);
  
  if (storedToken) {
    // Redirect to the full join page with token
    const redirectUrl = `/join?token=${storedToken}`;
    return res.redirect(302, redirectUrl);
  }

  // If not found in store, try to find it by reconstructing from code
  // This is a fallback for demo purposes
  console.log(`🔗 Short link accessed: ${code}`);
  
  // For demo, redirect to join page and let the frontend handle validation
  return res.redirect(302, `/join?ref=${code}`);
}

export function createShortLink(token: string): string {
  const shortCode = token.substring(0, 8).toLowerCase();
  shortLinks.set(shortCode, token);
  return shortCode;
}

export function getStoredToken(code: string): string | undefined {
  return shortLinks.get(code);
}
