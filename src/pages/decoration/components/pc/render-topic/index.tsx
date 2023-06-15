import React, { useState } from "react";
import styles from "./index.module.scss";
import { ThumbBar } from "../../../../../components";
import backIcon from "../../../../../assets/images/decoration/h5/course-back.png";

interface PropInterface {
  config: any;
}

export const RenderTopic: React.FC<PropInterface> = ({ config }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="float-left">
      <div className={styles["title"]}>{config.title}</div>
      <div className={styles["topics-box"]}>
        {config.items.length > 0 &&
          config.items.map((item: any, index: number) => (
            <div className={styles["topic-item"]} key={index}>
              <div className={styles["topic-thumb"]}>
                {item.thumb ? (
                  <ThumbBar
                    width={133}
                    value={item.thumb}
                    height={100}
                    title=""
                    border={0}
                  ></ThumbBar>
                ) : (
                  <img src={backIcon} width={133} height={100} />
                )}
              </div>
              <div className={styles["topic-body"]}>
                <div className={styles["topic-title"]}>{item.title}</div>
                <div className={styles["topic-info"]}>
                  <div className={styles["topic-category"]}>
                    {item.category && (
                      <span className={styles["category"]}>
                        {item.category.name}
                      </span>
                    )}
                  </div>
                  <div className={styles["view-times"]}>
                    {item.view_times}次阅读
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
