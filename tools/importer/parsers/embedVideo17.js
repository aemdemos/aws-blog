/* global WebImporter */
export default function parse(element, { document }) {
  // Find the <p> that has a link to the video (the success story video)
  const videoParagraph = Array.from(element.querySelectorAll('p')).find(p => {
    const a = p.querySelector('a');
    return a && a.href && a.href.includes('pages.awscloud.com/apn-tv-728.html');
  });
  if (!videoParagraph) return;

  // Extract the image (poster) and the video link
  const a = videoParagraph.querySelector('a');
  const img = videoParagraph.querySelector('img');

  // Compose the table cell content: image (if present) above link
  const cellContent = [];
  if (img) cellContent.push(img);
  if (a && a.href) {
    // Render a link to the video URL below the image
    const link = document.createElement('a');
    link.href = a.href;
    link.textContent = a.href;
    cellContent.push(document.createElement('br'), link);
  }

  const cells = [
    ['Embed (embedVideo17)'],
    [cellContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original paragraph (the one containing the video) with the new table
  videoParagraph.replaceWith(table);
}
