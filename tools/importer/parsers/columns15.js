/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main blog post content and corresponding author bios
  const main = element.querySelector('main#aws-page-content-main');
  if (!main) return;
  const article = main.querySelector('article.blog-post');
  if (!article) return;
  const contentSection = article.querySelector('section.blog-post-content');
  if (!contentSection) return;

  // Find 'About the authors' heading and split content before/after
  let aboutAuthorsIndex = -1;
  const children = Array.from(contentSection.children);
  for (let i = 0; i < children.length; i++) {
    if (/about the authors/i.test(children[i].textContent || '')) {
      aboutAuthorsIndex = i;
      break;
    }
  }

  // Column 1: Everything before About the Authors (main content)
  const column1 = document.createElement('div');
  // Add h1 (title) if present
  const title = article.querySelector('h1.blog-post-title');
  if (title) column1.appendChild(title);
  // Add meta (authors, date, etc.) if present
  const meta = article.querySelector('footer.blog-post-meta');
  if (meta) column1.appendChild(meta);
  // Add all content up to About the authors
  const mainContentEls = aboutAuthorsIndex >= 0 ? children.slice(0, aboutAuthorsIndex) : children;
  mainContentEls.forEach(el => column1.appendChild(el));

  // Column 2: Author bios (all <p> after About the Authors heading)
  const column2 = document.createElement('div');
  if (aboutAuthorsIndex >= 0) {
    for (let i = aboutAuthorsIndex + 1; i < children.length; i++) {
      const el = children[i];
      if (el.tagName && el.tagName.match(/^H[1-6]$/)) break;
      if (el.tagName === 'P') column2.appendChild(el);
    }
  }

  // Block table structure
  const cells = [
    ['Columns (columns15)'],
    [column1, column2]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
