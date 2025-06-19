/* global WebImporter */
export default function parse(element, { document }) {
  // Hero block: image and heading in one table, 1 column, 3 rows
  // 1. Find the hero image (DNA helix image)
  // 2. Find the heading (main headline)
  // 3. Compose the table as in the example markdown

  // Find <main> for the central blog content
  const main = element.querySelector('main');
  let heroImg = null;
  let heading = null;

  if (main) {
    // Look for the article
    const article = main.querySelector('article');
    if (article) {
      // Try image inside .blog-post-content
      const postContent = article.querySelector('.blog-post-content');
      if (postContent) {
        // The hero/design image is the first image in the content
        heroImg = postContent.querySelector('img');
      }
      // The main heading is the one with class .blog-post-title (usually an h1)
      heading = article.querySelector('.blog-post-title');
    }
  }

  // Fallback for the hero image: use meta[property="image"]
  if (!heroImg && main) {
    const article = main.querySelector('article');
    if (article) {
      const metaImg = article.querySelector('meta[property="image"]');
      if (metaImg && metaImg.content) {
        const img = document.createElement('img');
        img.src = metaImg.content;
        img.alt = '';
        heroImg = img;
      }
    }
  }

  // Compose the table rows exactly as in the example
  // 1st row: header
  // 2nd row: image (or '')
  // 3rd row: heading (or '')
  const rows = [];
  rows.push(['Hero']);
  rows.push([heroImg || '']);
  rows.push([heading || '']);

  // Build table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the full element with the hero table
  element.replaceWith(table);
}
