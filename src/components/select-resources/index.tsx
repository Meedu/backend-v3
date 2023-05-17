import { useEffect, useState } from "react";
import { Modal, message, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { VodComp } from "./components/vod";
import { LiveComp } from "./components/live";
import { RoleComp } from "./components/vip";
import { BookComp } from "./components/book";
import { LearnPathComp } from "./components/learn-path";
import { TopicComp } from "./components/topic";

interface PropsInterface {
  enabledResource: any;
  open: boolean;
  onSelected: (result: any) => void;
  onCancel: () => void;
}

export const SelectResources = (props: PropsInterface) => {
  const [selected, setSelected] = useState<any>(null);
  const [enabledResourceMap, setEnabledResourceMap] = useState<any>({});
  const [avaliableResources, setAvaliableResources] = useState<any>([]);
  const [resourceActive, setResourceActive] = useState<string>("vod");
  const enabledAddons = useSelector(
    (state: any) => state.enabledAddonsConfig.value.enabledAddons
  );

  useEffect(() => {
    if (!props.enabledResource) {
      setEnabledResourceMap({});
    } else {
      let items = props.enabledResource.split(",");
      let r: any = {};
      items.forEach((item: any) => {
        r[item] = 1;
      });
      setEnabledResourceMap(r);
    }
  }, [props.enabledResource]);

  useEffect(() => {
    let resources = [];

    if (enabledResourceMap["vod"]) {
      resources.push({
        label: "录播",
        key: "vod",
      });
    }

    if (enabledResourceMap["vip"]) {
      resources.push({
        label: "VIP会员",
        key: "vip",
      });
    }

    if (enabledResourceMap["video"]) {
      resources.push({
        label: "视频",
        key: "video",
      });
    }

    if (enabledResourceMap["live"] && enabledAddons["Zhibo"]) {
      resources.push({
        label: "直播",
        key: "live",
      });
    }

    if (enabledResourceMap["book"] && enabledAddons["MeeduBooks"]) {
      resources.push({
        label: "电子书",
        key: "book",
      });
    }

    if (enabledResourceMap["learnPath"] && enabledAddons["LearningPaths"]) {
      resources.push({
        label: "学习路径",
        key: "learn-path",
      });
    }

    if (enabledResourceMap["topic"] && enabledAddons["MeeduTopics"]) {
      resources.push({
        label: "图文",
        key: "topic",
      });
    }

    if (enabledAddons["Paper"]) {
      if (enabledResourceMap["paper"]) {
        resources.push({
          label: "试卷",
          key: "paper",
        });
      }
      if (enabledResourceMap["mock-paper"]) {
        resources.push({
          label: "模拟卷",
          key: "mock-paper",
        });
      }
      if (enabledResourceMap["practice"]) {
        resources.push({
          label: "练习",
          key: "practice",
        });
      }
    }
    setAvaliableResources(resources);
  }, [enabledResourceMap, enabledAddons]);

  const onChange = (key: string) => {
    setResourceActive(key);
  };

  const change = (result: any) => {
    setSelected(result);
  };

  return (
    <>
      {props.open && (
        <Modal
          title="选择"
          closable={false}
          onCancel={() => {
            props.onCancel();
          }}
          open={true}
          width={900}
          maskClosable={false}
          onOk={() => {
            if (!selected) {
              message.error("请先选择内容");
              return;
            }
            props.onSelected(selected);
          }}
        >
          <div className="float-left">
            <Tabs
              defaultActiveKey={resourceActive}
              items={avaliableResources}
              onChange={onChange}
            />
          </div>
          <div
            className="float-left"
            style={{
              maxHeight: 520,
              overflowX: "hidden",
              overflowY: "auto",
              marginBottom: 10,
            }}
          >
            {resourceActive === "vod" && <VodComp onChange={change}></VodComp>}
            {resourceActive === "vip" && (
              <RoleComp onChange={change}></RoleComp>
            )}
            {resourceActive === "live" && (
              <LiveComp onChange={change}></LiveComp>
            )}
            {resourceActive === "book" && (
              <BookComp onChange={change}></BookComp>
            )}
            {resourceActive === "learn-path" && (
              <LearnPathComp onChange={change}></LearnPathComp>
            )}
            {resourceActive === "topic" && (
              <TopicComp onChange={change}></TopicComp>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};
