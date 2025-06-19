/* global WebImporter */
export default function parse(element, { document }) {
  // Find the primary grid with the columns (one per main section)
  const mainGrid = element.querySelector(':scope > .lb-xb-grid');
  if (!mainGrid) return;
  // Get all top-level columns
  const columns = Array.from(mainGrid.querySelectorAll(':scope > .lb-xbcol'));
  if (columns.length === 0) return;
  // Prepare the block table
  const cells = [];
  cells.push(['Columns (columns6)']); // Header row, exactly as in the instructions
  const contentRow = columns.map(col => col);
  cells.push(contentRow);
  // Create the table and replace the block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
