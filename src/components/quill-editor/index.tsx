import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface PropInterface {
  height: number;
  isFormula: boolean;
  defautValue: string;
  setContent: (value: string) => void;
}

export const QuillEditor: React.FC<PropInterface> = ({
  height,
  isFormula,
  defautValue,
  setContent,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState("");
  const [modules, setModules] = useState<any>({
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["formula"],
        ["link", "video", "image"],
      ],
    },
    formula: isFormula,
  });

  useEffect(() => {
    if (value) {
      setContent(value);
    }
  }, [value]);

  useEffect(() => {
    if (defautValue) {
      setValue(defautValue);
    }
  }, [defautValue]);

  return (
    <>
      <ReactQuill
        className="quill-editor-box"
        style={{ height: height }}
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        placeholder="请输入内容..."
        readOnly={false}
      />
    </>
  );
};
