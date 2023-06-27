import React, { useState } from "react";
import styles from "./index.module.scss";
import { ThumbBar } from "../../../../../components";
import backIcon from "../../../../../assets/images/decoration/h5/course-back.png";

interface PropInterface {
  config: any;
}

export const RenderLearnPath: React.FC<PropInterface> = ({ config }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="float-left">
      <div className={styles["title"]}>{config.title}</div>
      <div className={styles["learn-path-box"]}>
        {config.items.length > 0 &&
          config.items.map((item: any, index: number) => (
            <div className={styles["path-item"]} key={index}>
              <div className={styles["path-thumb"]}>
                {item.thumb ? (
                  <ThumbBar
                    width={173}
                    value={item.thumb}
                    height={130}
                    title=""
                    border={0}
                  ></ThumbBar>
                ) : (
                  <img src={backIcon} width={173} height={130} />
                )}
              </div>
              <div className={styles["path-body"]}>
                <div className={styles["path-title"]}>{item.name}</div>
                <div className={styles["path-charge"]}>
                  {item.charge === 0 ? (
                    <div className={styles["charge"]}>
                      <span className={styles["free"]}>免费</span>
                    </div>
                  ) : (
                    <div className={styles["charge"]}>
                      <span className={styles["unit"]}>￥</span>
                      {item.charge}
                    </div>
                  )}
                  <div className={styles["count"]}>
                    <span>{item.steps_count}个步骤</span>
                    <span className="ml-10">{item.courses_count}个课程</span>
                  </div>
                </div>
                <div className={styles["path-desc"]}>{item.desc}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
