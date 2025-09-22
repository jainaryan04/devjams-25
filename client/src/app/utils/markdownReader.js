export const SimpleMarkdownRenderer = ({ text }) => {
    const renderMarkdown = (text) => {
        console.log("Rendering markdown for text:", text);
      return text
        // Bold text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic text
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
        // Code blocks (simple version)
        .replace(/```[\s\S]*?```/g, (match) => {
          const code = match.replace(/```/g, '').trim();
          return `<pre class="bg-gray-100 p-3 rounded-md overflow-x-auto my-2"><code>${code}</code></pre>`;
        })
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
        // Line breaks
        .replace(/\n/g, '<br>');
    };
  
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }}
        className="prose prose-sm max-w-none"
      />
    );
  };