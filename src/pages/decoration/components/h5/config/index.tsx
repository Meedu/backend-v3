import React, { useState } from "react";
import styles from "./index.module.scss";
import { CodeSet } from "./code";

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
      {block.sign === "code" && (
        <CodeSet block={block} onUpdate={() => update()}></CodeSet>
      )}
    </div>
  );
};
