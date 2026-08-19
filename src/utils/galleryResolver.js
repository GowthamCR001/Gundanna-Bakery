// Dynamic Gallery Resolver utilizing Vite eager globbing
// Automatically discovers all current and future images added to src/assets/Items_image/Gallery_images/

const galleryGlob = import.meta.glob('/src/assets/Items_image/Gallery_images/*', { eager: true, import: 'default' });

/**
 * Dynamically loads and parses all images from src/assets/Items_image/Gallery_images.
 * Any new image added to that folder is automatically detected without code changes.
 */
export function getGalleryImages() {
  const entries = Object.entries(galleryGlob);

  return entries.map(([filepath, url], index) => {
    const filename = filepath.split('/').pop();
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

    // Format human readable title
    let title = nameWithoutExt;
    if (/^gallery[_-]?image\s*\d+$/i.test(nameWithoutExt)) {
      const match = nameWithoutExt.match(/\d+/);
      const num = match ? match[0] : index + 1;
      title = `Custom Birthday Cake #${num}`;
    } else {
      title = nameWithoutExt
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    return {
      id: `gallery-${index + 1}-${filename}`,
      filename,
      title,
      category: 'Custom Birthday Cake',
      url
    };
  });
}
