/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main area
  const main = element.querySelector('main');
  if (!main) return;
  const article = main.querySelector('article');
  if (!article) return;
  // The first .js-mbox contains the columns
  const mbox = article.querySelector('.js-mbox');
  if (!mbox) return;
  const grid = mbox.querySelector('.lb-xb-grid');
  if (!grid) return;
  // Get the column wrappers
  const columns = Array.from(grid.querySelectorAll(':scope > .lb-xbcol'));
  // For each column, find the .lb-border-p content
  const colCells = columns.map(col => {
    // Look for the .lb-border-p direct child
    for (let i = 0; i < col.children.length; i++) {
      if (col.children[i].classList && col.children[i].classList.contains('lb-border-p')) {
        return col.children[i];
      }
    }
    // fallback: if nothing is found, skip this column (do not return null)
    return '';
  });
  // Remove empty strings to avoid blank/null cells
  const filteredCells = colCells.filter(cell => cell && typeof cell !== 'string');
  if (!filteredCells.length) return;
  const cells = [
    ['Columns (columns16)'],
    filteredCells
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  mbox.replaceWith(block);
}
