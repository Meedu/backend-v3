import { useState, useEffect } from "react";
import { Tabs } from "antd";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { titleAction } from "../../../store/user/loginUserSlice";
import { BackBartment } from "../../../components";
import { WatchRecords } from "./components/watch-records";
import { SubUsers } from "./components/sub-users";

const MockPaperUsersPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const user = useSelector((state: any) => state.loginUser.value.user);
  const [resourceActive, setResourceActive] = useState<string>("");
  const [avaliableResources, setAvaliableResources] = useState<any>([]);
  const [id, setId] = useState(Number(result.get("id")));

  useEffect(() => {
    document.title = "模拟试卷学员";
    dispatch(titleAction("模拟试卷学员"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
  }, [result.get("id")]);

  useEffect(() => {
    let data: any = [];
    if (through("addons.Paper.mock_paper.records")) {
      data.push({
        label: "考试记录",
        key: "watch-records",
      });
    }
    if (through("addons.Paper.mock_paper.statistics")) {
      data.push({
        label: "考试统计",
        key: "statistics",
      });
    }
    if (through("addons.Paper.mock_paper.users")) {
      data.push({
        label: "付费学员",
        key: "sub-users",
      });
    }
    setResourceActive(data[0].key);
    setAvaliableResources(data);
  }, [user]);

  const through = (val: string) => {
    if (!user.permissions) {
      return;
    }
    return typeof user.permissions[val] !== "undefined";
  };

  const onChange = (key: string) => {
    setResourceActive(key);
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="模拟试卷学员" />
      <div className="float-left mt-30">
        <Tabs
          defaultActiveKey={resourceActive}
          items={avaliableResources}
          onChange={onChange}
        />
      </div>
      <div className="float-left">
        {resourceActive === "watch-records" && (
          <WatchRecords id={id}></WatchRecords>
        )}
        {resourceActive === "sub-users" && <SubUsers id={id}></SubUsers>}
        {resourceActive === "statistics" && <></>}
      </div>
    </div>
  );
};

export default MockPaperUsersPage;