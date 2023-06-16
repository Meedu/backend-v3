import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import courseIcon from "../../../../../assets/images/decoration/h5/course-back.png";

interface PropInterface {
  config: any;
}

export const RenderLearnPath: React.FC<PropInterface> = ({ config }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className={styles["block-box-comp"]}>
      <div className={styles["title"]}>
        <div className={styles["text"]}>{config.title}</div>
        <div className={styles["more"]}>更多</div>
      </div>
      <div className={styles["body"]}>
        {config.items.length > 0 &&
          config.items.map((item: any, index: number) => (
            <div className={styles["path-item"]} key={index}>
              <div className={styles["path-body"]}>
                <div className={styles["path-title"]}>{item.name}</div>
                <div className={styles["path-desc"]}>{item.desc}</div>
                <div className={styles["path-info"]}>
                  <span>{item.steps_count || 0}个步骤</span>
                  <span>˙</span>
                  <span>{item.courses_count || 0}个课程</span>
                </div>
              </div>
              <div className={styles["path-thumb"]}>
                {item.thumb ? (
                  <img src={item.thumb} width={120} height={80} />
                ) : (
                  <img src={courseIcon} width={120} height={80} />
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
