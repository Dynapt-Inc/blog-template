import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Enhanced markdown renderer with better typography and reading experience
export function Markdown({ content }) {
    const lines = content.split("\n");
    let inCodeBlock = false;
    let inQuoteBlock = false;
    let codeBlockContent = [];
    let quoteBlockContent = [];
    const elements = [];
    const processInlineFormatting = (text) => {
        // Process bold **text**
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
        // Process italic *text*
        text = text.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
        // Process inline code `code`
        text = text.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
        // Process links [text](url)
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');
        return text;
    };
    lines.forEach((line, index) => {
        var _a;
        // Handle code blocks
        if (line.trim().startsWith("```")) {
            if (inCodeBlock) {
                // End code block
                const language = ((_a = codeBlockContent[0]) === null || _a === void 0 ? void 0 : _a.replace("```", "").trim()) || "text";
                const code = codeBlockContent.slice(1).join("\n");
                elements.push(_jsxs("div", { className: "my-6", children: [_jsx("div", { className: "bg-muted/50 border border-theme rounded-t-lg px-4 py-2 text-sm font-medium text-muted-foreground", children: language }), _jsx("pre", { className: "bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto", children: _jsx("code", { children: code }) })] }, index));
                codeBlockContent = [];
                inCodeBlock = false;
            }
            else {
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
        }
        else if (inQuoteBlock) {
            // End quote block
            elements.push(_jsx("blockquote", { className: "border-l-4 border-primary pl-6 py-4 my-6 bg-muted/30 rounded-r-lg italic", children: quoteBlockContent.map((quoteLine, qIndex) => (_jsx("p", { className: "mb-2 last:mb-0", dangerouslySetInnerHTML: {
                        __html: processInlineFormatting(quoteLine),
                    } }, qIndex))) }, index));
            quoteBlockContent = [];
            inQuoteBlock = false;
        }
        // Handle headings
        if (line.startsWith("# ")) {
            elements.push(_jsx("h1", { className: "prose-h1 scroll-mt-16", id: line.substring(2).toLowerCase().replace(/\s+/g, "-"), children: line.substring(2) }, index));
            return;
        }
        if (line.startsWith("## ")) {
            elements.push(_jsx("h2", { className: "prose-h2 scroll-mt-16", id: line.substring(3).toLowerCase().replace(/\s+/g, "-"), children: line.substring(3) }, index));
            return;
        }
        if (line.startsWith("### ")) {
            elements.push(_jsx("h3", { className: "prose-h3 scroll-mt-16", id: line.substring(4).toLowerCase().replace(/\s+/g, "-"), children: line.substring(4) }, index));
            return;
        }
        // Handle lists
        if (line.startsWith("- ")) {
            elements.push(_jsx("li", { className: "prose-li", dangerouslySetInnerHTML: {
                    __html: processInlineFormatting(line.substring(2)),
                } }, index));
            return;
        }
        if (/^\d+\.\s+/.test(line)) {
            elements.push(_jsx("li", { className: "prose-li list-decimal", dangerouslySetInnerHTML: {
                    __html: processInlineFormatting(line.replace(/^\d+\.\s+/, "")),
                } }, index));
            return;
        }
        // Handle horizontal rules
        if (line.trim() === "---" || line.trim() === "***") {
            elements.push(_jsx("hr", { className: "my-8 border-t border-theme" }, index));
            return;
        }
        // Handle empty lines
        if (line.trim() === "") {
            elements.push(_jsx("div", { className: "h-4" }, index));
            return;
        }
        // Handle paragraphs
        elements.push(_jsx("p", { className: "prose-p", dangerouslySetInnerHTML: { __html: processInlineFormatting(line) } }, index));
    });
    // Handle any remaining quote block
    if (inQuoteBlock && quoteBlockContent.length > 0) {
        elements.push(_jsx("blockquote", { className: "border-l-4 border-primary pl-6 py-4 my-6 bg-muted/30 rounded-r-lg italic", children: quoteBlockContent.map((quoteLine, qIndex) => (_jsx("p", { className: "mb-2 last:mb-0", dangerouslySetInnerHTML: {
                    __html: processInlineFormatting(quoteLine),
                } }, qIndex))) }, "final-quote"));
    }
    return _jsx("div", { className: "prose prose-lg max-w-none", children: elements });
}
export default Markdown;
