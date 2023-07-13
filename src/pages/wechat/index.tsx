import { useState, useEffect } from "react";
import { Table, Modal, message, Space } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { wechat } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton, OptionBar } from "../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  reply_content: string;
}

const WechatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    document.title = "公众号";
    dispatch(titleAction("公众号"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    wechat
      .list()
      .then((res: any) => {
        setList(res.data.data.data);
        setTotal(res.data.data.total);
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
      title: "匹配规则",
      width: 500,
      dataIndex: "name",
      render: (_, record: any) => (
        <>
          {record.type === "event" && (
            <span>
              {record.type}@{record.event_type}:{record.event_key}
            </span>
          )}
          {record.type !== "event" && (
            <span>
              {record.type}@{record.rule}
            </span>
          )}
        </>
      ),
    },
    {
      title: "回复内容",
      dataIndex: "reply_content",
      render: (reply_content: string) => <span>{reply_content}</span>,
    },
    {
      title: "操作",
      width: 130,
      render: (_, record: any) => (
        <Space>
          <PerButton
            type="link"
            text="编辑"
            class="c-primary"
            icon={null}
            p="mpWechatMessageReply.update"
            onClick={() => {
              navigate("/wechat/messagereply/update?id=" + record.id);
            }}
            disabled={null}
          />
          <PerButton
            type="link"
            text="删除"
            class="c-red"
            icon={null}
            p="mpWechatMessageReply.destroy"
            onClick={() => {
              destory(record.id);
            }}
            disabled={null}
          />
        </Space>
      ),
    },
  ];

  const resetData = () => {
    setPage(1);
    setList([]);
    setRefresh(!refresh);
  };

  const destory = (id: number) => {
    if (id === 0) {
      return;
    }
    confirm({
      title: "操作确认",
      icon: <ExclamationCircleFilled />,
      content: "确认删除此VIP？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        wechat
          .destroy(id)
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

  return (
    <div className="meedu-main-body">
      <div className="float-left mb-30">
        <PerButton
          type="primary"
          text="新建自动回复"
          class=""
          icon={null}
          p="mpWechatMessageReply.store"
          onClick={() => navigate("/wechat/messagereply/create")}
          disabled={null}
        />
        <PerButton
          type="primary"
          text="公众号菜单"
          class="ml-10"
          icon={null}
          p="mpWechat.menu"
          onClick={() => navigate("/wechat/mp-wechat-menu")}
          disabled={null}
        />
        <OptionBar
          text="公众号配置"
          value="/system/mp_wechatConfig"
        ></OptionBar>
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
    </div>
  );
};

export default WechatPage;
