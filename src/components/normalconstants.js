export function undoChange() {
    this.quill.history.undo();
  }
  
  export function redoChange() {
    this.quill.history.redo();
  }

  export const formats = [
    "align",
    "background",
    "blockquote",
    "bold",
    "bullet",
    "code",
    "code-block",
    "color",
    "direction",
    "font",
    "formula",
    "header",
    "image",
    "indent",
    "italic",
    "link",
    "list",
    "script",
    "size",
    "strike",
    "table",
    "underline",
    "video",
  ];