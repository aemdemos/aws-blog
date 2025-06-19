/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Columns block: text, list, button (Live)
  const col1block = document.createElement('div');
  col1block.appendChild(document.createTextNode('Columns block'));
  const ul = document.createElement('ul');
  ['One', 'Two', 'Three'].forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ul.appendChild(li);
  });
  col1block.appendChild(ul);
  // Blue 'Live' button
  const liveBtn = document.createElement('a');
  liveBtn.href = 'https://word-edit.officeapps.live.com/';
  liveBtn.textContent = 'Live';
  liveBtn.setAttribute('style', 'display:inline-block;background:#2563ff;color:#fff;padding:8px 16px;border-radius:20px;text-decoration:none;margin-top:12px;');
  col1block.appendChild(liveBtn);

  // 2. The first image (teal DNA)
  const img1 = document.createElement('img');
  img1.src = 'https://main--sta-boilerplate--aemdemos.hlx.page/media_193050d52a802830d970fde49644ae9a504a61b7f.png#width=750&height=500';
  img1.alt = '';
  img1.width = 750;
  img1.height = 500;

  // 3. The second image (yellow DNA)
  const img2 = document.createElement('img');
  img2.src = 'https://main--sta-boilerplate--aemdemos.hlx.page/media_1e562f39bbce4d269e279cbbf8c5674a399fe0070.png#width=644&height=470';
  img2.alt = '';
  img2.width = 644;
  img2.height = 470;

  // 4. Preview text and button
  const previewBlock = document.createElement('div');
  const p = document.createElement('p');
  p.textContent = 'Or you can just view the preview';
  previewBlock.appendChild(p);
  const previewBtn = document.createElement('a');
  previewBtn.href = 'https://word-edit.officeapps.live.com/';
  previewBtn.textContent = 'Preview';
  previewBtn.setAttribute('style', 'display:inline-block;padding:8px 16px;border:2px solid #333;border-radius:20px;text-decoration:none;margin-top:10px;');
  previewBlock.appendChild(previewBtn);

  // Build the table
  const cells = [
    ['Columns (columns37)'],
    [col1block, img1],
    [img2, previewBlock]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}