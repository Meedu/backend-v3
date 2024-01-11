import { useState, useEffect } from "react";
import { Table, Modal, message, Button, Input, Tabs } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useLocation, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { live } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import {
  PerButton,
  BackBartment,
  UserAddDialog,
  UserImportDialog,
} from "../../components";
import { dateFormat } from "../../utils/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
import LiveWatchUsersPage from "./components/watch-users";
const { confirm } = Modal;
import moment from "moment";
import * as XLSX from "xlsx";

interface DataType {
  id: React.Key;
  created_at: string;
}

interface LocalSearchParamsInterface {
  page?: number;
  size?: number;
  user_id?: string;
  resourceActive?: string;
}

const LiveUsersPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    size: "10",
    user_id: "",
    resourceActive: "watch-user",
  });
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");
  const [user_id, setUserId] = useState(searchParams.get("user_id") || "");
  const resourceActive = searchParams.get("resourceActive") || "watch-user";

  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [showUserAddWin, setShowUserAddWin] = useState<boolean>(false);
  const [importDialog, setImportDialog] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [id, setId] = useState(Number(result.get("id")));
  const avaliableResources = [
    {
      label: "观看学员",
      key: "watch-user",
    },
    {
      label: "付费学员",
      key: "sub-user",
    },
  ];

  useEffect(() => {
    document.title = "直播课程学员";
    dispatch(titleAction("直播课程学员"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
  }, [result.get("id")]);

  useEffect(() => {
    getData();
  }, [id, page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    live
      .userList(id, {
        page: page,
        size: size,
        user_id: user_id,
      })
      .then((res: any) => {
        setList(res.data.data.data);
        setTotal(res.data.data.total);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const resetLocalSearchParams = (params: LocalSearchParamsInterface) => {
    setSearchParams(
      (prev) => {
        if (typeof params.user_id !== "undefined") {
          prev.set("user_id", params.user_id);
        }
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

  const resetList = () => {
    resetLocalSearchParams({
      page: 1,
      size: 10,
      user_id: "",
    });
    setList([]);
    setUserId("");
    setSelectedRowKeys([]);
    setRefresh(!refresh);
  };

  const resetData = () => {
    resetLocalSearchParams({
      page: 1,
    });
    setList([]);
    setSelectedRowKeys([]);
    setRefresh(!refresh);
  };

  const paginationProps = {
    current: page, //当前页码
    pageSize: size,
    total: total, // 总条数
    onChange: (page: number, pageSize: number) =>
      handlePageChange(page, pageSize), //改变页码的函数
    showSizeChanger: true,
  };

  const handlePageChange = (page: number, pageSize: number) => {
    resetLocalSearchParams({
      page: page,
      size: pageSize,
    });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "学员ID",
      width: 120,
      render: (_, record: any) => <span>{record.user_id}</span>,
    },
    {
      title: "学员",
      render: (_, record: any) => (
        <>
          {record.user && (
            <div className="user-item d-flex">
              <div className="avatar">
                <img src={record.user.avatar} width="40" height="40" />
              </div>
              <div className="ml-10">{record.user.nick_name}</div>
            </div>
          )}
          {!record.user && <span className="c-red">学员不存在</span>}
        </>
      ),
    },
    {
      title: "价格",
      width: 200,
      render: (_, record: any) => (
        <>
          {record.charge === 0 && <span>-</span>}
          {record.charge !== 0 && <span>￥{record.charge}</span>}
        </>
      ),
    },
    {
      title: "时间",
      width: 200,
      dataIndex: "created_at",
      render: (created_at: string) => <span>{dateFormat(created_at)}</span>,
    },
  ];

  const delMulti = () => {
    if (selectedRowKeys.length === 0) {
      message.error("请选择需要操作的数据");
      return;
    }

    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除选中的学员？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        live
          .userDel(id, { ids: selectedRowKeys })
          .then(() => {
            setLoading(false);
            message.success("成功");
            resetData();
          })
          .catch((e) => {
            setLoading(false);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const exportexcel = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    let params = {
      page: 1,
      size: total,
      user_id: user_id,
    };

    live.userList(id, params).then((res: any) => {
      if (res.data.data.total === 0) {
        message.error("数据为空");
        setLoading(false);
        return;
      }
      let filename = "直播课程订阅学员.xlsx";
      let sheetName = "sheet1";

      let data = [["学员ID", "学员", "手机号", "价格", "时间"]];
      res.data.data.data.forEach((item: any) => {
        data.push([
          item.user_id,
          item.user.nick_name,
          item.user.mobile,
          item.charge === 0 ? "-" : "￥" + item.charge,
          item.created_at
            ? moment(item.created_at).format("YYYY-MM-DD HH:mm")
            : "",
        ]);
      });

      const jsonWorkSheet = XLSX.utils.json_to_sheet(data);
      const workBook: XLSX.WorkBook = {
        SheetNames: [sheetName],
        Sheets: {
          [sheetName]: jsonWorkSheet,
        },
      };
      XLSX.writeFile(workBook, filename);
      setLoading(false);
    });
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const userAddChange = (rows: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    live
      .userAdd(id, {
        ids: rows,
      })
      .then(() => {
        setLoading(false);
        message.success("成功");
        setShowUserAddWin(false);
        resetData();
      })
      .catch((e) => {
        setLoading(false);
      });
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
      <BackBartment title="直播课程学员" />
      <div className="float-left">
        <Tabs
          defaultActiveKey={resourceActive}
          items={avaliableResources}
          onChange={onChange}
        />
      </div>
      {resourceActive === "watch-user" && (
        <LiveWatchUsersPage></LiveWatchUsersPage>
      )}
      {resourceActive === "sub-user" && (
        <>
          <div className="float-left j-b-flex mb-30">
            <div className="d-flex">
              <Button type="primary" onClick={() => setShowUserAddWin(true)}>
                添加学员
              </Button>
              <PerButton
                type="primary"
                text="批量导入"
                class="ml-10"
                icon={null}
                p="addons.Zhibo.course.user.import"
                onClick={() => setImportDialog(true)}
                disabled={null}
              />
              <Button
                type="primary"
                className="ml-10"
                danger
                onClick={() => delMulti()}
              >
                删除学员
              </Button>
            </div>
            <div className="d-flex">
              <Input
                value={user_id}
                onChange={(e) => {
                  setUserId(e.target.value);
                }}
                allowClear
                style={{ width: 150 }}
                placeholder="学员ID"
              />
              <Button className="ml-10" onClick={resetList}>
                清空
              </Button>
              <Button
                className="ml-10"
                type="primary"
                onClick={() => {
                  resetLocalSearchParams({
                    page: 1,
                    user_id: user_id,
                  });
                  setRefresh(!refresh);
                }}
              >
                筛选
              </Button>
              <Button
                className="ml-10"
                type="primary"
                onClick={() => exportexcel()}
              >
                导出表格
              </Button>
            </div>
          </div>
          <div className="float-left">
            <Table
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
              loading={loading}
              columns={columns}
              dataSource={list}
              rowKey={(record) => record.id}
              pagination={paginationProps}
            />
          </div>
        </>
      )}
      <UserImportDialog
        open={importDialog}
        id={id}
        type="live"
        name="学员批量导入模板"
        onCancel={() => setImportDialog(false)}
        onSuccess={() => {
          setImportDialog(false);
          resetData();
        }}
      ></UserImportDialog>
      <UserAddDialog
        type=""
        open={showUserAddWin}
        onCancel={() => setShowUserAddWin(false)}
        onSuccess={(rows: any) => {
          userAddChange(rows);
        }}
      ></UserAddDialog>
    </div>
  );
};

export default LiveUsersPage;
