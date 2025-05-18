// publishUtils.js - Add this utility file

/**
 * Generates a URL-friendly slug from a title
 */
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-'); // Remove leading/trailing hyphens
};

/**
 * Publishes a page and saves it to localStorage
 */
export const publishPage = (pageData) => {
  try {
    // Generate a unique slug
    let baseSlug = generateSlug(pageData.title || 'untitled-page');
    let slug = baseSlug;
    let counter = 1;

    // Get existing pages
    const existingPages = JSON.parse(localStorage.getItem('theend_pages') || '{}');

    // Ensure slug is unique
    while (existingPages[slug]) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Prepare page data with metadata
    const publishedPage = {
      ...pageData,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      votes: 0,
      published: true
    };

    // Save to localStorage
    existingPages[slug] = publishedPage;
    localStorage.setItem('theend_pages', JSON.stringify(existingPages));

    // Also save to sessionStorage for immediate access
    sessionStorage.setItem(`theend_page_${slug}`, JSON.stringify(publishedPage));

    console.log('Page published successfully:', slug);

    return {
      success: true,
      slug,
      url: `/page/${slug}`,
      fullUrl: `${window.location.origin}/page/${slug}`
    };
  } catch (error) {
    console.error('Error publishing page:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Gets a published page by slug
 */
export const getPublishedPage = (slug) => {
  try {
    const pages = JSON.parse(localStorage.getItem('theend_pages') || '{}');
    return pages[slug] || null;
  } catch (error) {
    console.error('Error retrieving page:', error);
    return null;
  }
};

/**
 * Gets all published pages
 */
export const getAllPublishedPages = () => {
  try {
    const pages = JSON.parse(localStorage.getItem('theend_pages') || '{}');
    return Object.values(pages).sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch (error) {
    console.error('Error retrieving pages:', error);
    return [];
  }
};

/**
 * Deletes a published page
 */
export const deletePublishedPage = (slug) => {
  try {
    const pages = JSON.parse(localStorage.getItem('theend_pages') || '{}');
    
    if (pages[slug]) {
      delete pages[slug];
      localStorage.setItem('theend_pages', JSON.stringify(pages));
      
      // Also remove from sessionStorage
      sessionStorage.removeItem(`theend_page_${slug}`);
      
      return { success: true };
    }
    
    return { success: false, error: 'Page not found' };
  } catch (error) {
    console.error('Error deleting page:', error);
    return { success: false, error: error.message };
  }
};