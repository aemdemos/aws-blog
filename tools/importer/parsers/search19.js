/* global WebImporter */
export default function parse(element, { document }) {
  // The Search (search19) block expects a single table with 2 rows:
  // 1. Header row: 'Search (search19)'
  // 2. Query index absolute URL
  // There is no section metadata block in the markdown example
  // The query index URL is not present in the provided HTML, so we must use the standard sample URL
  // per the block specification
  const headerRow = ['Search (search19)'];
  const urlRow = ['https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json'];
  const rows = [headerRow, urlRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
