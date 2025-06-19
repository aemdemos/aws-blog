/* global WebImporter */
export default function parse(element, { document }) {
  // Find main content and extract appropriate content for left column
  const main = element.querySelector('main');
  if (!main) return;
  const article = main.querySelector('article');
  if (!article) return;

  // 1. Left column: block description, list and 'Live' button
  // Compose headline 'Columns block'
  const leftCol = document.createElement('div');
  const para = document.createElement('p');
  para.textContent = 'Columns block';
  leftCol.appendChild(para);

  // Build list: e.g., categories from blog meta
  const meta = article.querySelector('footer.blog-post-meta');
  if (meta) {
    const cats = meta.querySelector('.blog-post-categories');
    if (cats) {
      const ul = document.createElement('ul');
      cats.querySelectorAll('a').forEach(a => {
        const li = document.createElement('li');
        li.textContent = a.textContent.trim();
        ul.appendChild(li);
      });
      leftCol.appendChild(ul);
    }
    // 'Live' button as a call to action
    const permalink = meta.querySelector('a[property="url"]');
    if (permalink) {
      const btn = document.createElement('a');
      btn.href = permalink.href;
      btn.textContent = 'Live';
      btn.setAttribute('style', 'display:inline-block;padding:5px 16px;background:#297fff;color:#fff;border-radius:18px;text-decoration:none;margin-top:10px;');
      leftCol.appendChild(btn);
    }
  }

  // 2. Right column: top image (from meta[property=image] or the first <img> in article)
  let imgUrl = null;
  const metaImage = article.querySelector('meta[property="image"]');
  if (metaImage) {
    imgUrl = metaImage.getAttribute('content');
  }
  // Fallback: first <img> in article
  let imgElem = null;
  if (imgUrl) {
    imgElem = document.createElement('img');
    imgElem.src = imgUrl;
    imgElem.alt = '';
    imgElem.setAttribute('style', 'max-width:100%;height:auto;');
  } else {
    const firstImg = article.querySelector('img');
    if (firstImg) {
      imgElem = firstImg.cloneNode(true);
    }
  }

  // Table header row: exactly as required
  const headerRow = ['Columns (columns32)'];
  const contentRow = [leftCol, imgElem];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
