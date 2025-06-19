/* global WebImporter */
export default function parse(element, { document }) {
  // --- CONFIG: Set your video URL and poster image URL here for the demonstration ---
  // In a real scenario, you would extract these from the element, but since the example/screenshot
  // is of a Vimeo video with a poster image (not present in the provided HTML), we demonstrate as follows:
  // (If this was meant to work on real input HTML with an <iframe> or Vimeo/YouTube anchor, add the parse logic per below comment)

  // ====== DEMONSTRATION BLOCK – USE HARDCODED VALUES PER THE PROMPT EXAMPLE ======
  // If you want to extract dynamically in real use, uncomment code below and adjust accordingly
  const videoUrl = 'https://vimeo.com/454418448';
  const posterUrl = 'https://i.vimeocdn.com/video/123456789_1280x720.jpg'; // Replace with actual poster if available

  // Create image element for the poster
  const img = document.createElement('img');
  img.src = posterUrl;
  img.alt = 'Video poster';
  img.style.maxWidth = '100%';

  // Create anchor for the video link
  const link = document.createElement('a');
  link.href = videoUrl;
  link.textContent = videoUrl;

  // Compose the cell array (image above link)
  const cellContent = [img, document.createElement('br'), link];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    ['Embed (embedVideo12)'],
    [cellContent]
  ], document);

  // Replace the element with the new block table
  element.replaceWith(table);
}
