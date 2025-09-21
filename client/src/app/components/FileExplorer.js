"use client";
import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  X,
  Maximize,
  Send,
  Download,
  Folder,
} from "lucide-react";

const FileExplorer = ({ files }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getFileIcon = (name, category) => {
    if (category === "images") return "🖼️";
    if (name.endsWith(".md")) return "📝";
    if (name.endsWith(".txt")) return "📄";
    if (name.endsWith(".pptx")) return "📊";
    if (name.endsWith(".pdf")) return "📕";
    return "📄";
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(files.map((file) => file.category))];

  return (
    <div className="bg-[#1e1e1e] text-gray-200 flex flex-col h-full w-[250px]">
      <div className="px-4 py-3 font-bold text-gray-100 border-b border-gray-700 flex items-center gap-2">
        <Folder size={20} /> Explorer
      </div>

      <div className="flex-1 overflow-y-auto text-sm">
        {categories.map((cat) => (
          <div key={cat}>
            <div className="px-3 py-2 uppercase text-gray-400 text-xs">
              {cat}
            </div>
            {filteredFiles
              .filter((f) => f.category === cat)
              .map((file, idx) => (
                <div
                  key={idx}
                  className="px-4 py-1 flex items-center gap-2 hover:bg-[#2a2d2e] cursor-pointer"
                >
                  <span>{getFileIcon(file.name, file.category)}</span>
                  <span>{file.name}</span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Menu() {
  const [view, setView] = useState("devjams");
  const [messages, setMessages] = useState([]);

  const files = [
    { name: "README.md", path: "/documents/README.md", category: "documents", tag: "readme" },
    { name: "notes.txt", path: "/documents/notes.txt", category: "documents", tag: "notes" },
    { name: "photo.jpg", path: "/images/photo.jpg", category: "images", tag: "vacation" },
    { name: "presentation.pptx", path: "/documents/presentation.pptx", category: "documents", tag: "work" },
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "o") {
        event.preventDefault();
        setView((prev) => (prev === "icon" ? "devjams" : "icon"));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSendMessage = (text) => {
    if (text.trim() === "") return;
    setMessages([...messages, { type: "user", text }]);
  };

  return (
    <div className="h-screen w-screen relative">
      {/* DevJams is always visible */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
        <h1 className="text-6xl font-bold text-white">DevJams</h1>
      </div>

      {/* Floating chat icon */}
      {view === "icon" && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors duration-200"
          onClick={() => setView("chat")}
        >
          <MessageCircle className="text-white" size={32} />
        </div>
      )}

      {/* Chatbox */}
      {view === "chat" && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex flex-col w-[350px] h-[500px] bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-gray-800 text-white rounded-t-lg">
              <h2 className="text-xl font-bold">Chatbot</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-700 rounded-full">
                  <Download size={20} />
                </button>
                <button
                  className="p-2 rounded-full hover:bg-gray-700"
                  onClick={() => setView("expanded")}
                >
                  <Maximize size={20} />
                </button>
                <button
                  className="p-2 rounded-full hover:bg-gray-700"
                  onClick={() => setView("icon")}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 flex items-center gap-2">
              <input
                type="text"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <button
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                onClick={() => {
                  const input = document.querySelector("input");
                  handleSendMessage(input.value);
                  input.value = "";
                }}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen expanded */}
      {view === "expanded" && (
        <div className="fixed inset-0 z-50 flex">
          <FileExplorer files={files} />
          <div className="flex flex-col flex-1 bg-white shadow-2xl border-l border-gray-200">
            <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
              <h2 className="text-lg font-bold">Chatbot</h2>
              <button
                className="p-2 rounded-full hover:bg-gray-700"
                onClick={() => setView("icon")}
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 flex items-center gap-2">
              <input
                type="text"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Type a message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <button
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                onClick={() => {
                  const input = document.querySelector("input");
                  handleSendMessage(input.value);
                  input.value = "";
                }}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
