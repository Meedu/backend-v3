import { useState, useEffect } from "react";
import { Tabs } from "antd";
import { useLocation, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { titleAction } from "../../../store/user/loginUserSlice";
import { BackBartment } from "../../../components";
import { WatchRecords } from "./components/watch-records";
import { SubUsers } from "./components/sub-users";

interface LocalSearchParamsInterface {
  page?: number;
  size?: number;
  resourceActive?: string;
}

const PracticeUsersPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    size: "10",
    resourceActive: "watch-user",
  });
  const resourceActive = searchParams.get("resourceActive") || "";

  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state.loginUser.value.user);
  const [avaliableResources, setAvaliableResources] = useState<any>([]);
  const [id, setId] = useState(Number(result.get("id")));

  useEffect(() => {
    document.title = "参与学员";
    dispatch(titleAction("参与学员"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
  }, [result.get("id")]);

  useEffect(() => {
    let data: any = [];
    if (through("addons.Paper.practice.user.all")) {
      data.push({
        label: "练习记录",
        key: "watch-records",
      });
    }
    if (through("addons.Paper.practice.users")) {
      data.push({
        label: "付费学员",
        key: "sub-users",
      });
    }
    resetLocalSearchParams({
      page: 1,
      size: 10,
      resourceActive: data[0].key,
    });
    setAvaliableResources(data);
  }, [user]);

  const resetLocalSearchParams = (params: LocalSearchParamsInterface) => {
    setSearchParams(
      (prev) => {
        if (typeof params.resourceActive !== "undefined") {
          prev.set("resourceActive", params.resourceActive);
        }
        if (typeof params.page !== "undefined") {
          prev.set("page", params.page + "");
        }
        if (typeof params.size !== "undefined") {
          prev.set("size", params.size + "");
        }
        return prev;
      },
      { replace: true }
    );
  };

  const through = (val: string) => {
    if (!user.permissions) {
      return;
    }
    return typeof user.permissions[val] !== "undefined";
  };

  const onChange = (key: string) => {
    resetLocalSearchParams({
      page: 1,
      size: 10,
      resourceActive: key,
    });
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="参与学员" />
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
      </div>
    </div>
  );
};

export default PracticeUsersPage;
