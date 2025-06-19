/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main blog article content
  const article = element.querySelector('main article');
  if (!article) return;
  const section = article.querySelector('section.blog-post-content');
  if (!section) return;

  // Find all <p> elements with image for cards (each card description paragraph has an <img>)
  const cardParagraphs = Array.from(section.querySelectorAll('p')).filter(p => p.querySelector('img'));

  const rows = [['Cards (cards30)']];

  cardParagraphs.forEach((p) => {
    // Card image
    const img = p.querySelector('img');

    // Find title: strong or b, possibly containing an <a>
    let title;
    let isLinkTitle = false;
    let titleLink = null;
    let titleText = '';
    const strongOrB = p.querySelector('strong, b');
    if (strongOrB) {
      const a = strongOrB.querySelector('a');
      if (a) {
        // Use only the <a> as title (with all its attributes/text)
        title = a;
        isLinkTitle = true;
        titleLink = a;
        titleText = a.textContent.trim();
      } else {
        title = strongOrB;
        titleText = strongOrB.textContent.trim();
      }
    } else {
      // Fallback: if no <strong> or <b> at all
      title = null;
    }

    // Description: all nodes after the first <br>
    const br = p.querySelector('br');
    let descNodes = [];
    if (br) {
      let n = br.nextSibling;
      while (n) {
        descNodes.push(n);
        n = n.nextSibling;
      }
    }
    // If no <br> found, fallback to all childNodes minus title/image
    if (!br) {
      descNodes = Array.from(p.childNodes).filter(node => {
        if (node.nodeType === 1 && node.tagName === 'IMG') return false;
        if (node.nodeType === 1 && (node === strongOrB)) return false;
        return true;
      });
    }
    // Remove empty/duplicated <a> nodes matching the title text
    descNodes = descNodes.filter(node => {
      if (node.nodeType === 1 && node.tagName === 'A') {
        const aText = node.textContent.trim();
        // Remove <a> if its text matches the title (already output as title), or it's empty
        if ((isLinkTitle && aText === titleText) || aText === '') return false;
      }
      return true;
    });

    // Compose the right cell: title (as <a> or <strong>), <br>, then description nodes (if any)
    const textCell = [];
    if (title) {
      textCell.push(title);
      // Only add <br> if there is at least one non-empty desc node
      if (descNodes.some(node => (node.textContent || '').trim() !== '')) {
        textCell.push(document.createElement('br'));
      }
    }
    if (descNodes.length && descNodes.some(node => (node.textContent || '').trim() !== '')) {
      textCell.push(...descNodes);
    }
    rows.push([
      img,
      textCell
    ]);
  });

  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  section.parentNode.replaceChild(table, section);
}
