"use client";
import { useState, useEffect, useCallback } from "react";
import { FileExplorer } from "./FileExplorer";
import ChatPanel from "./ChatPanel";
import { useFiles } from "../hooks/useFiles";
import { useMessages } from "../hooks/useMessages";

const VIEW = { CHAT: "chat", EXPANDED: "expanded", HIDDEN: "hidden" };

export default function Menu() {
  const [files, refreshFiles] = useFiles();
  const [messages, handleSendMessage] = useMessages(refreshFiles);
  const [view, setView] = useState(VIEW.CHAT);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const changeView = (newView) => {
    if (newView === view) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setView(newView);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  };

  const containerStyles = {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
    opacity: isTransitioning ? 0.7 : 1,
  };

  return (
    <div className="relative">
      {view === VIEW.CHAT && (
        <div 
          key="chat-container" 
          className="inline-flex bg-white rounded-lg shadow-2xl overflow-hidden" 
          id="chat-view"
          style={{ 
            width: 'auto', 
            minWidth: 'max-content',
            ...containerStyles
          }}
        >
          <div 
            style={{ 
              flexShrink: 0,
              transition: 'transform 0.3s ease-out',
              transform: isTransitioning ? 'translateX(-10px)' : 'translateX(0)'
            }}
          >
            <ChatPanel 
              view={view} 
              changeView={changeView} 
              messages={messages}
              handleSendMessage={handleSendMessage}
            />
          </div>
        </div>
      )}

      {view === VIEW.EXPANDED && (
        <div 
          key="expanded-container"
          className="inline-flex bg-white rounded-lg shadow-2xl overflow-hidden" 
          id="expanded-view"
          style={{ 
            width: 'auto', 
            minWidth: 'max-content', 
            minHeight: '500px',
            ...containerStyles
          }}
        >
          <div 
            style={{ 
              flexShrink: 0,
              transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
              transform: isTransitioning ? 'translateX(-20px)' : 'translateX(0)',
              opacity: isTransitioning ? 0.5 : 1
            }}
          >
            {files.length > 0 ? (
              <FileExplorer files={files} />
            ) : (
              <div className="flex items-center justify-center p-4 text-gray-500" style={{ minWidth: '500px' }}>
                Storage is empty
              </div>
            )}
          </div>

          <div 
            style={{ 
              flexShrink: 0,
              transition: 'transform 0.3s ease-out',
              transform: isTransitioning ? 'translateX(10px)' : 'translateX(0)'
            }}
          >
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