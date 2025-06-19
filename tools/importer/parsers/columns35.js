/* global WebImporter */
export default function parse(element, { document }) {
  // Find main blog area and sidebar columns
  const main = element.querySelector('main#aws-page-content-main');
  const sidebar = element.querySelector('.blog-sidebar');

  // Defensive: ensure there is content to render
  if (!main && !sidebar) return;

  // The main column: only the article itself, or fallback to main content
  let article = main ? main.querySelector('article.blog-post') : null;
  if (!article && main) article = main;

  // Only include columns that exist
  const columns = [];
  if (article) columns.push(article);
  if (sidebar) columns.push(sidebar);

  // Table rows: header and content row (with one cell per logical column)
  const headerRow = ['Columns (columns35)'];
  const contentRow = columns;

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
