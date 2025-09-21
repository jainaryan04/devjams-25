export const getFileIcon = (name, category) => {
    if (category === "images") return "🖼️";
    if (name.endsWith(".md")) return "📝";
    if (name.endsWith(".txt")) return "📄";
    if (name.endsWith(".pptx")) return "📊";
    if (name.endsWith(".pdf")) return "📕";
    return "📄";
  };
  
  export const getCategoryIcon = (category) => {
    if (category === "ppt") return "📁";
    if (category === "vit_stuff") return "🎓";
    if (category === "images") return "🖼️";
    return "📁";
  };
  
  export const organizeFiles = (files) => {
    return files.reduce((acc, file) => {
      if (!acc[file.category]) acc[file.category] = {};
      if (!acc[file.category][file.tag]) acc[file.category][file.tag] = [];
      acc[file.category][file.tag].push(file);
      return acc;
    }, {});
  };
  