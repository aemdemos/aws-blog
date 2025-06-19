/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid of columns
  const grid = element.querySelector('.lb-xb-grid.lb-row-max-large');
  if (!grid) return;
  // Get the direct columns only
  const columns = Array.from(grid.children).filter(col => col.classList.contains('lb-xbcol'));

  // Prepare the array for each column's content
  const colContents = [];
  columns.forEach((col, idx) => {
    const colContent = [];
    // For each child of the column, keep if it is not an empty mbox
    Array.from(col.children).forEach(child => {
      if (
        child.classList && child.classList.contains('lb-mbox') && !child.textContent.trim() && !child.querySelector('a, button, span')
      ) return;
      colContent.push(child);
    });
    // For the last column, also add siblings after the columns grid (social + legal)
    if (idx === 4) {
      let afterGrid = grid.parentElement;
      let node = afterGrid.querySelector('.lb-xb-grid-wrap');
      while (node) {
        colContent.push(node);
        node = node.nextElementSibling;
        // Stop at the end
        if (node && !node.classList.contains('lb-xb-grid-wrap') && !node.classList.contains('lb-txt-normal')) break;
      }
      // Add the legal text (lb-txt-normal)
      const legal = afterGrid.querySelector('.lb-txt-normal');
      if (legal) colContent.push(legal);
    }
    colContents.push(colContent);
  });

  // Compose the table: header row (single cell), then row with N columns
  const cells = [
    ['Columns (columns10)'],
    colContents
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
