/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the section with three promo cards: under article > .js-mbox > .awsm > .lb-xb-grid
  const promoGrid = element.querySelector('article .js-mbox .lb-xb-grid');
  if (!promoGrid) return;

  // Get all direct column elements (should be 3)
  const cols = Array.from(promoGrid.querySelectorAll(':scope > .lb-xbcol'));
  const cells = cols.map(col => {
    // Each column should contain a .lb-border-p (the promo card)
    const promo = col.querySelector(':scope > .lb-border-p');
    // Defensive: if no promo, keep column empty
    return promo ? promo : '';
  });

  // Compose the table rows as per Columns (columns14) block
  const tableRows = [
    ['Columns (columns14)'],
    cells
  ];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  promoGrid.replaceWith(table);
}
