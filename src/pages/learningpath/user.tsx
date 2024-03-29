import { useState, useEffect } from "react";
import { Table, Modal, message, Space, Button } from "antd";
import { useLocation, useSearchParams } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { path } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { BackBartment, PerButton, UserSingleAddDialog } from "../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { dateFormat } from "../../utils/index";
const { confirm } = Modal;
import moment from "moment";
import * as XLSX from "xlsx";

interface DataType {
  id: React.Key;
  name: string;
  updated_at: string;
  charge: number;
}

interface LocalSearchParamsInterface {
  page?: number;
  size?: number;
}

const LearnPathUserPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    size: "10",
  });
  const page = parseInt(searchParams.get("page") || "1");
  const size = parseInt(searchParams.get("size") || "10");

  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [id, setId] = useState(Number(result.get("id")));
  const [user_id, setUserId] = useState(0);
  const [showUserAddWin, setShowUserAddWin] = useState(false);

  useEffect(() => {
    document.title = "付费学员";
    dispatch(titleAction("付费学员"));
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
    path
      .users(id, {
        page: page,
        size: size,
      })
      .then((res: any) => {
        setList(res.data.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      width: 120,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "学员ID",
      width: 120,
      render: (_, record: any) => <span>{record.user_id}</span>,
    },
    {
      title: "学员",
      width: 300,
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
      width: 150,
      dataIndex: "charge",
      render: (charge: number) => <span>{charge}元</span>,
    },
    {
      title: "时间",
      dataIndex: "updated_at",
      render: (updated_at: string) => <span>{dateFormat(updated_at)}</span>,
    },
    {
      title: "操作",
      width: 80,
      render: (_, record: any) => (
        <Space>
          <PerButton
            type="link"
            text="删除"
            class="c-red"
            icon={null}
            p="addons.learnPaths.path.user.destroy"
            onClick={() => {
              destory(record.user_id);
            }}
            disabled={null}
          />
        </Space>
      ),
    },
  ];

  const resetLocalSearchParams = (params: LocalSearchParamsInterface) => {
    setSearchParams(
      (prev) => {
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

  const resetData = () => {
    resetLocalSearchParams({
      page: 1,
    });
    setList([]);
    setRefresh(!refresh);
  };

  const exportexcel = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    let params = {
      page: 1,
      size: total,
    };
    path
      .users(id, params)
      .then((res: any) => {
        if (res.data.total === 0) {
          message.error("数据为空");
          setLoading(false);
          return;
        }
        let filename = "学习路径订阅学员.xlsx";
        let sheetName = "sheet1";

        let data = [["学员ID", "学员", "手机号", "价格", "时间"]];
        res.data.data.forEach((item: any) => {
          data.push([
            item.user_id,
            item.user.nick_name,
            item.user.mobile,
            item.charge === 0 ? "-" : "￥" + item.charge,
            item.updated_at
              ? moment(item.updated_at).format("YYYY-MM-DD HH:mm")
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
      })
      .catch((e) => {
        setLoading(false);
      });
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

  const destory = (uid: number) => {
    if (uid === 0) {
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除此学员？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        path
          .destroyUser(id, uid)
          .then(() => {
            setLoading(false);
            message.success("删除成功");
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

  const userAddChange = (rows: any) => {
    if (loading) {
      return;
    }
    setLoading(true);
    path
      .userAdd(id, {
        user_id: Number(rows.join(",")),
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

  return (
    <div className="meedu-main-body">
      <BackBartment title="付费学员" />
      <div className="float-left mt-30 mb-30">
        <PerButton
          type="primary"
          text="添加学员"
          class="mr-10"
          icon={null}
          p="addons.learnPaths.path.user.store"
          onClick={() => setShowUserAddWin(true)}
          disabled={null}
        />
        <Button type="primary" onClick={() => exportexcel()}>
          导出表格
        </Button>
      </div>
      <div className="float-left">
        <Table
          loading={loading}
          columns={columns}
          dataSource={list}
          rowKey={(record) => record.id}
          pagination={paginationProps}
        />
      </div>
      <UserSingleAddDialog
        type=""
        open={showUserAddWin}
        onCancel={() => setShowUserAddWin(false)}
        onSuccess={(rows: any) => {
          userAddChange(rows);
        }}
      ></UserSingleAddDialog>
    </div>
  );
};

export default LearnPathUserPage;
