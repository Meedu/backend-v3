import { useState, useEffect } from "react";
import { Table, Modal, message, Input, Button, Space, Select } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { creditMall } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton, OptionBar } from "../../components";
import { dateFormat } from "../../utils/index";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  created_at: string;
}

const CreditMallPage = () => {
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
    document.title = "秒杀课程";
    dispatch(titleAction("秒杀课程"));
  }, []);

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
      width: 120,
      render: (_, record: any) => <span>{record.id}</span>,
    },
  ];

  return (
    <div className="meedu-main-body">
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <PerButton
            type="primary"
            text="添加"
            class=""
            icon={null}
            p="addons.credit1Mall.goods.store"
            onClick={() => navigate("/creditMall/create")}
            disabled={null}
          />
          <PerButton
            type="primary"
            text="订单"
            class="ml-10"
            icon={null}
            p="addons.credit1Mall.orders.list"
            onClick={() => navigate("/creditMall/orders/index")}
            disabled={null}
          />
          <OptionBar
            text="积分配置"
            value="/system/creditSignConfig"
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
            placeholder="关键字"
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

export default CreditMallPage;
