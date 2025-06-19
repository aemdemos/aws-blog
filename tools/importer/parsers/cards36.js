/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per specification
  const cells = [['Cards (cards36)']];

  // Find the card grid
  const grid = element.querySelector('.lb-xb-grid');
  if (!grid) return;

  const cards = Array.from(grid.children).filter(child => child.classList.contains('lb-xbcol'));

  // For each card, extract the image, heading, description, and CTA as present
  cards.forEach(card => {
    // First cell: image (as <img> element), or blank if not found
    let imageEl = '';
    const img = card.querySelector('figure img');
    if (img) imageEl = img;

    // Second cell: heading, description, CTA as present
    const textFragments = [];
    // Heading (h4 or h3)
    const heading = card.querySelector('h4, h3');
    if (heading) textFragments.push(heading);

    // Description (div.lb-rtxt or p inside it)
    const descWrap = card.querySelector('.lb-rtxt');
    if (descWrap) {
      // Some cases just have <p>, others more HTML; include the wrapper
      textFragments.push(descWrap);
    }

    // CTA (a with lb-txt-blue-600)
    const cta = card.querySelector('a.lb-txt-blue-600');
    if (cta) textFragments.push(cta);

    cells.push([imageEl, textFragments]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
