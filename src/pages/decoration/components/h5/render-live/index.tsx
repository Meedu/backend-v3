import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import courseIcon from "../../../../../assets/images/decoration/h5/course-back.png";

interface PropInterface {
  config: any;
}

export const RenderLive: React.FC<PropInterface> = ({ config }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className={styles["live-block-box"]}>
      <div className={styles["title"]}>
        <div className={styles["text"]}>{config.title}</div>
        <div className={styles["more"]}>更多</div>
      </div>
      <div className={styles["body"]}>
        <div className={styles["courses-box"]}>
          {config.items.length > 0 &&
            config.items.map((item: any, index: number) => (
              <div className={styles["course-item"]} key={index}>
                <div className={styles["course-thumb"]}>
                  {item.thumb ? (
                    <img
                      src={item.thumb}
                      style={{ width: "100%" }}
                      height={124}
                    />
                  ) : (
                    <img
                      src={courseIcon}
                      style={{ width: "100%" }}
                      height={124}
                    />
                  )}
                </div>
                <div className={styles["course-title"]}>
                  <div className={styles["tit"]}>{item.title}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
