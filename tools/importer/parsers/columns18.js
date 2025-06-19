/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the section containing the three promo tiles (columns block)
  const jsMbox = element.querySelector('.js-mbox[data-mbox="en_blog_post_comments"]');
  if (!jsMbox) return;
  const grid = jsMbox.querySelector('.lb-xb-grid');
  if (!grid) return;
  // Each promo tile is one column
  const tileCols = Array.from(grid.querySelectorAll(':scope > .lb-xbcol'));
  const tiles = tileCols.map(col => {
    // The whole column cell (with link, image, text, etc)
    const box = col.querySelector('.lb-box.lb-has-link');
    // If for any reason a tile is missing, just return an empty div
    return box || document.createElement('div');
  });
  // Header row must match exactly
  const headerRow = ['Columns (columns18)'];
  // The second row has one cell per column/tile, each containing one original promo tile
  const contentRow = tiles;
  // Create table as per structure
  const cells = [
    headerRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the promo tiles block with the new table
  jsMbox.replaceWith(table);
}
