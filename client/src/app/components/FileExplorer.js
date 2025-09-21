"use client";
import React, { useState, useEffect } from "react";
import { MessageCircle, X, Maximize, Send, Download, Folder } from "lucide-react";

const FileExplorer = ({ files }) => {
  const getFileIcon = (name, category) => {
    if (category === "images") return "🖼️";
    if (name.endsWith(".md")) return "📝";
    if (name.endsWith(".txt")) return "📄";
    if (name.endsWith(".pptx")) return "📊";
    if (name.endsWith(".pdf")) return "📕";
    return "📄";
  };

  return (
    <div className="bg-[#1e1e1e] text-gray-200 flex flex-col min-w-[250px]">
      <div className="px-4 py-3 font-bold text-gray-100 border-b border-gray-700 flex items-center gap-2">
        <Folder size={20} /> Explorer
      </div>
      <div className="overflow-y-auto text-sm max-h-[400px]">
        {files.map((file, idx) => (
          <div key={idx} className="px-4 py-2 flex items-center gap-2 hover:bg-[#2a2d2e] cursor-pointer">
            <span>{getFileIcon(file.name, file.category)}</span>
            <span className="truncate">{file.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Menu() {
  const [view, setView] = useState("chat");
  const [messages, setMessages] = useState([]);

  const files = [
    { name: "README.md", category: "documents" },
    { name: "notes.txt", category: "documents" },
    { name: "photo.jpg", category: "images" },
    { name: "presentation.pptx", category: "documents" },
    { name: "config.json", category: "documents" },
    { name: "screenshot.png", category: "images" },
  ];

  const triggerResize = () => {
    setTimeout(() => {
      window.dispatchEvent(new Event("electron-resize"));
    }, 50);
  };

  useEffect(() => {
    triggerResize();
  }, [view, messages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "o") {
        e.preventDefault();
        setView((prev) => (prev === "hidden" ? "chat" : "hidden"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;
    const newMessages = [...messages, { type: "user", text }];
    setMessages(newMessages);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { type: "bot", text: "Thanks for your message!" }]);
    }, 1000);
  };

  const changeView = (newView) => {
    setView(newView);
    triggerResize();
  };

  return (
    <div className="relative">
      {view === "chat" && (
        <div id="chat-view" className="inline-block">
          <div className="flex flex-col bg-white rounded-lg shadow-2xl overflow-hidden min-w-[400px] min-h-[500px]">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
              <h2 className="text-lg font-bold">File Assistant</h2>
              <div className="flex items-center gap-1">
                <button 
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  title="Download Chat"
                >
                  <Download size={18} />
                </button>
                <button 
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors" 
                  onClick={() => changeView("expanded")}
                  title="Expand View"
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
        </div>
      )}

      {view === "expanded" && (
        <div id="expanded-view" className="inline-block">
          <div className="flex bg-white rounded-lg shadow-2xl overflow-hidden">
            <FileExplorer files={files} />
            <div className="flex flex-col border-l border-gray-200 w-[400px] h-[500px]">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <h2 className="text-lg font-bold">File Assistant</h2>
                <div className="flex items-center gap-1">
                  <button 
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                    onClick={() => changeView("chat")}
                    title="Collapse View"
                  >
                    <Maximize size={18} className="rotate-180" />
                  </button>
                  
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Folder className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-lg font-medium mb-2">File Explorer</p>
                    <p className="text-sm">Browse your files on the left or ask me questions here.</p>
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
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      const input = document.querySelector("input[placeholder='Ask about your files...']");
                      handleSendMessage(input.value);
                      input.value = "";
                    }}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}