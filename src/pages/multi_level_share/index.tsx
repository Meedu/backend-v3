import { useState, useEffect } from "react";
import { Table, Modal, message, Input, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { multiShare } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton, OptionBar } from "../../components";
import { dateFormat } from "../../utils/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  goods_title: string;
  goods_id: number;
  goods_type_text: string;
  goods_charge: number;
  created_at: string;
}

const MultiSharePage = () => {
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
    document.title = "分销活动";
    dispatch(titleAction("分销活动"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    multiShare
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
      dataIndex: "goods_title",
      render: (goods_title: string) => <span>{goods_title}</span>,
    },
    {
      title: "价格",
      width: 200,
      dataIndex: "goods_charge",
      render: (goods_charge: number) => <span>{goods_charge}元</span>,
    },
    {
      title: "奖励",
      width: 200,
      render: (_, record: any) => (
        <>
          <div>一级：{record.reward}元</div>
          <div>二级：{record.reward2}元</div>
        </>
      ),
    },
    {
      title: "时间",
      width: 200,
      dataIndex: "created_at",
      render: (created_at: string) => <span>{dateFormat(created_at)}</span>,
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
            p="addons.MultiLevelShare.goods.update"
            onClick={() => {
              navigate("/multi_level_share/goods/update?id=" + record.id);
            }}
            disabled={null}
          />
          <PerButton
            type="link"
            text="删除"
            class="c-red"
            icon={null}
            p="addons.MultiLevelShare.goods.delete"
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
        multiShare
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
            text="新建分销"
            class=""
            icon={null}
            p="addons.MultiLevelShare.goods.store"
            onClick={() => navigate("/multi_level_share/goods/create")}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="奖励记录"
            class="ml-10"
            icon={null}
            p="addons.MultiLevelShare.reward.list"
            onClick={() => navigate("/multi_level_share/goods/rewards")}
            disabled={null}
          />
          <OptionBar
            text="分销配置"
            value="/system/config?key=三级分销"
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

export default MultiSharePage;
