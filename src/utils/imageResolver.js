// Utility to resolve item images from src/assets/Items_image using Vite eager globbing

const localImages = import.meta.glob('/src/assets/Items_image/*', { eager: true, import: 'default' });

// Helper to normalize string for fuzzy matching
export function normalizeName(str) {
  if (!str) return '';
  // Remove file extension if present
  const base = str.replace(/\.[^/.]+$/, '');
  return base
    .replace(/\s*\([\u0C80-\u0CFF\s]+\)\s*/g, '') // Remove Kannada in parentheses
    .replace(/\s*\([^)]*\)/g, '') // Remove quantity details like (250g), (5 Pcs), etc.
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
}

// Map normalized keys to asset URLs
const imageMap = new Map();
Object.entries(localImages).forEach(([filepath, url]) => {
  const filename = filepath.split('/').pop();
  const normalizedKey = normalizeName(filename);
  imageMap.set(normalizedKey, url);
});

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80';

/**
 * Resolves the appropriate image URL for a bakery menu item.
 * Checks local assets in src/assets/Items_image first, falling back to remote URL or default image.
 */
export function getItemImage(item) {
  if (!item) return DEFAULT_FALLBACK;

  // 1. Check if item.image matches a local asset filename directly
  if (item.image) {
    const imgKey = normalizeName(item.image);
    if (imageMap.has(imgKey)) {
      return imageMap.get(imgKey);
    }
  }

  // 2. Check if item.name matches a local asset filename
  if (item.name) {
    const nameKey = normalizeName(item.name);
    if (imageMap.has(nameKey)) {
      return imageMap.get(nameKey);
    }

    // 3. Partial / substring match
    for (const [key, url] of imageMap.entries()) {
      if (key && nameKey && (key === nameKey || key.includes(nameKey) || nameKey.includes(key))) {
        return url;
      }
    }
  }

  // 4. If item.image is a full remote URL (http/https), return it
  if (item.image && (item.image.startsWith('http://') || item.image.startsWith('https://'))) {
    return item.image;
  }

  return DEFAULT_FALLBACK;
}

/**
 * Enriches array of menu items with resolved image URLs.
 */
export function resolveMenuImages(menuItems) {
  if (!Array.isArray(menuItems)) return [];
  return menuItems.map(item => ({
    ...item,
    image: getItemImage(item)
  }));
}
