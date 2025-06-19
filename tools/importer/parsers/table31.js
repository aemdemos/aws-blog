/* global WebImporter */
export default function parse(element, { document }) {
  // Try to find a proper <table> element first
  const allTables = element.getElementsByTagName('table');
  let dataNode = null;

  // We expect the table to have 3 columns if present
  for (let i = 0; i < allTables.length; i++) {
    const ths = allTables[i].querySelectorAll('thead th');
    if (ths.length === 3) {
      const headerTexts = Array.from(ths).map(th => th.textContent.trim().toLowerCase());
      if (
        (headerTexts[0].includes('city') && headerTexts[1].includes('country')) ||
        (headerTexts[0].includes('traffic flow') && headerTexts[1].includes('traffic type'))
      ) {
        dataNode = allTables[i];
        break;
      }
    }
  }

  // If no matching <table> found, look for an <img> that appears to be a table screenshot
  if (!dataNode) {
    // Look for an image that likely represents the table (e.g. class contains 'wp-image' or 'aligncenter')
    const imgs = element.getElementsByTagName('img');
    for (let i = 0; i < imgs.length; i++) {
      const img = imgs[i];
      const className = img.getAttribute('class') || '';
      if (
        className.includes('wp-image') ||
        className.includes('aligncenter') ||
        img.getAttribute('src')
      ) {
        dataNode = img;
        break;
      }
    }
  }

  // If we found a table or image, create the block table
  if (dataNode) {
    const blockHeader = ['Table (table31)'];
    const blockCells = [
      blockHeader,
      [dataNode]
    ];
    const blockTable = WebImporter.DOMUtils.createTable(blockCells, document);
    element.replaceWith(blockTable);
  }
}
