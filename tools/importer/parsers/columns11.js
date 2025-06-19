/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area
  const main = element.querySelector('main#aws-page-content-main');
  if (!main) return;
  const article = main.querySelector('article.blog-post');
  if (!article) return;
  const content = article.querySelector('section.blog-post-content');
  if (!content) return;

  // Find the first large diagram image and its <p>
  let diagramImg = null, diagramP = null;
  const imgs = content.querySelectorAll('img');
  for (const img of imgs) {
    const w = parseInt(img.getAttribute('width') || '0', 10);
    const h = parseInt(img.getAttribute('height') || '0', 10);
    if (w > 400 && h > 200) {
      diagramImg = img;
      diagramP = img.closest('p');
      break;
    }
  }

  // Find the <ul> (service list) before the diagram intro line
  let col1Content = [];
  let col2Content = [];
  let reachedList = false, finishedCol1 = false;
  for (const node of Array.from(content.children)) {
    // Stop at the <p> that directly precedes the diagram <p>
    // The structure (from prompt) is: ... <ul> (service list), <p> (intro to diagram), <p> (diagram)
    if (!finishedCol1) {
      if (node.tagName === 'UL') {
        reachedList = true;
        col1Content.push(node);
      } else if (reachedList && node.tagName === 'P' && diagramP && node.nextElementSibling === diagramP) {
        // This is the <p> right before diagram, skip it and stop collecting for col1
        finishedCol1 = true;
      } else if (!reachedList) {
        col1Content.push(node);
      }
    }
  }

  // Column 2: diagram image and, if present, its caption/step paragraph after the diagram
  if (diagramImg) {
    col2Content.push(diagramImg);
    if (diagramP && diagramP.nextElementSibling && diagramP.nextElementSibling.tagName === 'P') {
      col2Content.push(diagramP.nextElementSibling);
    }
  }

  // If col1Content is empty (edge case), put all up to diagramP except the <p> before diagramP
  if (col1Content.length === 0 && diagramP) {
    for (const node of Array.from(content.children)) {
      if (node === diagramP) break;
      col1Content.push(node);
    }
    // Remove the last <p> if present (the diagram-intro line)
    if (col1Content.length && col1Content[col1Content.length - 1].tagName === 'P') {
      col1Content.pop();
    }
  }

  // Build and replace the table
  const headerRow = ['Columns (columns11)'];
  const contentRow = [col1Content, col2Content];
  const rows = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
