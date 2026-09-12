import type { ReactNode } from "react";

const MARK_PATTERN = /<mark>([\s\S]*?)<\/mark>/g;

/**
 * Renders a backend highlight snippet. The backend wraps matches in `<mark>`,
 * so the snippet is markup — but it is built from indexed document text, and
 * injecting it with `dangerouslySetInnerHTML` would hand that text the ability
 * to introduce arbitrary elements. Splitting on `<mark>` keeps the emphasis and
 * lets React escape everything else as plain text.
 */
export function renderHighlight(snippet: string): ReactNode {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  for (const match of snippet.matchAll(MARK_PATTERN)) {
    const start = match.index;
    if (start > cursor) nodes.push(snippet.slice(cursor, start));

    nodes.push(
      <mark key={key++} className="rounded bg-warning-500/25 px-0.5 text-inherit">
        {match[1]}
      </mark>,
    );

    cursor = start + match[0].length;
  }

  if (cursor < snippet.length) nodes.push(snippet.slice(cursor));

  return nodes.length > 0 ? nodes : snippet;
}

/**
 * Prefers the highlighted snippet for a field, falling back to the plain value
 * when the engine produced none — SQL never does.
 */
export function highlightedField(
  highlight: Record<string, string[]> | null,
  field: string,
  fallback: string,
): ReactNode {
  const snippet = highlight?.[field]?.[0];
  return snippet ? renderHighlight(snippet) : fallback;
}
