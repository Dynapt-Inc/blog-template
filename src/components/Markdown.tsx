interface MarkdownProps {
  content: string;
}

// Minimal markdown renderer for headings, lists, and paragraphs.
export function Markdown({ content }: MarkdownProps) {
  const lines = content.split("\n");
  return (
    <div className="prose prose-neutral max-w-none">
      {lines.map((line, index) => {
        if (line.startsWith("# ")) {
          return (
            <h1 key={index} className="text-3xl font-bold mt-8 mb-4">
              {line.substring(2)}
            </h1>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={index} className="text-2xl font-semibold mt-6 mb-3">
              {line.substring(3)}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={index} className="text-xl font-medium mt-4 mb-2">
              {line.substring(4)}
            </h3>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <li key={index} className="ml-6 list-disc">
              {line.substring(2)}
            </li>
          );
        }
        if (line.trim() === "") {
          return <br key={index} />;
        }
        if (/^\d+\.\s+/.test(line)) {
          return (
            <li key={index} className="ml-6 list-decimal">
              {line.replace(/^\d+\.\s+/, "")}
            </li>
          );
        }
        return (
          <p key={index} className="leading-7 text-[15px] text-neutral-800">
            {line}
          </p>
        );
      })}
    </div>
  );
}

export default Markdown;
