"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:8000";

export const useFiles = () => {
  const [files, setFiles] = useState([]);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/files`); // backend endpoint to get all files
      setFiles(res.data.files || []);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return [files, fetchFiles]; // return both files and refresh function
};
