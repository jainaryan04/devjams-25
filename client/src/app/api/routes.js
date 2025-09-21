import axios from "axios";

const BACKEND_URL = "http://localhost:8000";

export const fetchFiles = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/files`);
    return response.data.files;
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
}

export const sendMessage = async (text) => {
    if (!text.trim()) return null;
  
    const data = new FormData();
    data.append("message", text);
  
    try {
      const response = await axios.post(`${BACKEND_URL}/chat`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.chat_reply;
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  };