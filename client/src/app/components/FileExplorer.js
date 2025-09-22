"use client";
import React, { useState, useEffect } from "react";
import { Folder } from "lucide-react";
import { getFileIcon, getCategoryIcon, organizeFiles } from "../utils/fileUtils";

const FileItem = ({ file }) => (
  <div className="pl-16 pr-4 py-1.5 flex items-center gap-2 hover:bg-[#2a2d2e] cursor-pointer text-gray-300">
    <span>{getFileIcon(file.name, file.category)}</span>
    <span className="truncate text-sm">{file.name}</span>
  </div>
);

const Tag = ({ category, tag, tagFiles, expandedTags, toggleTag }) => {
  const tagKey = `${category}-${tag}`;
  const isExpanded = expandedTags.has(tagKey);
  return (
    <div>
      <div className="pl-8 pr-4 py-2 flex items-center gap-2 hover:bg-[#2a2d2e] cursor-pointer select-none" onClick={() => toggleTag(category, tag)}>
        <span className="text-xs text-gray-400">{isExpanded ? "▼" : "▶"}</span>
        <span>📂</span>
        <span className="text-gray-300">{tag}</span>
        <span className="text-xs text-gray-500 ml-auto">({tagFiles.length})</span>
      </div>
      {isExpanded && tagFiles.map((file, idx) => <FileItem key={idx} file={file} />)}
    </div>
  );
};

const Category = ({ category, tags, expandedCategories, expandedTags, toggleCategory, toggleTag }) => {
  const isExpanded = expandedCategories.has(category);
  return (
    <div key={category}>
      <div className="px-4 py-2 flex items-center gap-2 hover:bg-[#2a2d2e] cursor-pointer select-none" onClick={() => toggleCategory(category)}>
        <span className="text-xs text-gray-400">{isExpanded ? "▼" : "▶"}</span>
        <span>{getCategoryIcon(category)}</span>
        <span className="font-medium capitalize">{category.replace("_", " ")}</span>
      </div>
      {isExpanded && Object.entries(tags).map(([tag, tagFiles]) => (
        <Tag key={`${category}-${tag}`} category={category} tag={tag} tagFiles={tagFiles} expandedTags={expandedTags} toggleTag={toggleTag} />
      ))}
    </div>
  );
};

export const FileExplorer = ({ files }) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [expandedTags, setExpandedTags] = useState(new Set());

  const organizedFiles = organizeFiles(files || []);

  const triggerResize = () => {
    requestAnimationFrame(() => {
      const el = document.querySelector("#expanded-view") || document.querySelector("#chat-view");
      if (!el || !window.electronAPI) return;
      const rect = el.getBoundingClientRect();
      console.log('Element dimensions:', {
        width: rect.width,
        height: rect.height,
        element: el.id || el.className
      });
      window.electronAPI.sendResize({ width: Math.ceil(rect.width), height: Math.ceil(rect.height) });
    });
  };

  const toggleCategory = (category) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
      Object.keys(organizedFiles[category] || {}).forEach(tag => expandedTags.delete(`${category}-${tag}`));
      setExpandedTags(new Set(expandedTags));
    } else newExpanded.add(category);
    setExpandedCategories(newExpanded);
    triggerResize();
  };

  const toggleTag = (category, tag) => {
    const tagKey = `${category}-${tag}`;
    const newExpanded = new Set(expandedTags);
    if (newExpanded.has(tagKey)) newExpanded.delete(tagKey);
    else newExpanded.add(tagKey);
    setExpandedTags(newExpanded);
    triggerResize();
  };

  return (
    <div className="bg-[#1e1e1e] text-gray-200 flex flex-col min-w-[280px] min-h-[500px]" id="file-explorer">
      <div className="px-4 py-3 font-bold text-gray-100 border-b border-gray-700 flex items-center gap-2"><Folder size={20} /> Explorer</div>
      <div className="overflow-y-auto text-sm max-h-[500px]">
        {Object.entries(organizedFiles).map(([category, tags]) => (
          <Category key={category} category={category} tags={tags} expandedCategories={expandedCategories} expandedTags={expandedTags} toggleCategory={toggleCategory} toggleTag={toggleTag} />
        ))}
      </div>
    </div>
  );
};
