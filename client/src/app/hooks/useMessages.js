"use client";
import { useState } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:8000";

export const useMessages = (refreshFiles) => {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async (text, uploadedFiles = []) => {
    if (!text.trim() && uploadedFiles.length === 0) return;

    if (text.trim()) setMessages(prev => [...prev, { type: "user", text }]);

    const formData = new FormData();
    formData.append("message", text);
    uploadedFiles.forEach(f => formData.append("uploaded_files", f));

    try {
      const res = await axios.post(`${BACKEND_URL}/chat`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.chat_reply) {
        const botMessage = {
          type: "bot",
          text: res.data.chat_reply,
          files: res.data.files || []
        };
        setMessages(prev => [...prev, botMessage]);
      }

      if (refreshFiles) refreshFiles();
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages(prev => [...prev, { 
        type: "bot", 
        text: "Sorry, there was an error processing your request. Please try again." 
      }]);
    }
  };

  return [messages, handleSendMessage];
};