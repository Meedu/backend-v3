import React, { useState, useEffect } from "react";
import { Radio, Button, Space, message, Switch } from "antd";
import { useSelector } from "react-redux";

interface PropInterface {
  open: boolean;
  defautValue: any;
  onClose: () => void;
  onChange: (value: any) => void;
}

export const PCLink: React.FC<PropInterface> = ({
  open,
  defautValue,
  onClose,
  onChange,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [funcLinks, setFuncLinks] = useState<any>([]);
  const [link, setLink] = useState<any>(null);
  const enabledAddons = useSelector(
    (state: any) => state.enabledAddonsConfig.value.enabledAddons
  );

  useEffect(() => {
    setLink(defautValue);
  }, [defautValue]);

  useEffect(() => {
    if (open && enabledAddons) {
      getParams();
    }
  }, [open, enabledAddons]);

  const getParams = () => {
    let links = [
      {
        name: "首页",
        url: "/",
        active: "index",
      },
      {
        name: "录播课",
        url: "/courses",
        active: "courses,course.show,video.show",
      },
    ];

    if (enabledAddons["Zhibo"]) {
      links.push({
        name: "直播课",
        url: "/live",
        active: "zhibo.course.index,zhibo.course.show,zhibo.course.play",
      });
    }

    if (enabledAddons["MeeduTopics"]) {
      links.push({
        name: "图文",
        url: "/topic",
        active: "topic,topic.show",
      });
    }

    if (enabledAddons["MeeduBooks"]) {
      links.push({
        name: "电子书",
        url: "/book",
        active: "books,book.show,book.read",
      });
    }

    if (enabledAddons["LearningPaths"]) {
      links.push({
        name: "学习路径",
        url: "/learnPath",
        active: "learning_path.index,learning_path.show",
      });
    }

    if (enabledAddons["Wenda"]) {
      links.push({
        name: "问答",
        url: "/wenda",
        active:
          "wenda.question.index,wenda.question.show,wenda.question.create,wenda.question.edit",
      });
    }

    if (enabledAddons["CodeExchanger"]) {
      links.push({
        name: "兑换码",
        url: "/member/code-exchanger",
        active: "exchanger",
      });
    }

    if (enabledAddons["Paper"]) {
      links.push({
        name: "考试练习首页",
        url: "/exam",
        active: "papers,paper.show",
      });
      links.push({
        name: "在线考试",
        url: "/exam/papers",
        active: "papers,paper.show",
      });
      links.push({
        name: "模拟考试",
        url: "/exam/mockpaper",
        active: "exam.mock_paper,exam.mock_paper.show",
      });
      links.push({
        name: "练习模式",
        url: "/exam/practice",
        active: "practices,practice.show",
      });
    }

    if (enabledAddons["MultiLevelShare"]) {
      links.push({
        name: "分销课程",
        url: "/share",
        active: "share,share.show",
      });
    }
    setFuncLinks(links);
  };

  const submit = () => {
    if (!link) {
      message.warning("请选择链接");
      return;
    }
    onChange(link);
  };

  return (
    <>
      {open && (
        <div className="meedu-dialog-mask">
          <div className="meedu-dialog-box">
            <div className="meedu-dialog-header">选择链接</div>
            <div className="meedu-dialog-body">
              <Radio.Group
                onChange={(e) => {
                  setLink(e.target.value);
                }}
                value={link}
              >
                {funcLinks.map((item: any, index: number) => (
                  <div className="func-link-item" key={index}>
                    <Radio value={item.url} checked={link === item.url}>
                      {item.name}
                    </Radio>
                  </div>
                ))}
              </Radio.Group>
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
