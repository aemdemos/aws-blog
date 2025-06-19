/* global WebImporter */
export default function parse(element, { document }) {
  // Find the sidebar
  const sidebar = element.querySelector('.blog-sidebar');
  if (!sidebar) return;

  // Find the main sidebar cards: Resources/Follow and AWS Events
  const awsmDivs = sidebar.querySelectorAll('.awsm');
  let resourcesBox = null;
  let followBox = null;
  let eventsBox = null;

  // First .awsm contains the Resources and Follow cards
  if (awsmDivs.length > 0) {
    // The first .lb-box with padding is the container for Resources and Follow
    resourcesBox = awsmDivs[0].querySelector('.lb-box');
    if (resourcesBox) {
      // Find the two h3 elements (Resources and Follow)
      const h3s = resourcesBox.querySelectorAll('h3');
      // For Resources, get h3 and following .data-attr-wrapper
      let resourcesSection = null;
      if (h3s[0]) {
        resourcesSection = document.createElement('div');
        resourcesSection.appendChild(h3s[0]);
        const resourcesWrapper = h3s[0].nextElementSibling;
        if (resourcesWrapper) resourcesSection.appendChild(resourcesWrapper);
      }
      // For Follow, get h3 and following .data-attr-wrapper
      let followSection = null;
      if (h3s[1]) {
        followSection = document.createElement('div');
        followSection.appendChild(h3s[1]);
        const followWrapper = h3s[1].nextElementSibling;
        if (followWrapper) followSection.appendChild(followWrapper);
      }
      // Assign columns
      resourcesBox = resourcesSection;
      followBox = followSection;
    }
  }
  // Second .awsm contains the AWS Events card
  if (awsmDivs.length > 1) {
    const events = awsmDivs[1].querySelector('.lb-border-p.lb-has-link');
    if (events) {
      eventsBox = document.createElement('div');
      eventsBox.appendChild(events);
    }
  }

  // Compose the columns for the block
  const columns = [];
  if (resourcesBox) columns.push(resourcesBox);
  if (followBox) columns.push(followBox);
  if (eventsBox) columns.push(eventsBox);
  if (columns.length === 0) return;

  // Compose the block table
  // The header row must be a single column
  const headerRow = ['Columns (columns24)'];
  const cells = [headerRow, columns]; // headerRow: 1 col, columns: N cols in one row
  const table = WebImporter.DOMUtils.createTable(cells, document);

  sidebar.replaceWith(table);
}
