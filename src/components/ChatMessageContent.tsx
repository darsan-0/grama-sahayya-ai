import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExternalLink } from 'lucide-react';

interface ChatMessageContentProps {
  content: string;
  isUser?: boolean;
}

/**
 * Validates whether a URL uses a safe web protocol (https, http, mailto).
 * Rejects dangerous schemes like javascript:, data:, vbscript:.
 */
export function isSafeUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  // Safe protocols allowed for external citizen portal links
  return trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('mailto:');
}

/**
 * Pre-processes message text so that unicode bullets and varied indentation
 * from LLM completions cleanly convert into standard markdown list items.
 */
export function normalizeMarkdownContent(text: string): string {
  if (!text) return '';
  return text
    // Normalize unicode bullet characters at line beginnings to standard markdown list items
    .replace(/^([ \t]*)[•·–—][ \t]+/gm, '$1- ')
    // Ensure headings like "###Heading" have a space after hashes
    .replace(/^(#{1,6})([^# \t\n])/gm, '$1 $2');
}

export const ChatMessageContent: React.FC<ChatMessageContentProps> = ({ content, isUser = false }) => {
  const normalizedContent = useMemo(() => normalizeMarkdownContent(content), [content]);

  // For user messages, simple clean styled text
  if (isUser) {
    return (
      <div className="whitespace-pre-wrap break-words leading-relaxed font-normal text-white text-xs sm:text-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="chat-markdown text-[#242824] text-xs sm:text-sm leading-relaxed overflow-hidden break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Paragraphs
          p: ({ children }) => (
            <p className="mb-2.5 last:mb-0 leading-relaxed text-[#242824] break-words">
              {children}
            </p>
          ),

          // Bold & Strong emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-[#183B32]">{children}</strong>
          ),

          // Italic & Emphasis
          em: ({ children }) => (
            <em className="italic text-[#3C403B]">{children}</em>
          ),

          // Headings
          h1: ({ children }) => (
            <h1 className="text-base sm:text-lg font-bold text-[#183B32] mt-3 mb-2 first:mt-0 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm sm:text-base font-bold text-[#183B32] mt-3 mb-1.5 first:mt-0 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs sm:text-sm font-bold text-[#183B32] mt-2 mb-1 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs sm:text-sm font-semibold text-[#183B32] mt-2 mb-1 first:mt-0">
              {children}
            </h4>
          ),

          // Unordered Lists
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-4 sm:ml-5 mb-2.5 last:mb-0 space-y-1.5 text-xs sm:text-sm text-[#242824]">
              {children}
            </ul>
          ),

          // Numbered / Ordered Lists
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-4 sm:ml-5 mb-2.5 last:mb-0 space-y-1.5 text-xs sm:text-sm text-[#242824]">
              {children}
            </ol>
          ),

          // List Items
          li: ({ children }) => (
            <li className="leading-relaxed pl-1 text-[#242824] break-words">
              {children}
            </li>
          ),

          // Links (Strictly secure: HTTP/HTTPS only, noopener noreferrer, external icon)
          a: ({ href, children }) => {
            const safe = isSafeUrl(href);
            if (!safe) {
              return <span className="underline text-[#686B66]">{children}</span>;
            }

            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#075B46] hover:text-[#054333] font-medium underline underline-offset-2 decoration-[#075B46]/40 hover:decoration-[#075B46] transition-colors inline-flex items-baseline gap-1 break-all"
              >
                <span>{children}</span>
                <ExternalLink className="w-3 h-3 inline-block shrink-0 self-center text-[#075B46]" />
              </a>
            );
          },

          // Code blocks & inline code
          code: ({ children, className }) => {
            const isCodeBlock = Boolean(className);
            if (isCodeBlock) {
              return (
                <code className="block bg-[#F4F3EE] border border-[#E5E5DF] text-[#183B32] p-2.5 rounded-lg text-xs font-mono overflow-x-auto my-2">
                  {children}
                </code>
              );
            }
            return (
              <code className="bg-[#F1EFEA] border border-[#E5E5DF] text-[#183B32] px-1.5 py-0.5 rounded text-[11px] font-mono break-all">
                {children}
              </code>
            );
          },

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 border-[#075B46] pl-3 py-1 my-2 bg-[#FAF9F5] rounded-r text-[#4A4E47] italic text-xs">
              {children}
            </blockquote>
          ),

          // Tables (from remarkGfm)
          table: ({ children }) => (
            <div className="overflow-x-auto my-2.5 border border-[#E5E5DF] rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#F4F3EE] text-[#183B32] font-semibold border-b border-[#E5E5DF]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-[#E5E5DF] bg-white">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-[#FAF9F5] transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-[#183B32] font-semibold border-r border-[#E5E5DF] last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-[#242824] border-r border-[#E5E5DF] last:border-r-0">
              {children}
            </td>
          ),

          // Horizontal rule
          hr: () => <hr className="my-3 border-t border-[#E5E5DF]" />
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
};
