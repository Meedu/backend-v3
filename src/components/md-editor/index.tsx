import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import MDEditor from "@uiw/react-md-editor";
import { SelectImage } from "../../components";

interface PropInterface {
  height: number;
  defautValue: string;
  setContent: (value: string) => void;
}

export const MdEditor: React.FC<PropInterface> = (props) => {
  const { height, defautValue, setContent } = props;
  const [value, setValue] = useState("");

  useEffect(() => {
    if (defautValue) {
      setValue(defautValue);
    }
  }, [defautValue]);

  return (
    <>
      <div style={{ height: height || 300 }}>
        <MDEditor
          height={height || 300}
          value={value}
          onChange={(newValue = "") => {
            setValue(newValue);
            setContent(newValue);
          }}
        />
        <MDEditor.Markdown source={value} style={{ whiteSpace: "pre-wrap" }} />
      </div>
    </>
  );
};
