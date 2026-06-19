import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

// html:false → raw HTML in the Markdown source is escaped, not passed through.
// sanitize-html is then a second line of defence on the generated markup.
const md = new MarkdownIt({ html: false, linkify: true, breaks: false });

const SANITIZE_OPTS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h2", "h3", "h4", "p", "a", "ul", "ol", "li", "blockquote",
    "strong", "em", "code", "pre", "br", "hr", "img",
    "table", "thead", "tbody", "tr", "th", "td",
  ],
  allowedAttributes: {
    a: ["href", "title"],
    img: ["src", "alt", "title"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  // External links: no referrer leak / tab-nabbing, and nofollow for SEO hygiene.
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "nofollow noopener", target: "_blank" }),
  },
};

/** Render trusted-but-author-supplied Markdown into sanitized HTML (SSR-safe). */
export function renderMarkdown(markdown: string): string {
  return sanitizeHtml(md.render(markdown ?? ""), SANITIZE_OPTS);
}
