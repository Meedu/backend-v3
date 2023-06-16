import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { Select } from "antd";
import { useSelector } from "react-redux";
import { VodComp } from "./vod-comp";
import { LiveComp } from "./live-comp";

interface PropInterface {
  onChange: (value: any) => void;
}

export const H5Courses: React.FC<PropInterface> = ({ onChange }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [courseTypes, setCourseTypes] = useState<any>([]);
  const [typeActive, setTypeActive] = useState("vod");
  const enabledAddons = useSelector(
    (state: any) => state.enabledAddonsConfig.value.enabledAddons
  );

  useEffect(() => {
    let types = [
      {
        label: "录播课程",
        value: "vod",
      },
    ];

    if (enabledAddons["Zhibo"]) {
      types.push({
        label: "直播课程",
        value: "live",
      });
    }

    if (enabledAddons["MeeduBooks"]) {
      types.push({
        label: "电子书",
        value: "book",
      });
    }

    if (enabledAddons["MeeduTopics"]) {
      types.push({
        label: "图文",
        value: "topic",
      });
    }

    if (enabledAddons["Paper"]) {
      types.push({
        label: "试卷",
        value: "paper",
      });

      types.push({
        label: "模拟试卷",
        value: "mock-paper",
      });

      types.push({
        label: "练习",
        value: "practice",
      });
    }
    if (enabledAddons["LearningPaths"]) {
      types.push({
        label: "学习路径",
        value: "learnPath",
      });
    }
    setCourseTypes(types);
  }, [enabledAddons]);

  return (
    <div className="float-left" style={{ position: "relative" }}>
      <div className={styles["select-box"]}>
        <div className={styles["form-label"]}>请选择课程类型</div>
        <div className="ml-15">
          <Select
            style={{ width: 200 }}
            value={typeActive}
            onChange={(e) => {
              setTypeActive(e);
            }}
            allowClear
            placeholder="课程类型"
            options={courseTypes}
          />
        </div>
      </div>
      <div className="float-left">
        {typeActive === "vod" && (
          <VodComp
            onChange={(value: any) => {
              onChange(value);
            }}
          ></VodComp>
        )}
        {typeActive === "live" && (
          <LiveComp
            onChange={(value: any) => {
              onChange(value);
            }}
          ></LiveComp>
        )}
      </div>
    </div>
  );
};
