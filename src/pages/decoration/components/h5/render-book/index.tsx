import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import bookIcon from "../../../../../assets/images/decoration/h5/book-back.png";

interface PropInterface {
  config: any;
}

export const RenderBook: React.FC<PropInterface> = ({ config }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className={styles["book-block-box"]}>
      <div className={styles["title"]}>
        <div className={styles["text"]}>{config.title}</div>
        <div className={styles["more"]}>更多</div>
      </div>
      <div className={styles["body"]}>
        {config.items.length === 0 &&
          Array.from({ length: 2 }).map((_, i) => (
            <div className={styles["book-item"]} key={i}>
              <div className={styles["book-thumb"]}>
                <img src={bookIcon} width={90} height={120} />
              </div>
              <div className={styles["book-body"]}>
                <div className={styles["book-name"]}>电子书一</div>
                <div className={styles["book-desc"]}></div>
                <div className={styles["book-info"]}>
                  <div className={styles["sub"]}></div>
                  <div className={styles["price"]}>
                    <span className={styles["free"]}>免费</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {config.items.length > 0 &&
          config.items.map((item: any, index: number) => (
            <div className={styles["book-item"]} key={index}>
              <div className={styles["book-thumb"]}>
                {item.thumb ? (
                  <img src={item.thumb} width={90} height={120} />
                ) : (
                  <img src={bookIcon} width={90} height={120} />
                )}
              </div>
              <div className={styles["book-body"]}>
                <div className={styles["book-name"]}>{item.name}</div>
                <div className={styles["book-desc"]}>{item.short_desc}</div>
                <div className={styles["book-info"]}>
                  <div className={styles["sub"]}>
                    <span>{item.user_count || 0}人已订阅</span>
                  </div>
                  <div className={styles["price"]}>
                    {!item.charge && (
                      <span className={styles["free"]}>免费</span>
                    )}
                    {item.charge > 0 && (
                      <>
                        <small className={styles["unit"]}>￥</small>
                        <span>{item.charge}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
