/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cardsNoImages5)'];
  const rows = [headerRow];

  // Normalize to an array of articles
  let articles = [];
  if (element.tagName === 'ARTICLE') {
    articles = [element];
  } else {
    articles = Array.from(element.querySelectorAll(':scope > article.blog-post'));
    if (!articles.length) {
      // fallback: treat direct children as candidates if no articles found
      articles = Array.from(element.children).filter(
        el => el.classList && el.classList.contains('blog-post')
      );
    }
  }

  articles.forEach(article => {
    // Get the right content column for the card (title, meta, excerpt)
    const contentCol = article.querySelector('.lb-row .lb-col.lb-mid-18.lb-tiny-24');
    if (!contentCol) return; // skip if missing

    // Remove share dialog as it's hidden/irrelevant
    const shareDialog = contentCol.querySelector('.blog-share-dialog');
    if (shareDialog) shareDialog.remove();

    // For semantic meaning, preserve the structure: h2 (with a link and span), meta/footer, and excerpt
    // Use the existing elements directly
    const elements = [];
    const title = contentCol.querySelector('h2');
    if (title) elements.push(title);
    const meta = contentCol.querySelector('footer');
    if (meta) elements.push(meta);
    const excerpt = contentCol.querySelector('section.blog-post-excerpt');
    if (excerpt) elements.push(excerpt);
    // Only add rows that have at least one meaningful element
    if (elements.length) {
      rows.push([elements]);
    }
  });

  // Only create the table if there's at least the header + one card row
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
