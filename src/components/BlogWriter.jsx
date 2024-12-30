import React, { useEffect, useState } from "react";
import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertToRaw,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";
import { Box, TextField } from "@mui/material";

const MyEditor = ({
  currentBlog,
  blogs,
  setBlogs,
  isEditing,
  handleDialogClose,
  setCurrentBlog,
}) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  console.log(localStorage.getItem("userId"));
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [htmlContent, setHtmlContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing && currentBlog?.jsxcode) {
      const blocksFromHTML = convertFromHTML(currentBlog.jsxcode);
      console.log(currentBlog.jsxcode);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      setEditorState(EditorState.createWithContent(contentState));
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [isEditing, currentBlog]);

  // Image Upload Callback (Base64 Upload)
  const uploadImageCallback = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setError(""); // Clear any previous errors
        resolve({ data: { link: e.target.result } });
      };
      reader.onerror = (error) => {
        setError("Image upload failed. Please try again.");
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  // Function to convert content to HTML
  const handleConvertToHTML = () => {
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      setError("Editor content is empty. Please add some text.");
      return;
    }
    const rawContentState = convertToRaw(contentState);
    const html = draftToHtml(rawContentState);
    console.log(html)
    handleSubmit(html);
    setHtmlContent(html);
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("https://biz-connect-livid.vercel.app/api/v1/blogs");
      setBlogs(response.data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  const handleSubmit = async (jsxcode) => {
    try {
      console.log(isEditing)
      if (isEditing) {
        console.log(currentBlog,'current--->')
        await axios.put(
          `https://biz-connect-livid.vercel.app/api/v1/blogs/${currentBlog._id}`,
          {
            author: localStorage.getItem("userId"),
            title: currentBlog.title,
            jsxcode: jsxcode,
            category:currentBlog.category
          }
        );
        setAlert({
          open: true,
          message: "Blog updated successfully",
          severity: "success",
        });
      } else {
        console.log("ahbish");
        await axios.post("https://biz-connect-livid.vercel.app/api/v1/blogs", {
          author: localStorage.getItem("userId"),
          title: currentBlog.title,
          jsxcode: jsxcode,
          category:currentBlog.category
        });
        setAlert({
          open: true,
          message: "Blog created successfully",
          severity: "success",
        });
      }
      fetchBlogs();
      handleDialogClose();
    } catch (error) {
      setAlert({
        open: true,
        message: "Failed to save blog",
        severity: "error",
      });
    }
  };

  // Reset the editor
  const handleResetEditor = () => {
    setEditorState(EditorState.createEmpty());
    setHtmlContent("");
    setError("");
  };

  // Inline styles
  const styles = {
    container: {
      minHeight: "100vh",
      padding: "24px",
      backgroundColor: "#f8f9fa",
    },
    header: {
      fontSize: "24px",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "24px",
    },
    editorWrapper: {
      backgroundColor: "#fff",
      padding: "16px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    editor: {
      minHeight: "200px",
      padding: "12px",
      backgroundColor: "#f4f4f4",
      borderRadius: "4px",
      border: "1px solid #ccc",
      color: "black",
    },
    toolbar: {
      marginBottom: "8px",
    },
    button: {
      padding: "10px 16px",
      marginRight: "8px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      color: "#fff",
      backgroundColor: "#28a745",
    },
    buttonReset: {
      backgroundColor: "#dc3545",
    },
    error: {
      marginTop: "16px",
      color: "#dc3545",
      fontWeight: "bold",
    },
    contentWrapper: {
      marginTop: "24px",
      padding: "24px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
    },
    contentHeader: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "12px",
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>Add a new post</header>
      <Box sx={{ marginBottom: "16px",display:'flex',gap:'15px',paddingX:'20px' }}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          sx={{ color: "black" }}
          value={currentBlog?.title || ""}
          onChange={(e) =>
            setCurrentBlog({ ...currentBlog, title: e.target.value })
          }
        />
        <TextField
          label="Category"
          variant="outlined"
          fullWidth
          sx={{ color: "black" }}
          value={currentBlog?.category || ""}
          onChange={(e) =>{
            console.log(currentBlog)
            setCurrentBlog({ ...currentBlog, category: e.target.value })}
          }
        />
      </Box>

      <div style={styles.editorWrapper}>
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          toolbar={{
            options: [
              "inline",
              "blockType",
              "fontSize",
              "fontFamily",
              "list",
              "textAlign",
              "colorPicker",
              "link",
              "embedded",
              "emoji",
              "image",
              "remove",
              "history",
            ],
            inline: {
              options: [
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "monospace",
                "superscript",
                "subscript",
              ],
            },
            blockType: {
              options: [
                "Normal",
                "H1",
                "H2",
                "H3",
                "H4",
                "H5",
                "H6",
                "Blockquote",
                "Code",
              ],
            },
            fontSize: {
              options: [
                8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96,
              ],
            },
            fontFamily: {
              options: [
                "Arial",
                "Georgia",
                "Impact",
                "Tahoma",
                "Times New Roman",
                "Verdana",
              ],
            },
            image: {
              uploadCallback: uploadImageCallback,
              previewImage: true,
              alt: { present: true, mandatory: false },
            },
            colorPicker: {
              popupClassName: "custom-color-popup",
            },
            embedded: {
              defaultSize: {
                height: "315",
                width: "560",
              },
            },
          }}
          wrapperStyle={{ border: "1px solid #ccc", borderRadius: "8px" }}
          editorStyle={styles.editor}
          toolbarStyle={styles.toolbar}
        />

        {error && <div style={styles.error}>{error}</div>}

        <div style={{ marginTop: "16px" }}>
          <button style={styles.button} onClick={handleConvertToHTML}>
            Extract HTML Content
          </button>
          <button
            style={{ ...styles.button, ...styles.buttonReset }}
            onClick={handleResetEditor}
          >
            Reset Editor
          </button>
        </div>
      </div>

      {(htmlContent || currentBlog?.jsxcode?.length > 2) && (
        <div style={styles.contentWrapper}>
          <h3 style={styles.contentHeader}>Rendered HTML Content:</h3>
          <div
            dangerouslySetInnerHTML={{
              __html:
                currentBlog?.jsxcode?.length > 0
                  ? currentBlog.jsxcode
                  : htmlContent,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MyEditor;
