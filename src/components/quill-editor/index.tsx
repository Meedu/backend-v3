import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import ReactQuill from "react-quill";
import { SelectImage } from "../../components";
import "react-quill/dist/quill.snow.css";

interface PropInterface {
  height: number;
  isFormula: boolean;
  defautValue: string;
  mode: string;
  setContent: (value: string) => void;
}

declare const window: any;

export const QuillEditor: React.FC<PropInterface> = (props) => {
  const { height, isFormula, defautValue, mode, setContent } = props;
  let refs: any = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState("");
  const [showUploadImage, setShowUploadImage] = useState<boolean>(false);
  const modules = React.useMemo(
    () => ({
      toolbar: {
        container:
          mode && mode === "remark"
            ? [
                ["bold", "italic", "underline", "strike"],
                ["blockquote", "code-block"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ size: ["small", false, "large", "huge"] }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ color: [] }, { background: [] }],
              ]
            : [
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
        handlers: {
          image: () => setShowUploadImage(true),
        },
      },
      formula: isFormula,
    }),
    [isFormula, mode]
  );

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
        className="quill-editor-box"
        style={{ height: height }}
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
        placeholder="请输入内容..."
        readOnly={false}
      />
      <SelectImage
        open={showUploadImage}
        from={1}
        onCancel={() => setShowUploadImage(false)}
        onSelected={(url) => {
          let quill = refs?.current.getEditor();
          let length = quill.selection.savedRange.index;
          quill.insertEmbed(length, "image", url);
          quill.setSelection(length + 1);
          setShowUploadImage(false);
        }}
      ></SelectImage>
    </>
  );
};
