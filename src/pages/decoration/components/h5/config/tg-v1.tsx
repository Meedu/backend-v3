import React, { useState, useEffect } from "react";
import styles from "./vod-v1.module.scss";
import { Input, Button, message } from "antd";
import { viewBlock } from "../../../../../api/index";
import { CloseIcon, SelectTuangou, ThumbBar } from "../../../../../components";
import editIcon from "../../../../../assets/images/decoration/h5/pc-edit.png";

interface PropInterface {
  block: any;
  onUpdate: () => void;
}

export const TgV1Set: React.FC<PropInterface> = ({ block, onUpdate }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [config, setConfig] = useState<any>({});
  const [showVodWin, setShowVodWin] = useState<boolean>(false);
  const [curVodIndex, setCurVodIndex] = useState<any>(null);

  useEffect(() => {
    if (block) {
      setConfig(block.config_render);
    }
  }, [block]);

  const save = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    viewBlock
      .update(block.id, {
        sort: block.sort,
        config: config,
      })
      .then((res: any) => {
        message.success("成功");
        setLoading(false);
        onUpdate();
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const changeCourse = (index: number) => {
    setCurVodIndex(index);
    setShowVodWin(true);
  };

  const addCourse = () => {
    let obj = { ...config };
    obj.items.push({
      title: null,
      thumb: null,
    });
    setCurVodIndex(obj.items.length - 1);
    setConfig(obj);
    setShowVodWin(true);
  };

  const delCourse = (index: number) => {
    let obj = { ...config };
    obj.items.splice(index, 1);
    setConfig(obj);
  };

  const vodChange = (vodCourse: any) => {
    if (curVodIndex === null) {
      return;
    }
    let obj = { ...config };
    Object.assign(obj.items[curVodIndex], vodCourse);
    setConfig(obj);
    setShowVodWin(false);
  };

  return (
    <div className={styles["vod-v1-box"]}>
      <div className={styles["title"]}>
        <div className={styles["text"]}>团购配置</div>
      </div>
      <div className={styles["config-item"]}>
        <div className={styles["config-item-title"]}>板块标题</div>
        <div className={styles["config-item-body"]}>
          <div className="float-left d-flex">
            <div className={styles["form-label"]}>标题</div>
            <div className="flex-1 ml-15">
              <Input
                value={config.title}
                placeholder="请输入标题"
                onChange={(e) => {
                  let value = e.target.value;
                  let obj = { ...config };
                  config.title = value;
                  setConfig(obj);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles["config-item"]}>
        <div className={styles["config-item-title"]}>板块内容</div>
        <div className={styles["config-item-body"]}>
          <div className={styles["courses-list-box"]}>
            {config.items &&
              config.items.length > 0 &&
              config.items.map((item: any, index: number) => (
                <div
                  className={styles["course-item"]}
                  key={index}
                  onClick={() => changeCourse(index)}
                >
                  {item.goods_thumb ? (
                    <>
                      {item.goods_type === "book" ? (
                        <ThumbBar
                          width={45}
                          value={item.goods_thumb}
                          height={60}
                          title=""
                          border={4}
                        ></ThumbBar>
                      ) : (
                        <ThumbBar
                          width={80}
                          value={item.goods_thumb}
                          height={60}
                          title=""
                          border={0}
                        ></ThumbBar>
                      )}
                    </>
                  ) : (
                    <img src={editIcon} width={80} height={60} />
                  )}
                  <div
                    className={styles["btn-del"]}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      delCourse(index);
                    }}
                  >
                    <CloseIcon></CloseIcon>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="float-left mt-15">
        <div className="float-left">
          <Button style={{ width: "100%" }} onClick={() => addCourse()}>
            添加团购课程
          </Button>
        </div>
      </div>
      <div className={styles["footer-button"]}>
        <Button
          type="primary"
          style={{ width: "100%" }}
          loading={loading}
          onClick={() => save()}
        >
          保存
        </Button>
      </div>
      <SelectTuangou
        open={showVodWin}
        onCancel={() => setShowVodWin(false)}
        onChange={(result: any) => {
          let item = {
            id: result.id,
            other_id: result.other_id,
            goods_type: result.goods_type,
            goods_title: result.goods_title,
            goods_thumb: result.goods_thumb,
            original_charge: result.original_charge,
            leader_charge: result.leader_charge,
            charge: result.charge,
            people_num: result.people_num,
            time_limit: result.time_limit,
            started_at: result.started_at,
            ended_at: result.ended_at,
            created_at: result.created_at,
          };
          vodChange(item);
        }}
      ></SelectTuangou>
    </div>
  );
};
