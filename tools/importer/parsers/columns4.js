/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost <footer> element containing the actual footer content
  const footer = element.querySelector('footer');
  if (!footer) return;

  // Find the main grid container inside the footer (holds the columns)
  let mainGrid = null;
  const gridCandidates = footer.querySelectorAll('[data-rg-n="Grid"]');
  for (const grid of gridCandidates) {
    if (grid.parentElement && grid.parentElement.getAttribute('data-rg-n') === 'GridStack') {
      mainGrid = grid;
      break;
    }
  }
  if (!mainGrid) return;

  // Get all the direct child columns inside the main grid
  // Only take the first 4, as per the visual layout and the example
  // These are usually the main navigation columns
  const columns = Array.from(mainGrid.querySelectorAll(':scope > div[data-rg-n="Col"]'));
  // Find only the first 4 columns for the block (as in the example)
  const columns4 = columns.slice(0, 4);
  if (columns4.length === 0) return;

  // Compose table rows
  const rows = [
    ['Columns (columns4)'], // header row, one cell
    columns4 // second row, 4 columns, one per column
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
