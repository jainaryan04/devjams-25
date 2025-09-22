"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Maximize, Send } from "lucide-react";
import { SimpleMarkdownRenderer } from "../utils/markdownReader";

export default function ChatPanel({ view, changeView, messages, handleSendMessage }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const isExpanded = view === "expanded";
  const containerStyle = isExpanded 
    ? { width: '400px', maxHeight: '500px', flexShrink: 0 }
    : { width: '400px', minHeight:'500px', maxHeight: '500px' };
  const containerClass = isExpanded
    ? "flex flex-col bg-white overflow-hidden"
    : "flex flex-col bg-white rounded-lg shadow-2xl overflow-hidden";

  const sendMessage = () => {
    const input = document.querySelector("input[type=text]");
    if (input.value.trim() || uploadedFiles.length > 0) {
      handleSendMessage(input.value, uploadedFiles);
      setUploadedFiles([]);
      input.value = "";
    }
  };

  const handleFileClick = async (file) => {
    try {
      const viewUrl = `http://localhost:8000${file.url}`;
      console.log(viewUrl, 'view');
      window.open(viewUrl, '_blank');
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={`${containerClass} h-full flex flex-col`}
      style={containerStyle}
      id={isExpanded ? undefined : "chat-view"}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <h2 className="text-lg font-bold">IntelliOS</h2>
        <button
          className="p-2 hover:bg-gray-700 transition-colors"
          onClick={() => changeView(view === "expanded" ? "chat" : "expanded")}
        >
          <Maximize size={18} />
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50"
        style={{ maxHeight: "500px" }}
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-lg font-medium mb-2">Welcome!</p>
            <p className="text-sm">Ask me about your files or upload them above.</p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-3 rounded-lg max-w-[80%] ${msg.type === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-800"}`}>
                  {(!msg.files || msg.files.length === 0) && <div><SimpleMarkdownRenderer text={msg.text} /></div>}
                  {msg.files && msg.files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="text-sm font-semibold text-gray-600">Files:</div>
                      {msg.files.map((file, fileIndex) => (
                        <div 
                          key={fileIndex}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() => handleFileClick(file)}
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                              {file.name.split('.').pop()?.toUpperCase() || 'FILE'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                            <div className="text-xs text-gray-500">{file.category} • {file.tag}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input at bottom */}
      <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            placeholder="Ask about your files..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <input type="file" multiple className="hidden" id="file-input" onChange={(e) => setUploadedFiles(Array.from(e.target.files))}/>
          <label htmlFor="file-input" className="p-3 bg-black rounded-lg cursor-pointer hover:bg-gray-300 transition-colors">Upload</label>
          <button className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors" onClick={sendMessage}>
            <Send size={18}/>
          </button>
        </div>
        {uploadedFiles.length > 0 && <div className="mt-2 text-sm text-gray-600">{uploadedFiles.map(f => f.name).join(", ")}</div>}
      </div>
    </div>
  );
}