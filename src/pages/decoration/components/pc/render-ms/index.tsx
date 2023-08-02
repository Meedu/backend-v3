import React, { useState } from "react";
import styles from "./index.module.scss";
import { ThumbBar } from "../../../../../components";
import backIcon from "../../../../../assets/images/decoration/h5/course-back.png";

interface PropInterface {
  config: any;
}

export const RenderMiaosha: React.FC<PropInterface> = ({ config }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="float-left">
      <div className={styles["title"]}>{config.title}</div>
      <div className={styles["ms-box"]}>
        {config.items.length > 0 &&
          config.items.map((item: any, index: number) => (
            <div className={styles["ms-item"]} key={index}>
              <div className={styles["ms-thumb"]}>
                {item.goods_thumb ? (
                  <>
                    {item.goods_type === "book" ? (
                      <ThumbBar
                        width={148.5}
                        value={item.goods_thumb}
                        height={198}
                        title=""
                        border={8}
                      ></ThumbBar>
                    ) : (
                      <ThumbBar
                        width={264}
                        value={item.goods_thumb}
                        height={198}
                        title=""
                        border={0}
                      ></ThumbBar>
                    )}
                  </>
                ) : (
                  <img src={backIcon} width={"100%"} />
                )}
              </div>
              <div className={styles["ms-title"]}>{item.goods_title}</div>
              <div className={styles["ms-charge"]}>
                <div className={styles["charge"]}>
                  {item.charge === 0 ? (
                    <div className={styles["now-charge"]}>
                      <span className={styles["free"]}>免费</span>
                    </div>
                  ) : (
                    <div className={styles["now-charge"]}>
                      <span className={styles["unit"]}>￥</span>
                      {item.charge}
                    </div>
                  )}
                  <div className={styles["ori-charge"]}>
                    <span className={styles["unit"]}>￥</span>
                    {item.original_charge}
                  </div>
                </div>
                <div className={styles["options"]}>
                  <div className={styles["btn-go"]}>立即抢购</div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
