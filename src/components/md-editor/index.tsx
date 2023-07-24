import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { SelectImage } from "../../components";

interface PropInterface {
  height: number;
  defautValue: string;
  setContent: (value: string, renderValue: string) => void;
}

export const MdEditor: React.FC<PropInterface> = (props) => {
  const { height, defautValue, setContent } = props;
  const [value, setValue] = useState("");
  const [showUploadImage, setShowUploadImage] = useState<boolean>(false);

  useEffect(() => {
    if (defautValue) {
      setValue(defautValue);
    }
  }, [defautValue]);

  useEffect(() => {
    // 拿到渲染后的值
    let div: any = document.getElementById("render-content");
    let uselessA = div
      .getElementsByTagName("div")[0]
      .querySelectorAll(".anchor");
    for (let i = 0; i < uselessA.length; i++) {
      uselessA[i].remove();
    }
    let renderValue = div.getElementsByTagName("div")[0].innerHTML;
    setContent(value, renderValue);
  }, [value]);

  return (
    <>
      <div style={{ height: height || 300 }}>
        <MDEditor
          className="gooooooooo"
          height={height || 300}
          value={value}
          onChange={(newValue = "") => {
            setValue(newValue);
          }}
          components={{
            toolbar: (command, disabled, executeCommand) => {
              //   console.log(command.keyCommand);
              if (command.keyCommand === "image") {
                return (
                  <button
                    aria-label="Insert image"
                    disabled={disabled}
                    onClick={(evn) => {
                      evn.stopPropagation();
                      setShowUploadImage(true);
                      executeCommand(command, command.groupName);
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 20 20">
                      <path
                        fill="currentColor"
                        d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
                      ></path>
                    </svg>
                  </button>
                );
              }
            },
          }}
        />
        <div id="render-content" style={{ display: "none" }}>
          <MDEditor.Markdown
            source={value}
            style={{ whiteSpace: "pre-wrap" }}
          />
        </div>
        <SelectImage
          open={showUploadImage}
          from={0}
          onCancel={() => {
            let newValue = value;
            if (
              newValue.indexOf(
                "![image](https://example.com/your-image.png)"
              ) != -1
            ) {
              newValue = newValue.replace(
                "![image](https://example.com/your-image.png)",
                ""
              );
              setValue(newValue);
            }
            setShowUploadImage(false);
          }}
          onSelected={(url) => {
            let newValue = value;
            if (
              newValue.indexOf(
                "![image](https://example.com/your-image.png)"
              ) != -1
            ) {
              newValue = newValue.replace(
                "![image](https://example.com/your-image.png)",
                "![image](" + url + ")"
              );
              setValue(newValue);
            }
            setShowUploadImage(false);
          }}
        ></SelectImage>
      </div>
    </>
  );
};
