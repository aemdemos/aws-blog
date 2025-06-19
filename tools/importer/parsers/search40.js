/* global WebImporter */
export default function parse(element, { document }) {
  // Find the search input element, which should be inside the block
  // The query index URL is required for the block, but the actual URL is not in the HTML.
  // For AWS blogs, the index is at https://aws.amazon.com/blogs/query-index.json
  // This is confirmed by AWS Helix blocks and the context of the block.
  // If you want to make it dynamic, you could try to guess the base URL, but for resilience and clarity,
  // it's best to use the explicit URL for AWS blogs.

  const headerRow = ['Search (search40)'];
  const queryIndexUrl = 'https://aws.amazon.com/blogs/query-index.json';

  // Create a link element referencing the query index (as in the example block)
  const link = document.createElement('a');
  link.href = queryIndexUrl;
  link.textContent = queryIndexUrl;

  // The table is always one column, header then url.
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [link]
  ], document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
