import { MessageCircle, Maximize, Send, Download } from "lucide-react";

export default function ChatPanel({ messages, handleSendMessage, view, changeView }) {
  console.log('ChatPanel rendering with view:', view);
  
  const isExpanded = view === "expanded";
  
  const containerStyle = isExpanded 
    ? { 
        width: '400px',
        height: '500px',
        flexShrink: 0
      }
    : { 
        width: '400px',
        minHeight: '500px'
      };

  const containerClass = isExpanded
    ? "flex flex-col bg-white overflow-hidden"
    : "flex flex-col bg-white rounded-lg shadow-2xl overflow-hidden";

  return (
    <div 
      className={containerClass}
      style={containerStyle}
      id={isExpanded ? undefined : "chat-view"}
    >
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <h2 className="text-lg font-bold">IntelliOS</h2>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors" title="Download Chat">
            <Download size={18} />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-gray-700 transition-colors" 
            onClick={() => {
              console.log('Button clicked, current view:', view);
              changeView(view === "expanded" ? "chat" : "expanded");
            }} 
            title={view === "expanded" ? "Collapse View" : "Expand View"}
          >
            <Maximize size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-lg font-medium mb-2">Welcome!</p>
            <p className="text-sm">Ask me about your files or click expand to browse them.</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-lg max-w-[80%] ${msg.type === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-800 shadow-sm border"}`}>
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black" 
            placeholder="Ask about your files..."
            onKeyDown={(e) => { 
              if (e.key === "Enter") { 
                handleSendMessage(e.target.value); 
                e.target.value = ""; 
              }
            }} 
          />
          <button 
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            onClick={() => { 
              const input = document.querySelector("input"); 
              handleSendMessage(input.value); 
              input.value = ""; 
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}