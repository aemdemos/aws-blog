/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row that contains the columns
  const row = element.querySelector('.lb-row.lb-snap');
  if (!row) return;
  const cols = Array.from(row.querySelectorAll(':scope > div'));

  // We'll aim for 3 columns for columns3 block
  // Col 0: image
  // Col 1: title + meta
  // Col 2: excerpt/description
  let imgEl = null;
  let titleEl = null;
  let metaEl = null;
  let excerptEl = null;

  // Get img from first col
  if (cols[0]) {
    imgEl = cols[0].querySelector('img');
  }

  if (cols[1]) {
    // Title
    titleEl = cols[1].querySelector('h2');
    // Post meta
    metaEl = cols[1].querySelector('footer');
    // Excerpt
    excerptEl = cols[1].querySelector('section');
  }

  // Structure: [img], [title+meta], [excerpt]
  const col1 = imgEl ? [imgEl] : [];
  const col2 = [];
  if (titleEl) col2.push(titleEl);
  if (metaEl) col2.push(metaEl);
  const col3 = excerptEl ? [excerptEl] : [];

  // Build table as per columns3: header row, then a row of 3 columns
  const headerRow = ['Columns (columns3)'];
  const contentRow = [col1, col2, col3];
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
