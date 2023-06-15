import React, { useState } from "react";
import styles from "./index.module.scss";
import { ThumbBar } from "../../../../../components";
import backIcon from "../../../../../assets/images/decoration/h5/course-back.png";

interface PropInterface {
  config: any;
}

export const RenderBook: React.FC<PropInterface> = ({ config }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="float-left">
      <div className={styles["vod-title"]}>{config.title}</div>
      <div className={styles["vod-courses-box"]}>
        {config.items.length > 0 &&
          config.items.map((item: any, index: number) => (
            <div className={styles["vod-item"]} key={index}>
              <div className={styles["course-thumb"]}>
                {item.thumb ? (
                  <div
                    style={{ display: "inline-block", width: 120, height: 160 }}
                  >
                    <ThumbBar
                      width={120}
                      value={item.thumb}
                      height={160}
                      title=""
                      border={8}
                    ></ThumbBar>
                  </div>
                ) : (
                  <img src={backIcon} width={"100%"} />
                )}
              </div>
              <div className={styles["course-title"]}>{item.name}</div>
              <div className={styles["book-charge"]}>
                <span className={styles["unit"]}>￥</span>
                {item.charge}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
