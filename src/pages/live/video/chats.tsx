import { useState, useEffect } from "react";
import { Table, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { live } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import { PerButton, BackBartment } from "../../../components";
import { dateFormat } from "../../../utils/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  published_at: string;
}

const LiveVideoChatsPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [id, setId] = useState(Number(result.get("id")));
  const [cid, setCid] = useState(Number(result.get("course_id")));

  useEffect(() => {
    document.title = "聊天记录";
    dispatch(titleAction("聊天记录"));
  }, []);

  useEffect(() => {
    setId(Number(result.get("id")));
    setCid(Number(result.get("course_id")));
  }, [result.get("id"), result.get("course_id")]);

  useEffect(() => {
    getData();
  }, [id, cid, page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    live
      .videoChats(cid, id, {
        page: page,
        size: size,
      })
      .then((res: any) => {
        setList(res.data.data);
        setTotal(res.data.total);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const resetData = () => {
    setPage(1);
    setList([]);
    setRefresh(!refresh);
  };

  const columns: ColumnsType<DataType> = [
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
      title: "角色",
      width: 120,
      render: (_, record: any) => (
        <>
          {record.msg_body ? (
            <>
              {record.msg_body.role && record.msg_body.role === "student" ? (
                <span className="c-gray">学生</span>
              ) : (
                <span className="c-green">
                  {record.msg_body.role && record.msg_body.role === "assistant"
                    ? "助教"
                    : "讲师"}
                </span>
              )}
            </>
          ) : (
            <span>-</span>
          )}
        </>
      ),
    },
    {
      title: "聊天内容",
      render: (_, record: any) => (
        <>{record.msg_body && <span>{record.msg_body.content}</span>}</>
      ),
    },
    {
      title: "时间",
      width: 200,
      dataIndex: "created_at",
      render: (created_at: string) => <span>{dateFormat(created_at)}</span>,
    },
  ];

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

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const delUser = () => {
    if (selectedRowKeys.length === 0) {
      message.error("请选择需要删除的聊天记录");
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除选中的聊天记录？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        live
          .videoChatDestoryMulti({ ids: selectedRowKeys })
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

  return (
    <div className="meedu-main-body">
      <BackBartment title="聊天记录" />
      <div className="float-left mb-30 mt-30">
        <PerButton
          type="danger"
          text="删除"
          class=""
          icon={null}
          p="addons.Zhibo.chat.delete"
          onClick={() => delUser()}
          disabled={null}
        />
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
    </div>
  );
};

export default LiveVideoChatsPage;
