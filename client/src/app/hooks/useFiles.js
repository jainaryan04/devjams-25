"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:8000";

export const useFiles = () => {
  const [files, setFiles] = useState([]);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/files`);
      setFiles(res.data.files || []);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
    const interval = setInterval(fetchFiles, 5000);
    return () => clearInterval(interval); 
  }, [fetchFiles]);

  return [files, fetchFiles];
};
