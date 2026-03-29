import { useMemo } from "react";
import { Link } from "react-router-dom";

/**
 * Simple markdown-to-JSX renderer.
 * Supports: h2, h3, p, ul/li, bold, links (internal converted to Link), tables, hr, code blocks.
 */
export function MarkdownRenderer({ content }: { content: string }) {
  const elements = useMemo(() => parseMarkdown(content), [content]);
  return <div className="prose prose-neutral max-w-none">{elements}</div>;
}

function parseMarkdown(md: string): React.ReactNode[] {
  const lines = md.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // blank
    if (line.trim() === "") { i++; continue; }

    // hr
    if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={key++} className="my-6" />);
      i++; continue;
    }

    // h2
    if (line.startsWith("## ")) {
      elements.push(<h2 key={key++} className="text-2xl font-bold mt-8 mb-4">{renderInline(line.slice(3))}</h2>);
      i++; continue;
    }

    // h3
    if (line.startsWith("### ")) {
      elements.push(<h3 key={key++} className="text-xl font-semibold mt-6 mb-3">{renderInline(line.slice(4))}</h3>);
      i++; continue;
    }

    // table
    if (line.includes("|") && i + 1 < lines.length && /^\|[-|: ]+\|$/.test(lines[i + 1]?.trim())) {
      const headerCells = parseCells(line);
      i += 2; // skip header + separator
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim().startsWith("|")) {
        rows.push(parseCells(lines[i]));
        i++;
      }
      elements.push(
        <div key={key++} className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                {headerCells.map((c, j) => <th key={j} className="text-left p-2 font-semibold">{renderInline(c)}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b last:border-0">
                  {row.map((c, ci) => <td key={ci} className="p-2">{renderInline(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // unordered list
    if (/^[-*] /.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i]?.trim())) {
        items.push(lines[i].trim().replace(/^[-*] /, ""));
        i++;
      }
      elements.push(
        <ul key={key++} className="list-disc pl-6 my-3 space-y-1">
          {items.map((item, j) => <li key={j} className="text-muted-foreground">{renderInline(item)}</li>)}
        </ul>
      );
      continue;
    }

    // code block
    if (line.trim().startsWith("```")) {
      i++;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <pre key={key++} className="bg-secondary rounded-lg p-4 overflow-x-auto my-4 text-sm">
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // paragraph
    elements.push(<p key={key++} className="text-muted-foreground leading-relaxed my-3">{renderInline(line)}</p>);
    i++;
  }

  return elements;
}

function parseCells(line: string): string[] {
  return line.split("|").slice(1, -1).map(c => c.trim());
}

function renderInline(text: string): React.ReactNode {
  // Process bold, links, inline code
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*)|(\[([^\]]+)\]\(([^)]+)\))|(`([^`]+)`)/g;
  let lastIndex = 0;
  let match;
  let k = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // bold
      parts.push(<strong key={k++} className="font-semibold text-foreground">{match[2]}</strong>);
    } else if (match[3]) {
      // link
      const label = match[4];
      const href = match[5];
      if (href.startsWith("/")) {
        parts.push(<Link key={k++} to={href} className="text-primary hover:underline">{label}</Link>);
      } else {
        parts.push(<a key={k++} href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{label}</a>);
      }
    } else if (match[6]) {
      // inline code
      parts.push(<code key={k++} className="bg-secondary px-1.5 py-0.5 rounded text-sm">{match[7]}</code>);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}
