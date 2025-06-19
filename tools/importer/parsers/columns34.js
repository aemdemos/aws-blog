/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to select next element sibling matching selector
  function nextSiblingMatching(el, selector) {
    let sib = el && el.nextElementSibling;
    while (sib) {
      if (sib.matches(selector)) return sib;
      sib = sib.nextElementSibling;
    }
    return null;
  }

  // Get the main article section
  const main = element.querySelector('main#aws-page-content-main');
  if (!main) return;
  const articleSection = main.querySelector('section.blog-post-content');
  if (!articleSection) return;

  // 1. LEFT-TOP: Intro block (concise)
  // Use the first text paragraph + the first short list if present + first CTA link if present
  let firstP = null;
  let firstUl = null;
  let firstCTA = null;
  let pCount = 0;
  for (const child of articleSection.children) {
    // Find first non-empty <p> that is not totally italic/author
    if (!firstP && child.tagName === 'P' && child.textContent.replace(/\s+/g, '').length > 30 && !child.querySelector('em')) {
      firstP = child;
    }
    // Get the first <ul> that comes directly after the first suitable <p>
    if (firstP && !firstUl && child.tagName === 'UL') {
      firstUl = child;
    }
    // Find a CTA link in a paragraph (like 'AppDynamics' or 'Amazon CloudWatch')
    if (!firstCTA && child.querySelector) {
      const link = child.querySelector('a[href]');
      if (link && /appdynamics|cloudwatch|try|learn|join|contact/i.test(link.textContent)) {
        firstCTA = link;
      }
    }
    if (firstP && firstUl && firstCTA) break;
    // As fallback, scan at most first 7 children
    pCount++; if (pCount > 7) break;
  }
  // Fallbacks if not all found
  if (!firstP) firstP = articleSection.querySelector('p');
  if (!firstUl) firstUl = articleSection.querySelector('ul');
  if (!firstCTA) firstCTA = articleSection.querySelector('a[href]');

  const leftTopCell = [];
  if (firstP) leftTopCell.push(firstP);
  if (firstUl && (!firstP || firstUl !== nextSiblingMatching(firstP, 'ul'))) leftTopCell.push(firstUl);
  if (firstCTA) leftTopCell.push(firstCTA);

  // 2. RIGHT-TOP: Feature image (first large img, after intro block)
  // Look for the first large image in the article body that is not inside a table
  let rightTopImg = null;
  const images = Array.from(articleSection.querySelectorAll('img'));
  for (const img of images) {
    if (!img.closest('table')) {
      rightTopImg = img;
      break;
    }
  }
  // Fallback: first image at all
  if (!rightTopImg && images[0]) rightTopImg = images[0];

  // 3. LEFT-BOTTOM: Next major image (e.g. badge image)
  let leftBottomImg = null;
  if (images.length > 1) {
    leftBottomImg = images[1];
  } else if (images.length === 1) {
    leftBottomImg = images[0];
  }

  // 4. RIGHT-BOTTOM: A short summary or preview/CTA block from later in the article
  // Look for a paragraph with a link or summary-like wording
  let rightBottomCell = null;
  let previewP = null;
  for (const p of articleSection.querySelectorAll('p')) {
    if (/(just view|preview|learn|watch|contact|see|socializ|review|webinar|try|marketplace)/i.test(p.textContent) && p.querySelector('a')) {
      previewP = p;
      break;
    }
  }
  if (previewP) {
    rightBottomCell = document.createElement('div');
    rightBottomCell.appendChild(previewP.cloneNode(true));
  } else {
    // fallback: last paragraph with a link
    const ps = Array.from(articleSection.querySelectorAll('p'));
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i];
      if (p.querySelector('a')) {
        rightBottomCell = document.createElement('div');
        rightBottomCell.appendChild(p.cloneNode(true));
        break;
      }
    }
  }

  // Compose the table rows
  const cells = [
    ['Columns (columns34)'],
    [leftTopCell.filter(Boolean), rightTopImg],
    [leftBottomImg, rightBottomCell]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
