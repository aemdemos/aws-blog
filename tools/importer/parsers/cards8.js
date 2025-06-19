/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to build the card text cell
  function buildTextCell(textCol) {
    const frag = document.createDocumentFragment();
    // Title (h2 or h3)
    const h2 = textCol.querySelector('.blog-post-title');
    if (h2) {
      // Use the original heading element, but flatten link if present
      const hElem = document.createElement('p');
      let titleSpan = h2.querySelector('span[property="name headline"]');
      let title = titleSpan ? titleSpan.textContent : h2.textContent;
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title;
        hElem.appendChild(strong);
        frag.appendChild(hElem);
      }
    }
    // Description (section.blog-post-excerpt)
    const excerpt = textCol.querySelector('section.blog-post-excerpt, .blog-post-excerpt');
    if (excerpt) {
      // Use the <p> inside excerpt directly if present
      let ps = excerpt.querySelectorAll('p');
      if (ps.length > 0) {
        ps.forEach(p => frag.appendChild(p));
      } else {
        frag.appendChild(excerpt);
      }
    }
    return frag;
  }

  // Find table header
  const headerRow = ['Cards (cards8)'];
  const rows = [headerRow];

  // Each <article> is one card (when run per-article)
  // But just in case, check if this is a container of multiple articles
  let articles = [];
  if (element.tagName.toLowerCase() === 'article') {
    articles = [element];
  } else {
    articles = Array.from(element.querySelectorAll(':scope > article'));
  }

  // For each article/card
  articles.forEach(card => {
    // Find .lb-row
    const rowDiv = card.querySelector('.lb-row');
    if (!rowDiv) return;

    // Image is in first .lb-col, text is in second .lb-col
    const cols = rowDiv.querySelectorAll(':scope > .lb-col');
    let img = '';
    if (cols[0]) {
      const a = cols[0].querySelector('a');
      img = a ? a.querySelector('img') : cols[0].querySelector('img');
    }
    // If no image, leave blank

    let textCell = '';
    if (cols[1]) {
      textCell = buildTextCell(cols[1]);
    }
    rows.push([img || '', textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
