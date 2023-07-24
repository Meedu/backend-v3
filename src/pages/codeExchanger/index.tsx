import { useState, useEffect } from "react";
import { Table, Modal, message, Input, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { codeExchanger } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton } from "../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  name: string;
}

const CodeExchangerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    document.title = "兑换活动";
    dispatch(titleAction("兑换活动"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    codeExchanger
      .list({
        page: page,
        size: size,
        name: name,
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

  const resetList = () => {
    setPage(1);
    setSize(10);
    setList([]);
    setName("");
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
      title: "活动名",
      width: 240,
      dataIndex: "name",
      render: (name: string) => <span>{name}</span>,
    },
    {
      title: "兑换商品",
      render: (_, record: any) => (
        <>
          {JSON.parse(record.relate_data).map((item: any) => (
            <div key={item.id}>
              {item.sign === "vod" && <span>录播-{item.name}</span>}
              {item.sign === "live" && <span>直播-{item.name}</span>}
              {item.sign === "book" && <span>电子书-{item.name}</span>}
              {item.sign === "paper" && <span>考试-{item.name}</span>}
              {item.sign === "mock_paper" && <span>模拟-{item.name}</span>}
              {item.sign === "practice" && <span>练习-{item.name}</span>}
              {item.sign === "vip" && <span>VIP-{item.name}</span>}
            </div>
          ))}
        </>
      ),
    },
    {
      title: "使用率",
      width: 200,
      render: (_, record: any) => (
        <>
          {record.code_count > 0 && (
            <span>
              {((record.used_count * 100) / record.code_count).toFixed(2)}%
            </span>
          )}
        </>
      ),
    },
    {
      title: "操作",
      width: 150,
      render: (_, record: any) => (
        <Space>
          <PerButton
            type="link"
            text="兑换码"
            class="c-primary"
            icon={null}
            p="addons.CodeExchanger.activity-code.list"
            onClick={() => {
              navigate("/codeExchanger/codes?id=" + record.id);
            }}
            disabled={null}
          />
          <PerButton
            type="link"
            text="编辑"
            class="c-primary"
            icon={null}
            p="addons.CodeExchanger.activity.update"
            onClick={() => {
              navigate("/codeExchanger/update?id=" + record.id);
            }}
            disabled={null}
          />
          <PerButton
            type="link"
            text="删除"
            class="c-red"
            icon={null}
            p="addons.CodeExchanger.activity.destroy"
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
      content: "确认删除此活动？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        codeExchanger
          .destory(id)
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

  return (
    <div className="meedu-main-body">
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="新建兑换活动"
            class=""
            icon={null}
            p="addons.CodeExchanger.activity.store"
            onClick={() => navigate("/codeExchanger/create")}
            disabled={null}
          />
        </div>
        <div className="d-flex">
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="活动名称关键字"
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
export default CodeExchangerPage;
