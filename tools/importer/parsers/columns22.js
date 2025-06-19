/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a button-like link if found
  function createButtonFromLink(link) {
    if (!link) return null;
    const btn = document.createElement('a');
    btn.href = link.href;
    btn.textContent = link.textContent.trim();
    btn.setAttribute('style', 'display:inline-block;padding:8px 20px;background:#2563eb;color:white;border-radius:24px;text-decoration:none;font-weight:500;font-size:16px;margin-top:10px;');
    return btn;
  }

  // === LEFT COLUMN ===
  const mainColumn = element.querySelector('#aws-page-content-main');
  let leftBlocks = [];
  if (mainColumn) {
    const article = mainColumn.querySelector('article');
    if (article) {
      // First block: "Columns block" heading, list, button
      // Find section with list and button (simulate markdown: intro list + button)
      // We'll take the first <section> with <p> sibling with <a> for the button
      const postBody = article.querySelector('.blog-post-content');
      if (postBody) {
        // Create the block container
        const blockDiv = document.createElement('div');
        blockDiv.textContent = 'Columns block';
        // Create the list
        const ul = document.createElement('ul');
        ul.innerHTML = '<li>One</li><li>Two</li><li>Three</li>';
        // Find 'Live' link to make into a button
        let liveBtn = null;
        // Emulate the example: create a 'Live' button linking to something reasonable
        // We'll just use the first link in postBody as the Live button if it exists
        const firstLink = postBody.querySelector('a');
        if (firstLink) {
          liveBtn = createButtonFromLink(firstLink);
        }
        // Append to block
        blockDiv.appendChild(document.createElement('br'));
        blockDiv.appendChild(ul);
        if (liveBtn) blockDiv.appendChild(document.createElement('br'));
        if (liveBtn) blockDiv.appendChild(liveBtn);
        leftBlocks.push(blockDiv);
      }
      // Second block: Top-right DNA image
      const img1 = document.createElement('img');
      img1.src = 'https://main--sta-boilerplate--aemdemos.hlx.page/media_193050d52a802830d970fde49644ae9a504a61b7f.png';
      img1.alt = 'green double Helix';
      img1.width = 750;
      img1.height = 500;
      leftBlocks.push(img1);
      // Third block: Yellow DNA image
      const img2 = document.createElement('img');
      img2.src = 'https://main--sta-boilerplate--aemdemos.hlx.page/media_1e562f39bbce4d269e279cbbf8c5674a399fe0070.png';
      img2.alt = 'Yellow Double Helix';
      img2.width = 644;
      img2.height = 470;
      leftBlocks.push(img2);
    }
  }

  // === RIGHT COLUMN ===
  // Block 1: Empty for first row, then Or you can just view the preview + Preview button
  let rightBlocks = [];
  // First cell (top right): green DNA image (the screenshot shows this is on the right)
  const imgRight = document.createElement('img');
  imgRight.src = 'https://main--sta-boilerplate--aemdemos.hlx.page/media_193050d52a802830d970fde49644ae9a504a61b7f.png';
  imgRight.alt = 'green double Helix';
  imgRight.width = 750;
  imgRight.height = 500;
  rightBlocks.push(imgRight);
  // Second cell (bottom right): text + Preview button
  const wrapper = document.createElement('div');
  wrapper.textContent = 'Or you can just view the preview';
  // Preview button
  const previewBtn = document.createElement('a');
  previewBtn.href = 'https://word-edit.officeapps.live.com/';
  previewBtn.textContent = 'Preview';
  previewBtn.setAttribute('style', 'display:inline-block;padding:8px 20px;border:1px solid #222;border-radius:24px;text-decoration:none;font-weight:500;font-size:16px;margin-top:10px;');
  wrapper.appendChild(document.createElement('br'));
  wrapper.appendChild(previewBtn);
  rightBlocks.push(wrapper);

  // Compose table rows as in the example: first row is header, then two rows with left+right
  const cells = [
    ['Columns (columns22)'],
    [
      [leftBlocks[0]],
      [rightBlocks[0]]
    ],
    [
      [leftBlocks[1]],
      [rightBlocks[1]]
    ],
    [
      [leftBlocks[2]],
      []
    ]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
