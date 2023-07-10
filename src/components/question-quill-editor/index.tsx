import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import ReactQuill from "react-quill";
import { SelectImage } from "../../components";
import "react-quill/dist/quill.snow.css";

interface PropInterface {
  height: number;
  isFormula: boolean;
  defautValue: string;
  setContent: (value: string) => void;
}

declare const window: any;

export const QuestionQuillEditor: React.FC<PropInterface> = (props) => {
  const { height, isFormula, defautValue, setContent } = props;
  let refs: any = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState("");
  const [showUploadImage, setShowUploadImage] = useState<boolean>(false);
  const modules = {
    toolbar: {
      container: isFormula
        ? ["image", "formula"]
        : ["bold", "italic", "underline", "strike", "image"],
      handlers: {},
    },
    formula: isFormula,
  };
  const imageHandler = () => {
    setShowUploadImage(true);
    console.log(111);
  };

  useEffect(() => {
    if (value) {
      let text = "";
      if (value !== "<p><br></p>") {
        text = value;
      }
      setContent(text);
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
        ref={refs}
        className={
          height === 40
            ? styles["quill-editor-h40-box"]
            : styles["quill-editor-box"]
        }
        style={{ minHeight: height }}
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
