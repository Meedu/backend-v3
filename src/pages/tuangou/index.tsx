import { useState, useEffect } from "react";
import { Table, Modal, message, Input, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { tuangou } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton, ThumbBar, OptionBar } from "../../components";
import { dateFormat } from "../../utils/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  goods_title: string;
  goods_id: number;
  goods_type_text: string;
  created_at: string;
}

const TuangouPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [keywords, setKeywords] = useState<string>("");

  useEffect(() => {
    document.title = "团购活动";
    dispatch(titleAction("团购活动"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    tuangou
      .list({
        page: page,
        size: size,
        keywords: keywords,
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
    setKeywords("");
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
      title: "类型",
      dataIndex: "goods_type_text",
      render: (goods_type_text: string) => <span>{goods_type_text}</span>,
    },
    {
      title: "商品名称",
      width: 400,
      render: (_, record: any) => (
        <>
          {record.goods_type === "book" && (
            <ThumbBar
              value={record.goods_thumb}
              width={90}
              height={120}
              title={record.goods_title}
              border={4}
            ></ThumbBar>
          )}
          {record.goods_type !== "book" && (
            <ThumbBar
              value={record.goods_thumb}
              width={120}
              height={90}
              title={record.goods_title}
              border={4}
            ></ThumbBar>
          )}
        </>
      ),
    },
    {
      title: "价格",
      width: 150,
      render: (_, record: any) => (
        <>
          <div>团购价：{record.charge}元</div>
          <div className="ori-charge">原价：{record.original_charge}元</div>
        </>
      ),
    },
    {
      title: "成团人数",
      width: 120,
      render: (_, record: any) => <div>{record.people_num}人</div>,
    },
    {
      title: "时间",
      width: 200,
      render: (_, record: any) => (
        <>
          <div>开始:{dateFormat(record.started_at)}</div>
          <div>结束:{dateFormat(record.ended_at)}</div>
        </>
      ),
    },
    {
      title: "操作",
      width: 160,
      render: (_, record: any) => (
        <Space>
          <PerButton
            type="link"
            text="编辑"
            class="c-primary"
            icon={null}
            p="addons.TuanGou.goods.update"
            onClick={() => {
              navigate("/tuangou/goods/update?id=" + record.id);
            }}
            disabled={null}
          />
          <PerButton
            type="link"
            text="团列表"
            class="c-primary"
            icon={null}
            p="addons.TuanGou.goods.items"
            onClick={() => {
              navigate("/tuangou/goods/tuanorder?id=" + record.id);
            }}
            disabled={null}
          />
          <PerButton
            type="link"
            text="删除"
            class="c-red"
            icon={null}
            p="addons.TuanGou.goods.delete"
            onClick={() => {
              destory(record.id);
            }}
            disabled={null}
          />
        </Space>
      ),
    },
  ];

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
        tuangou
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

  const resetData = () => {
    setPage(1);
    setList([]);
    setRefresh(!refresh);
  };

  return (
    <div className="meedu-main-body">
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="新建团购"
            class=""
            icon={null}
            p="addons.TuanGou.goods.store"
            onClick={() => navigate("/tuangou/goods/create")}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="团购订单"
            class="ml-10"
            icon={null}
            p="addons.TuanGou.orders"
            onClick={() => navigate("/tuangou/goods/order")}
            disabled={null}
          />
          <OptionBar
            text="团购配置"
            value="/system/config?key=团购"
          ></OptionBar>
        </div>
        <div className="d-flex">
          <Input
            value={keywords}
            onChange={(e) => {
              setKeywords(e.target.value);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="商品名称关键字"
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

export default TuangouPage;
