import { useState, useEffect } from "react";
import { Table, Modal, message, Button, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { topic } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton, BackBartment, UserAddDialog } from "../../components";
import { dateFormat } from "../../utils/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  updated_at: string;
}

const TopicUsersPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [user_id, setUserId] = useState("");
  const [showUserAddWin, setShowUserAddWin] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [id, setId] = useState(Number(result.get("id")));

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
    topic
      .order({
        topic_id: id,
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

  const resetList = () => {
    setPage(1);
    setSize(10);
    setList([]);
    setUserId("");
    setSelectedRowKeys([]);
    setRefresh(!refresh);
  };

  const resetData = () => {
    setPage(1);
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
    setPage(page);
    setSize(pageSize);
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
      render: (_, record: any) => <span>{record.charge}元</span>,
    },
    {
      title: "时间",
      width: 200,
      dataIndex: "updated_at",
      render: (updated_at: string) => <span>{dateFormat(updated_at)}</span>,
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
        topic
          .userDel({ topic_id: id, ids: selectedRowKeys.join(",") })
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
    topic
      .userAdd({ topic_id: id, ids: rows })
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
      <div className="float-left j-b-flex mb-30 mt-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="添加学员"
            class=""
            icon={null}
            p="addons.meedu_topics.orders.user.add"
            onClick={() => setShowUserAddWin(true)}
            disabled={null}
          />
          <PerButton
            type="danger"
            text="删除学员"
            class="ml-10"
            icon={null}
            p="addons.meedu_topics.orders.user.del"
            onClick={() => delMulti()}
            disabled={null}
          />
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
              setPage(1);
              setRefresh(!refresh);
            }}
          >
            筛选
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

export default TopicUsersPage;
