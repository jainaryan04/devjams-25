import { useState } from "react";
import { sendMessage } from "../api/routes";

export const useMessages = () => {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { type: "user", text }]);
    const botReply = await sendMessage(text);
    if (botReply) setMessages(prev => [...prev, { type: "bot", text: botReply }]);
  };

  return [messages, handleSendMessage];
};