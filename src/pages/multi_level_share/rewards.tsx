import { useState, useEffect } from "react";
import { Table, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { multiShare } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { BackBartment } from "../../components";

interface DataType {
  id: React.Key;
  order_id: number;
}

const MultiShareRewardsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [order_id, setOrderId] = useState<string>("");

  useEffect(() => {
    document.title = "奖励记录";
    dispatch(titleAction("奖励记录"));
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
      .rewards({
        page: page,
        size: size,
        order_id: order_id,
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
    setSize(50);
    setList([]);
    setOrderId("");
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
      title: "订单ID",
      width: 120,
      dataIndex: "order_id",
      render: (order_id: number) => <span>{order_id}</span>,
    },
    {
      title: "订单商品",
      width: 300,
      render: (_, record: any) => (
        <div className="d-flex">
          {record.order.goods &&
            record.order.goods.map((item: any) => (
              <div className="mr-10" key={item.id}>
                {item.goods_name}
              </div>
            ))}
          {!record.order.goods && <span>-</span>}
        </div>
      ),
    },
    {
      title: "订单用户",
      width: 300,
      render: (_, record: any) => (
        <>
          {record.order_user && (
            <div className="user-item d-flex">
              <div>{record.order_user.nick_name}</div>
            </div>
          )}
          {!record.order_user && <span className="c-red">用户不存在</span>}
        </>
      ),
    },
    {
      title: "一级用户及奖励",
      width: 260,
      render: (_, record: any) => (
        <>
          {record.user1 && (
            <div className="flex flex-column">
              <div>用户：{record.user1.nick_name}</div>
              <div>获得：{record.reward1}元</div>
            </div>
          )}
          {!record.user1 && <span>-</span>}
        </>
      ),
    },
    {
      title: "二级用户及奖励",
      width: 260,
      render: (_, record: any) => (
        <>
          {record.user2 && (
            <div className="flex flex-column">
              <div>用户：{record.user2.nick_name}</div>
              <div>获得：{record.reward2}元</div>
            </div>
          )}
          {!record.user2 && <span>-</span>}
        </>
      ),
    },
    {
      title: "三级用户及奖励",
      width: 260,
      render: (_, record: any) => (
        <>
          {record.user3 && (
            <div className="flex flex-column">
              <div>用户：{record.user3.nick_name}</div>
              <div>获得：{record.reward3}元</div>
            </div>
          )}
          {!record.user3 && <span>-</span>}
        </>
      ),
    },
  ];

  return (
    <div className="meedu-main-body">
      <BackBartment title="奖励记录" />
      <div className="float-left j-b-flex mb-30 mt-30">
        <div className="d-flex">
          <Input
            value={order_id}
            onChange={(e) => {
              setOrderId(e.target.value);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="订单ID"
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

export default MultiShareRewardsPage;
