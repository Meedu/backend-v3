import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import courseIcon from "../../../../../assets/images/decoration/h5/course-back.png";
import { ThumbBar } from "../../../../../components";

interface PropInterface {
  config: any;
}

export const RenderTg: React.FC<PropInterface> = ({ config }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className={styles["block-box-comp"]}>
      <div className={styles["title"]}>
        <div className={styles["text"]}>{config.title}</div>
      </div>
      <div className={styles["body"]}>
        <div className={styles["tg-box"]}>
          {config.items.length > 0 &&
            config.items.map((item: any, index: number) => (
              <div className={styles["tg-item"]} key={index}>
                <div className={styles["tg-thumb"]}>
                  <div className={styles["tg-icon"]}>拼团中</div>
                  {item.goods_thumb ? (
                    item.goods_type === "book" ? (
                      <ThumbBar
                        width={67.5}
                        value={item.goods_thumb}
                        height={90}
                        title=""
                        border={4}
                      ></ThumbBar>
                    ) : (
                      <ThumbBar
                        width={120}
                        value={item.goods_thumb}
                        height={90}
                        title=""
                        border={0}
                      ></ThumbBar>
                    )
                  ) : (
                    <img src={courseIcon} width={120} height={90} />
                  )}
                </div>
                <div className={styles["tg-body"]}>
                  <div className={styles["tg-goods-title"]}>
                    {item.goods_title}
                  </div>
                  <div className={styles["tg-info"]}>
                    {item.goods_type_text && (
                      <div className={styles["tg-sub"]}>
                        {item.goods_type_text}
                      </div>
                    )}
                    <div className={styles["tg-original_charge"]}>
                      原价:￥{item.original_charge || 0}
                    </div>
                    <div className={styles["tg-charge"]}>
                      {!item.charge && (
                        <span className={styles["free"]}>免费</span>
                      )}
                      {item.charge > 0 && (
                        <>
                          <span className={styles["unit"]}>￥</span>
                          {item.charge}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
