/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block expects: Header row, then each row: [title cell, content cell]
  // Titles are H2/H3s, content is everything after until next H2/H3 or end.
  // All work happens on the main article content.
  
  // Find main content section
  const main = element.querySelector('main#aws-page-content-main, main[role=main]');
  if (!main) return;
  const contentSection = main.querySelector('section.blog-post-content');
  if (!contentSection) return;

  // Find all H2/H3 top-level (direct children)
  const accordionTitles = Array.from(
    contentSection.querySelectorAll(':scope > h2, :scope > h3')
  );

  // If no h2/h3, nothing to accordion
  if (accordionTitles.length === 0) return;

  const rows = [['Accordion (accordion21)']];

  // For each title, grab its content until next H2/H3
  accordionTitles.forEach((titleEl, i) => {
    // collect all sibling elements after titleEl until next top-level h2/h3 or end
    const contentNodes = [];
    let sib = titleEl.nextElementSibling;
    while (
      sib &&
      !(sib.tagName === 'H2' || sib.tagName === 'H3')
    ) {
      contentNodes.push(sib);
      sib = sib.nextElementSibling;
    }
    // Only add row if there is content
    if (contentNodes.length > 0) {
      // Use the original title element and the array of content nodes
      rows.push([
        titleEl,
        contentNodes.length === 1 ? contentNodes[0] : contentNodes
      ]);
    }
  });

  // Only replace if we have at least one accordion section
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
