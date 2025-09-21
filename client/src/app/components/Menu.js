"use client";
import { useState, useEffect, useCallback } from "react";
import { FileExplorer } from "./FileExplorer";
import ChatPanel from "./ChatPanel";
import { useFiles } from "../hooks/useFiles";
import { useMessages } from "../hooks/useMessages";

const VIEW = { CHAT: "chat", EXPANDED: "expanded", HIDDEN: "hidden" };

export default function Menu() {
  const files = useFiles();
  const [messages, handleSendMessage] = useMessages();
  const [view, setView] = useState(VIEW.CHAT);

  const triggerResize = useCallback(() => {
    console.log('triggerResize called for view:', view);
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.querySelector("#expanded-view") || document.querySelector("#chat-view");
        
        console.log('Found element:', el?.id || el?.className, 'for view:', view);
        
        if (!el) {
          console.warn('No target element found for resize');
          return;
        }

        if (!window.electronAPI || !window.electronAPI.sendResize) {
          console.warn('electronAPI not available');
          return;
        }

        const rect = el.getBoundingClientRect();
        console.log('Element rect:', {
          width: rect.width,
          height: rect.height,
          view: view,
          elementId: el.id,
          elementClass: el.className
        });
        
        if (rect.width === 0 || rect.height === 0) {
          console.warn('Element has zero dimensions, retrying...', { width: rect.width, height: rect.height, view });
          setTimeout(() => triggerResize(), 50);
          return;
        }

        const width = Math.ceil(rect.width);
        const height = Math.ceil(rect.height);
        
        console.log('Resizing to', { width, height, view });
        
        try {
          window.electronAPI.sendResize({ width, height });
        } catch (error) {
          console.error('Failed to send resize:', error);
        }
      });
    });
  }, [view]);

  useEffect(() => {
    console.log('View changed to:', view);
    const timeoutId = setTimeout(() => {
      triggerResize();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [view, triggerResize]);

  useEffect(() => {
    if (messages.length > 0) {
      const timeoutId = setTimeout(() => {
        triggerResize();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [messages.length, triggerResize]);

  const changeView = (newView) => {
    console.log('Changing view from', view, 'to', newView);
    setView(newView);
  };

  return (
    <div className="relative">
      {view === VIEW.CHAT && (
        <div key="chat-container" style={{ display: 'inline-block', width: 'auto' }}>
          <ChatPanel 
            messages={messages} 
            handleSendMessage={handleSendMessage} 
            view={view} 
            changeView={changeView} 
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
          {files ? (
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
              messages={messages} 
              handleSendMessage={handleSendMessage} 
              view={view} 
              changeView={changeView} 
            />
          </div>
        </div>
      )}
    </div>
  );
}