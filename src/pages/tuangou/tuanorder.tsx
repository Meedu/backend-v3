import { useState, useEffect } from "react";
import { Table, Modal, message, Tabs, Tag, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { tuangou } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton, BackBartment } from "../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { dateFormat } from "../../utils/index";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  expired_at: string;
}

const TuangouTuanOrderPage = () => {
  const result = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [countMap, setCountMap] = useState<any>([0, 0, 0, 0]);
  const [id, setId] = useState(Number(result.get("id")));
  const [resourceActive, setResourceActive] = useState<string>("-1");
  const [orderTotal, setOrderTotal] = useState(0);
  const [types, setTypes] = useState<any>([
    {
      key: "-1",
      label: "全部",
    },
    {
      key: "0",
      label: "未支付",
    },
    {
      label: "组团成功",
      key: "1",
    },
    {
      label: "组团失败",
      key: "2",
    },
    {
      label: "组团中",
      key: "3",
    },
  ]);

  useEffect(() => {
    document.title = "团列表";
    dispatch(titleAction("团列表"));
  }, []);

  useEffect(() => {
    getData();
  }, [id, page, size, refresh, resourceActive]);

  useEffect(() => {
    setId(Number(result.get("id")));
  }, [result.get("id")]);

  useEffect(() => {
    if (countMap === null) {
      setOrderTotal(0);
    } else {
      let total = 0;
      for (let i = 1; i < types.length; i++) {
        total += countMap[types[i].key];
      }
      setOrderTotal(total);
    }
  }, [countMap, types]);

  useEffect(() => {
    let statusRows = [
      {
        label: "全部(" + orderTotal + ")",
        key: "-1",
      },
      {
        label: "未支付(" + countMap[0] + ")",
        key: "0",
      },
      {
        label: "组团成功(" + countMap[1] + ")",
        key: "1",
      },
      {
        label: "组团失败(" + countMap[2] + ")",
        key: "2",
      },
      {
        label: "组团中(" + countMap[3] + ")",
        key: "3",
      },
    ];
    setTypes(statusRows);
  }, [orderTotal, countMap]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    tuangou
      .tuanList(id, {
        page: page,
        size: size,
        status: resourceActive,
      })
      .then((res: any) => {
        setList(res.data.data.data);
        setTotal(res.data.data.total);
        setCountMap(res.data.countMap);
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
      title: "团长",
      render: (_, record: any) => <span>{record.create_user_name}</span>,
    },
    {
      title: "状态",
      width: 200,
      render: (_, record: any) => (
        <>
          {record.status === 1 && (
            <Tag color="success">{record.status_text}</Tag>
          )}
          {record.status === 0 && (
            <Tag color="default">{record.status_text}</Tag>
          )}
          {record.status === 2 && <Tag color="error">{record.status_text}</Tag>}
          {record.status === 3 && (
            <Tag color="processing">{record.status_text}</Tag>
          )}
        </>
      ),
    },
    {
      title: "模拟",
      width: 120,
      render: (_, record: any) => (
        <>{record.create_user_id === 0 && <Tag color="processing">是</Tag>}</>
      ),
    },
    {
      title: "人数",
      width: 120,
      render: (_, record: any) => (
        <span>
          {record.people_num - record.over_people_num}/{record.people_num}
        </span>
      ),
    },
    {
      title: "过期",
      width: 200,
      render: (_, record: any) => <div>{dateFormat(record.expired_at)}</div>,
    },
    {
      title: "操作",
      width: 160,
      render: (_, record: any) => (
        <>
          <Space>
            <PerButton
              type="link"
              text="详情"
              class="c-primary"
              icon={null}
              p="addons.TuanGou.goods.item.detail"
              onClick={() => {
                navigate(
                  "/tuangou/goods/detail?id=" +
                    record.goods_id +
                    "&tid=" +
                    record.id
                );
              }}
              disabled={null}
            />
            {record.status != 1 && (
              <PerButton
                type="link"
                text="改为已完成"
                class="c-red"
                icon={null}
                p="addons.TuanGou.goods.complete"
                onClick={() => {
                  handle(record.id);
                }}
                disabled={null}
              />
            )}
          </Space>
        </>
      ),
    },
  ];

  const handle = (id: number) => {
    if (id === 0) {
      return;
    }
    confirm({
      title: "警告",
      icon: <ExclamationCircleFilled />,
      content: "确认操作？",
      centered: true,
      okText: "确认",
      cancelText: "取消",
      onOk() {
        if (loading) {
          return;
        }
        setLoading(true);
        tuangou
          .tuanComplete({
            id: id,
          })
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

  const resetData = () => {
    setPage(1);
    setList([]);
    setRefresh(!refresh);
  };

  const onChange = (key: string) => {
    setResourceActive(key);
  };

  return (
    <div className="meedu-main-body">
      <BackBartment title="团列表" />
      <div className="float-left mt-30">
        <Tabs
          defaultActiveKey={resourceActive}
          items={types}
          onChange={onChange}
        />
      </div>
      <div className="float-left ">
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

export default TuangouTuanOrderPage;
