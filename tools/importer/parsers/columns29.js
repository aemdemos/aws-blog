/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main blog content area
  const mainContent = element.querySelector('main#aws-page-content-main');
  if (!mainContent) return;

  // The tables are inside <section class="blog-post-content ...">
  const section = mainContent.querySelector('section.blog-post-content');
  if (!section) return;

  // Find all tables in the section
  const tables = Array.from(section.querySelectorAll('table'));
  if (tables.length < 3) return;

  // Detach the tables from their parent before creating the new table
  // This avoids DOM hierarchy errors
  const t0 = tables[0];
  const t1 = tables[1];
  const t2 = tables[2];
  t0.parentNode.removeChild(t0);
  t1.parentNode.removeChild(t1);
  t2.parentNode.removeChild(t2);

  // Compose the block table: header must be a single cell (array of length 1)
  const blockHeader = ['Columns (columns29)'];
  const blockRow = [[t0, t1, t2]]; // single array for the second row with 3 cells

  // Flatten second row into the number of columns
  const cells = [
    blockHeader,
    [t0, t1, t2]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
