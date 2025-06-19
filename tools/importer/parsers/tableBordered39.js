/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main blog post article
  const blogContent = element.querySelector('.aws-blog-content') || element;
  const main = blogContent.querySelector('main#aws-page-content-main') || blogContent.querySelector('main');
  let article = main ? main.querySelector('article') : null;
  if (!article) {
    article = blogContent.querySelector('article');
  }
  if (!article) return;

  // Find the only relevant table in the article post content
  const table = article.querySelector('section.blog-post-content table');
  if (!table) return;

  // Prepare cells for block table: header row, then content rows (preserve HTML for formatting)
  const cells = [];
  // Block header row
  cells.push(['Table (bordered, tableBordered39)']);

  // For each row in the table, extract the cell content (not the <td> element itself!)
  for (const tr of table.rows) {
    const cellContents = Array.from(tr.cells).map(cell => {
      // If the cell has child nodes, use those (preserve elements and formatting)
      if (cell.childNodes.length === 1) {
        return cell.firstChild;
      } else if (cell.childNodes.length > 1) {
        return Array.from(cell.childNodes);
      } else {
        // fallback: empty string
        return '';
      }
    });
    cells.push(cellContents);
  }

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  table.replaceWith(block);
}