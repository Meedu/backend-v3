import React, { useState } from "react";
import styles from "./index.module.scss";
import { CodeSet } from "./code";
import { VodV1Set } from "./vod-v1";
import { LiveV1Set } from "./live-v1";
import { BookV1Set } from "./book-v1";
import { TopicV1Set } from "./topic-v1";
import { LearnPathV1Set } from "./learnPath-v1";
import { MsV1Set } from "./ms-v1";
import { TgV1Set } from "./tg-v1";

interface PropInterface {
  block: any;
  onUpdate: () => void;
}
export const ConfigSetting: React.FC<PropInterface> = ({ block, onUpdate }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const update = () => {
    onUpdate();
  };

  return (
    <div className={styles["config-index-box"]}>
      {(block.sign === "h5-vod-v1" || block.sign === "pc-vod-v1") && (
        <VodV1Set block={block} onUpdate={() => update()}></VodV1Set>
      )}
      {(block.sign === "h5-live-v1" || block.sign === "pc-live-v1") && (
        <LiveV1Set block={block} onUpdate={() => update()}></LiveV1Set>
      )}
      {(block.sign === "h5-book-v1" || block.sign === "pc-book-v1") && (
        <BookV1Set block={block} onUpdate={() => update()}></BookV1Set>
      )}
      {(block.sign === "h5-topic-v1" || block.sign === "pc-topic-v1") && (
        <TopicV1Set block={block} onUpdate={() => update()}></TopicV1Set>
      )}
      {(block.sign === "h5-learnPath-v1" ||
        block.sign === "pc-learnPath-v1") && (
        <LearnPathV1Set
          block={block}
          onUpdate={() => update()}
        ></LearnPathV1Set>
      )}
      {(block.sign === "h5-ms-v1" || block.sign === "pc-ms-v1") && (
        <MsV1Set block={block} onUpdate={() => update()}></MsV1Set>
      )}
      {(block.sign === "h5-tg-v1" || block.sign === "pc-tg-v1") && (
        <TgV1Set block={block} onUpdate={() => update()}></TgV1Set>
      )}
      {block.sign === "code" && (
        <CodeSet block={block} onUpdate={() => update()}></CodeSet>
      )}
    </div>
  );
};
