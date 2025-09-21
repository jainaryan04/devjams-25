import { useState, useEffect } from "react";
import { fetchFiles } from "../api/routes";

export const useFiles = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const loadFiles = async () => {
      const data = await fetchFiles();
      setFiles(data);
    };
    loadFiles();
  }, []);

  return files;
};