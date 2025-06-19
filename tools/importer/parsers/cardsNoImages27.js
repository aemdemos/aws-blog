/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <main> element containing the blog article
  const main = element.querySelector('main');
  if (!main) return;
  const article = main.querySelector('article');
  if (!article) return;

  // Author cards are the <footer> elements with .blog-author-box
  const authorFooters = Array.from(article.querySelectorAll('footer'))
    .filter(footer => footer.querySelector('.blog-author-box'));

  // Each card: author name (h3.lb-h4), bio (first <p> with content)
  // Reference existing elements directly
  const cards = authorFooters.map(footer => {
    const cardBox = footer.querySelector('.blog-author-box');
    if (!cardBox) return null;
    const heading = cardBox.querySelector('h3.lb-h4');
    // Find first non-empty <p>
    const paragraphs = Array.from(cardBox.querySelectorAll('p'));
    const description = paragraphs.find(p => p.textContent.trim().length > 0);
    // Compose the card cell as an array of referenced elements
    const cardCell = [];
    if (heading) cardCell.push(heading);
    if (description) cardCell.push(description);
    return [cardCell];
  }).filter(row => row && row[0].length > 0);

  // Compose table: header row, one row per card
  const headerRow = ['Cards (cardsNoImages27)'];
  const tableRows = [headerRow, ...cards];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}