import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import courseIcon from "../../../../../assets/images/decoration/h5/course-back.png";

interface PropInterface {
  config: any;
}

export const RenderTopic: React.FC<PropInterface> = ({ config }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className={styles["block-box-comp"]}>
      <div className={styles["title"]}>
        <div className={styles["text"]}>{config.title}</div>
        <div className={styles["more"]}>更多</div>
      </div>
      <div className={styles["body"]}>
        {config.items.length === 0 &&
          Array.from({ length: 2 }).map((_, i) => (
            <div className={styles["topic-item"]} key={i}>
              <div className={styles["topic-body"]}>
                <div className={styles["topic-title"]}>图文一</div>
                <div className={styles["topic-info"]}></div>
              </div>
              <div className={styles["topic-thumb"]}>
                <img src={courseIcon} width={120} height={90} />
              </div>
            </div>
          ))}
        {config.items.length > 0 &&
          config.items.map((item: any, index: number) => (
            <div className={styles["topic-item"]} key={index}>
              <div className={styles["topic-body"]}>
                <div className={styles["topic-title"]}>{item.title}</div>
                <div className={styles["topic-info"]}>
                  <span>{item.view_times || 0}阅读</span>
                  <span className="ml-15">{item.comment_times || 0}评论</span>
                </div>
              </div>
              <div className={styles["topic-thumb"]}>
                {item.thumb ? (
                  <img src={item.thumb} width={120} height={90} />
                ) : (
                  <img src={courseIcon} width={120} height={90} />
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
