import { useEffect, useState } from "react";
import { Modal, message, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { VodComp } from "./components/multiVod";
import { LiveComp } from "./components/multiLive";
import { RoleComp } from "./components/multiVip";
import { BookComp } from "./components/multiBook";
import { PaperComp } from "./components/multiPaper";
import { PracticeComp } from "./components/multiPractice";
import { MockPaperComp } from "./components/multiMockPaper";

interface PropsInterface {
  enabledResource: any;
  open: boolean;
  selectedVod: any;
  selectedLive: any;
  selectedBook: any;
  selectedPaper: any;
  selectedMockPaper: any;
  selectedPractice: any;
  selectedVip: any;
  type: boolean;
  onSelected: (result: any) => void;
  onCancel: () => void;
}

export const SelectResourcesMulti = (props: PropsInterface) => {
  const [selected, setSelected] = useState<any>(null);
  const [enabledResourceMap, setEnabledResourceMap] = useState<any>({});
  const [avaliableResources, setAvaliableResources] = useState<any>([]);
  const [resourceActive, setResourceActive] = useState<string>("");
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
    if (enabledResourceMap["paper"] && !props.type) {
      setResourceActive("paper");
    } else {
      setResourceActive("vod");
    }
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

    if (enabledAddons["Paper"]) {
      if (enabledResourceMap["paper"]) {
        resources.push({
          label: "试卷",
          key: "paper",
        });
      }
      if (enabledResourceMap["mock_paper"]) {
        resources.push({
          label: "模拟卷",
          key: "mock_paper",
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
      {props.open ? (
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
            if (!selected || selected.length === 0) {
              message.error("请先选择内容");
              return;
            }
            props.onSelected(selected);
          }}
          centered
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
            {resourceActive === "vod" && (
              <VodComp selected={props.selectedVod} onChange={change}></VodComp>
            )}
            {resourceActive === "vip" && (
              <RoleComp
                selected={props.selectedVip}
                onChange={change}
              ></RoleComp>
            )}
            {resourceActive === "live" && (
              <LiveComp
                selected={props.selectedLive}
                onChange={change}
              ></LiveComp>
            )}
            {resourceActive === "book" && (
              <BookComp
                selected={props.selectedBook}
                onChange={change}
              ></BookComp>
            )}
            {resourceActive === "paper" && (
              <PaperComp
                selected={props.selectedPaper}
                onChange={change}
              ></PaperComp>
            )}
            {resourceActive === "practice" && (
              <PracticeComp
                selected={props.selectedPractice}
                onChange={change}
              ></PracticeComp>
            )}
            {resourceActive === "mock-paper" && (
              <MockPaperComp
                selected={props.selectedMockPaper}
                onChange={change}
              ></MockPaperComp>
            )}
          </div>
        </Modal>
      ) : null}
    </>
  );
};
