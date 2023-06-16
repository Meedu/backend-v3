import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";

interface PropInterface {
  config: any;
}

export const RenderGzhV1: React.FC<PropInterface> = ({ config }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return <div className={styles["gzh-box"]}></div>;
};
