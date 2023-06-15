import React, { useState } from "react";
import styles from "./index.module.scss";
import { CodeSet } from "./code";
import { VodV1Set } from "./vod-v1";

interface PropInterface {
  block: any;
  onUpdate: () => void;
}
export const ConfigSetting: React.FC<PropInterface> = ({ block, onUpdate }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const update = () => {
    onUpdate();
  };

  return (
    <div className={styles["config-index-box"]}>
      {(block.sign === "h5-vod-v1" || block.sign === "pc-vod-v1") && (
        <VodV1Set block={block} onUpdate={() => update()}></VodV1Set>
      )}
      {block.sign === "code" && (
        <CodeSet block={block} onUpdate={() => update()}></CodeSet>
      )}
    </div>
  );
};
