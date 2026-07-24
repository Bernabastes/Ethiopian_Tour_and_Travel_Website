import Link from "next/link";
import { Fragment } from "react";

// Minimal, safe renderer for the blog body. Supports:
//   ## Heading / ### Heading, blank-line paragraphs, and [text](/path) links.
// No raw HTML is injected — everything is built as React elements.

function renderInline(text: string, keyBase: string) {
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const href = m[2];
    const internal = href.startsWith("/");
    parts.push(
      internal ? (
        <Link key={`${keyBase}-${i}`} href={href} className="text-brand-green underline">{m[1]}</Link>
      ) : (
        <a key={`${keyBase}-${i}`} href={href} target="_blank" rel="noopener noreferrer" className="text-brand-green underline">{m[1]}</a>
      ),
    );
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function PostBody({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/);
  return (
    <div className="space-y-4 leading-relaxed text-ink/85">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("### ")) {
          return <h3 key={i} className="pt-2 text-xl font-bold">{renderInline(trimmed.slice(4), `h3-${i}`)}</h3>;
        }
        if (trimmed.startsWith("## ")) {
          return <h2 key={i} className="pt-3 text-2xl font-bold">{renderInline(trimmed.slice(3), `h2-${i}`)}</h2>;
        }
        // bullet list block (lines starting with - )
        if (trimmed.split("\n").every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-6">
              {trimmed.split("\n").map((l, j) => (
                <li key={j}>{renderInline(l.trim().slice(2), `li-${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {trimmed.split("\n").map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {renderInline(line, `p-${i}-${j}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
