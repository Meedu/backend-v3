import React, { useState, useEffect } from "react";
import { Radio, Button, message } from "antd";
import { useSelector } from "react-redux";
import { H5Courses } from "./components/courses";

interface PropInterface {
  open: boolean;
  defautValue: any;
  onClose: () => void;
  onChange: (value: any) => void;
}

export const H5Link: React.FC<PropInterface> = ({
  open,
  defautValue,
  onClose,
  onChange,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [link, setLink] = useState<any>(null);
  const [tabActive, setTabActive] = useState("func");
  const [funcLinks, setFuncLinks] = useState<any>([]);
  const enabledAddons = useSelector(
    (state: any) => state.enabledAddonsConfig.value.enabledAddons
  );
  const enabledAddonsCount = useSelector(
    (state: any) => state.enabledAddonsConfig.value.enabledAddonsCount
  );
  const tabs = [
    {
      name: "功能",
      key: "func",
    },
    {
      name: "课程",
      key: "course",
    },
  ];

  useEffect(() => {
    setLink(defautValue);
  }, [defautValue]);

  useEffect(() => {
    if (open && enabledAddons) {
      getParams();
    }
  }, [open, enabledAddons]);

  useEffect(() => {
    setLink(null);
  }, [tabActive]);

  const getParams = () => {
    let links = [
      {
        name: "录播课",
        url: "/packageA/vod/index",
      },
    ];

    if (enabledAddons["Zhibo"]) {
      links.push({
        name: "直播课",
        url: "/packageA/live/index",
      });
    }

    if (enabledAddons["MeeduTopics"]) {
      links.push({
        name: "图文",
        url: "/packageA/topic/index",
      });
    }

    if (enabledAddons["MeeduBooks"]) {
      links.push({
        name: "电子书",
        url: "/packageA/book/index",
      });
    }

    if (enabledAddons["LearningPaths"]) {
      links.push({
        name: "学习路径",
        url: "/packageA/learnPath/index",
      });
    }
    if (enabledAddons["Wenda"]) {
      links.push({
        name: "问答",
        url: "/packageA/qa/index",
      });
    }

    if (enabledAddons["Paper"]) {
      links.push({
        name: "考试练习首页",
        url: "exam-index",
      });
      links.push({
        name: "在线考试",
        url: "/packageA/exam/paper/index",
      });
      links.push({
        name: "模拟考试",
        url: "/packageA/exam/mock/index",
      });
      links.push({
        name: "练习模式",
        url: "/packageA/exam/practice/index",
      });
    }
    if (enabledAddons["Credit1Mall"]) {
      links.push({
        name: "积分商城",
        url: "/packageA/member/credit1",
      });
    }
    setFuncLinks(links);
  };

  const submit = () => {
    if (!link) {
      message.warning("请选择链接");
      return;
    }

    let value = link;
    if (value === "/packageA/vod/index" && enabledAddonsCount === 0) {
      value = "/courses";
    }
    onChange(value);
  };

  return (
    <>
      {open && (
        <div className="meedu-dialog-mask">
          <div
            className="meedu-dialog-box"
            style={{ width: 900, marginLeft: -450 }}
          >
            <div className="meedu-dialog-header">选择链接</div>
            <div className="meedu-dialog-body">
              <div className="h5-link-box">
                <div className="tabs">
                  {tabs.map((item: any, index: number) => (
                    <div
                      className={
                        item.key === tabActive ? "active tab-item" : "tab-item"
                      }
                      key={index}
                      onClick={() => setTabActive(item.key)}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
                <div className="link-body">
                  {tabActive === "func" && (
                    <Radio.Group
                      onChange={(e) => {
                        setLink(e.target.value);
                      }}
                      value={link}
                    >
                      {funcLinks.map((item: any, index: number) => (
                        <div className="h5-func-link-item" key={index}>
                          <Radio value={item.url} checked={link === item.url}>
                            {item.name}
                          </Radio>
                        </div>
                      ))}
                    </Radio.Group>
                  )}
                  {tabActive === "course" && (
                    <H5Courses
                      onChange={(value: any) => {
                        setLink(value);
                      }}
                    ></H5Courses>
                  )}
                </div>
              </div>
            </div>
            <div className="meedu-dialog-footer">
              <Button type="primary" onClick={() => submit()}>
                确定
              </Button>
              <Button className="ml-10" onClick={() => onClose()}>
                取消
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
