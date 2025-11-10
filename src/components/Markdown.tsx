import React from "react";

interface MarkdownProps {
  content: string;
}

// Enhanced markdown renderer with better typography and reading experience
export function Markdown({ content }: MarkdownProps) {
  const lines = content.split("\n");
  let inCodeBlock = false;
  let inQuoteBlock = false;
  let codeBlockContent: string[] = [];
  let quoteBlockContent: string[] = [];

  const elements: React.ReactElement[] = [];

  const processInlineFormatting = (text: string) => {
    // Process bold **text**
    text = text.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold">$1</strong>'
    );
    // Process italic *text*
    text = text.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    // Process inline code `code`
    text = text.replace(
      /`([^`]+)`/g,
      '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
    );
    // Process links [text](url)
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary hover:underline">$1</a>'
    );

    return text;
  };

  lines.forEach((line, index) => {
    // Handle code blocks
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // End code block
        const language =
          codeBlockContent[0]?.replace("```", "").trim() || "text";
        const code = codeBlockContent.slice(1).join("\n");
        elements.push(
          <div key={index} className="my-6">
            <div className="bg-muted/50 border border-theme rounded-t-lg px-4 py-2 text-sm font-medium text-muted-foreground">
              {language}
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
              <code>{code}</code>
            </pre>
          </div>
        );
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        // Start code block
        inCodeBlock = true;
        codeBlockContent = [line];
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    // Handle blockquotes
    if (line.startsWith("> ")) {
      if (!inQuoteBlock) {
        inQuoteBlock = true;
        quoteBlockContent = [];
      }
      quoteBlockContent.push(line.substring(2));
      return;
    } else if (inQuoteBlock) {
      // End quote block
      elements.push(
        <blockquote
          key={index}
          className="border-l-4 border-primary pl-6 py-4 my-6 bg-muted/30 rounded-r-lg italic"
        >
          {quoteBlockContent.map((quoteLine, qIndex) => (
            <p
              key={qIndex}
              className="mb-2 last:mb-0"
              dangerouslySetInnerHTML={{
                __html: processInlineFormatting(quoteLine),
              }}
            />
          ))}
        </blockquote>
      );
      quoteBlockContent = [];
      inQuoteBlock = false;
    }

    // Handle headings
    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={index}
          className="prose-h1 scroll-mt-16"
          id={line.substring(2).toLowerCase().replace(/\s+/g, "-")}
        >
          {line.substring(2)}
        </h1>
      );
      return;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={index}
          className="prose-h2 scroll-mt-16"
          id={line.substring(3).toLowerCase().replace(/\s+/g, "-")}
        >
          {line.substring(3)}
        </h2>
      );
      return;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={index}
          className="prose-h3 scroll-mt-16"
          id={line.substring(4).toLowerCase().replace(/\s+/g, "-")}
        >
          {line.substring(4)}
        </h3>
      );
      return;
    }

    // Handle lists
    if (line.startsWith("- ")) {
      elements.push(
        <li
          key={index}
          className="prose-li"
          dangerouslySetInnerHTML={{
            __html: processInlineFormatting(line.substring(2)),
          }}
        />
      );
      return;
    }

    if (/^\d+\.\s+/.test(line)) {
      elements.push(
        <li
          key={index}
          className="prose-li list-decimal"
          dangerouslySetInnerHTML={{
            __html: processInlineFormatting(line.replace(/^\d+\.\s+/, "")),
          }}
        />
      );
      return;
    }

    // Handle horizontal rules
    if (line.trim() === "---" || line.trim() === "***") {
      elements.push(<hr key={index} className="my-8 border-t border-theme" />);
      return;
    }

    // Handle empty lines
    if (line.trim() === "") {
      elements.push(<div key={index} className="h-4" />);
      return;
    }

    // Handle paragraphs
    elements.push(
      <p
        key={index}
        className="prose-p"
        dangerouslySetInnerHTML={{ __html: processInlineFormatting(line) }}
      />
    );
  });

  // Handle any remaining quote block
  if (inQuoteBlock && quoteBlockContent.length > 0) {
    elements.push(
      <blockquote
        key="final-quote"
        className="border-l-4 border-primary pl-6 py-4 my-6 bg-muted/30 rounded-r-lg italic"
      >
        {quoteBlockContent.map((quoteLine, qIndex) => (
          <p
            key={qIndex}
            className="mb-2 last:mb-0"
            dangerouslySetInnerHTML={{
              __html: processInlineFormatting(quoteLine),
            }}
          />
        ))}
      </blockquote>
    );
  }

  return <div className="prose prose-lg max-w-none">{elements}</div>;
}

export default Markdown;
