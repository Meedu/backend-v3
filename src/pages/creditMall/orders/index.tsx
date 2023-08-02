import { useState, useEffect } from "react";
import { Table, Modal, message, Input, Button, Space, Select } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { creditMall } from "../../../api/index";
import { titleAction } from "../../../store/user/loginUserSlice";
import { PerButton, BackBartment } from "../../../components";
import { dateFormat } from "../../../utils/index";

interface DataType {
  id: React.Key;
  created_at: string;
}

const CreditMallOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [keywords, setKeywords] = useState<string>("");
  const [goodsTypes, setGoodsTypes] = useState<any>([]);
  const [goods_type, setGoodsType] = useState([]);

  useEffect(() => {
    document.title = "积分订单";
    dispatch(titleAction("积分订单"));
  }, []);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    creditMall
      .ordersList({
        page: page,
        size: size,
        key: keywords,
        goods_type: goods_type,
      })
      .then((res: any) => {
        setList(res.data.data.data);
        setTotal(res.data.data.total);
        let goodsTypes = res.data.types;
        const arr = [];
        for (let i = 0; i < goodsTypes.length; i++) {
          arr.push({
            label: goodsTypes[i].name,
            value: goodsTypes[i].value,
          });
        }
        setGoodsTypes(arr);
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
    setGoodsType([]);
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
      title: "ID",
      width: 60,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "类型",
      width: 60,
      render: (_, record: any) => (
        <>
          {record.goods_is_v === 1 && <div>虚拟</div>}
          {record.goods_is_v === 0 && <div>实物</div>}
        </>
      ),
    },
    {
      title: "商品名称",
      render: (_, record: any) => <div>{record.goods_title}</div>,
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
      width: 200,
      render: (_, record: any) => <div>{record.total_charge}积分</div>,
    },
    {
      title: "状态",
      width: 120,
      render: (_, record: any) => (
        <>
          {record.is_send === 1 && <span>已发货成功</span>}
          {record.is_send === 0 && <span>发货中</span>}
        </>
      ),
    },
    {
      title: "运单号",
      width: 200,
      render: (_, record: any) => <div>{record.express_number}</div>,
    },
    {
      title: "时间",
      width: 200,
      render: (_, record: any) => <div>{dateFormat(record.created_at)}</div>,
    },
    {
      title: "备注",
      width: 150,
      render: (_, record: any) => <span>{record.remark}</span>,
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
            p="addons.credit1Mall.orders.update"
            onClick={() => {
              navigate("/creditMall/orders/update?id=" + record.id);
            }}
            disabled={null}
          />
          {record.is_send !== 1 && (
            <PerButton
              type="link"
              text="发货"
              class="c-primary"
              icon={null}
              p="addons.credit1Mall.orders.send"
              onClick={() => {
                navigate(
                  "/creditMall/orders/send?id=" +
                    record.id +
                    "&goods_is_v=" +
                    record.goods_is_v
                );
              }}
              disabled={null}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="meedu-main-body">
      <BackBartment title="积分订单" />
      <div className="float-left j-b-flex mt-30 mb-30">
        <div></div>
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
          <Select
            style={{ width: 150, marginLeft: 10 }}
            value={goods_type}
            onChange={(e) => {
              setGoodsType(e);
            }}
            allowClear
            placeholder="商品分类"
            options={goodsTypes}
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

export default CreditMallOrdersPage;
