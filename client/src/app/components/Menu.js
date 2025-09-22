"use client";
import { useState, useEffect, useCallback } from "react";
import { FileExplorer } from "./FileExplorer";
import ChatPanel from "./ChatPanel";
import { useFiles } from "../hooks/useFiles";
import { useMessages } from "../hooks/useMessages";

const VIEW = { CHAT: "chat", EXPANDED: "expanded", HIDDEN: "hidden" };

export default function Menu() {
  const [files, refreshFiles] = useFiles(); // get both files and refresh function
  const [messages, handleSendMessage] = useMessages(refreshFiles); // pass refreshFiles

  const [view, setView] = useState(VIEW.CHAT);

  const triggerResize = useCallback(() => {
    const el = document.querySelector("#expanded-view") || document.querySelector("#chat-view");
    if (!el || !window.electronAPI?.sendResize) return;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      setTimeout(() => triggerResize(), 50);
      return;
    }

    window.electronAPI.sendResize({
      width: Math.ceil(rect.width),
      height: Math.ceil(rect.height)
    });
  }, [view]);

  useEffect(() => {
    const timeoutId = setTimeout(triggerResize, 300);
    return () => clearTimeout(timeoutId);
  }, [view, triggerResize]);

  useEffect(() => {
    if (messages.length > 0) {
      const timeoutId = setTimeout(triggerResize, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messages.length, triggerResize]);

  const changeView = (newView) => setView(newView);

  return (
    <div className="relative">
      {view === VIEW.CHAT && (
        <div key="chat-container" style={{ display: 'inline-block', width: 'auto' }}>
          <ChatPanel 
            view={view} 
            changeView={changeView} 
            messages={messages}
            handleSendMessage={handleSendMessage}
          />
        </div>
      )}

      {view === VIEW.EXPANDED && (
        <div 
          key="expanded-container"
          className="inline-flex bg-white rounded-lg shadow-2xl overflow-hidden" 
          id="expanded-view"
          style={{ width: 'auto', minWidth: 'max-content' }}
        >
          {files.length > 0 ? (
            <div style={{ flexShrink: 0 }}>
              <FileExplorer files={files} />
            </div>
          ) : (
            <div className="flex items-center justify-center p-4 text-gray-500" style={{ minWidth: '200px' }}>
              Loading files...
            </div>
          )}

          <div style={{ flexShrink: 0 }}>
            <ChatPanel 
              view={view} 
              changeView={changeView} 
              messages={messages}
              handleSendMessage={handleSendMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
}