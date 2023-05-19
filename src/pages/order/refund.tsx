import { useState, useEffect } from "react";
import {
  Table,
  Select,
  message,
  Drawer,
  Input,
  Button,
  DatePicker,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { order } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton, BackBartment } from "../../components";
import { dateFormat } from "../../utils/index";
import filterIcon from "../../assets/img/icon-filter.png";
import filterHIcon from "../../assets/img/icon-filter-h.png";
import moment from "moment";
import * as XLSX from "xlsx";

const { RangePicker } = DatePicker;

interface DataType {
  id: React.Key;
  charge: number;
  updated_at: string;
}

const OrderRefundPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState(0);
  const [payment, setPayment] = useState([]);
  const [created_at, setCreatedAt] = useState<any>([]);
  const [createdAts, setCreatedAts] = useState<any>([]);
  const [mobile, setMobile] = useState<string>("");
  const [refund_no, setRefundNo] = useState("");
  const [order_no, setOrderNo] = useState("");
  const [is_local, setIsLocal] = useState(-1);
  const payments = [
    {
      value: "alipay",
      label: "支付宝支付",
    },
    {
      value: "wechat",
      label: "微信支付",
    },
    {
      value: "handPay",
      label: "线下打款",
    },
  ];
  const types = [
    {
      value: -1,
      label: "退款类型",
    },
    {
      value: 0,
      label: "原渠道退回",
    },
    {
      value: 1,
      label: "线下退款（线上记录）",
    },
  ];
  const statusRows = [
    {
      value: 0,
      label: "退款状态",
    },
    {
      value: 1,
      label: "待处理",
    },
    {
      value: 5,
      label: "退款成功",
    },
    {
      value: 9,
      label: "退款异常",
    },
    {
      value: 13,
      label: "退款已关闭",
    },
  ];

  useEffect(() => {
    document.title = "退款订单";
    dispatch(titleAction("退款订单"));
  }, []);

  useEffect(() => {
    if (
      (created_at && created_at.length > 0) ||
      is_local !== -1 ||
      status !== 0 ||
      order_no ||
      (payment && payment.length > 0) ||
      refund_no ||
      mobile
    ) {
      setShowStatus(true);
    } else {
      setShowStatus(false);
    }
  }, [created_at, is_local, order_no, refund_no, status, payment, mobile]);

  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    order
      .refundList({
        page: page,
        size: size,
        sort: "id",
        order: "desc",
        is_local: is_local,
        mobile: mobile,
        status: status,
        created_at: created_at,
        payment: payment,
        refund_no: refund_no,
        order_no: order_no,
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
    setStatus(0);
    setPayment([]);
    setCreatedAts([]);
    setCreatedAt([]);
    setMobile("");
    setRefundNo("");
    setOrderNo("");
    setIsLocal(-1);
    setRefresh(!refresh);
  };

  const importexcel = () => {};

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
  ];

  return (
    <div className="meedu-main-body">
      <BackBartment title="退款订单" />
      <div className="float-left j-b-flex mb-30 mt-30">
        <div className="d-flex">
          <Button type="primary" onClick={() => importexcel()}>
            导出表格
          </Button>
        </div>
        <div className="d-flex">
          <Select
            style={{ width: 150 }}
            value={payment}
            onChange={(e) => {
              setPayment(e);
            }}
            allowClear
            placeholder="支付渠道"
            options={payments}
          />
          <Input
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
            }}
            allowClear
            style={{ width: 150, marginLeft: 10 }}
            placeholder="手机号"
          />
          <Input
            value={refund_no}
            onChange={(e) => {
              setRefundNo(e.target.value);
            }}
            allowClear
            style={{ width: 150, marginLeft: 10 }}
            placeholder="退款单号"
          />
          <Select
            style={{ width: 150, marginLeft: 10 }}
            value={is_local}
            onChange={(e) => {
              setIsLocal(e);
            }}
            allowClear
            placeholder="退款类型"
            options={types}
          />
          <Select
            style={{ width: 150, marginLeft: 10 }}
            value={status}
            onChange={(e) => {
              setStatus(e);
            }}
            allowClear
            placeholder="退款状态"
            options={statusRows}
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
              setDrawer(false);
            }}
          >
            筛选
          </Button>
          <div
            className="drawerMore d-flex ml-10"
            onClick={() => setDrawer(true)}
          >
            {showStatus && (
              <>
                <img src={filterHIcon} />
                <span className="act">已选</span>
              </>
            )}
            {!showStatus && (
              <>
                <img src={filterIcon} />
                <span>更多</span>
              </>
            )}
          </div>
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
      <Drawer
        title="更多筛选"
        onClose={() => setDrawer(false)}
        maskClosable={false}
        open={drawer}
        footer={
          <Space className="j-b-flex">
            <Button
              onClick={() => {
                resetList();
                setDrawer(false);
              }}
            >
              清空
            </Button>
            <Button
              onClick={() => {
                setPage(1);
                setRefresh(!refresh);
                setDrawer(false);
              }}
              type="primary"
            >
              筛选
            </Button>
          </Space>
        }
        width={360}
      >
        <div className="float-left">
          <Select
            style={{ width: "100%" }}
            value={payment}
            onChange={(e) => {
              setPayment(e);
            }}
            allowClear
            placeholder="支付渠道"
            options={payments}
          />
          <Input
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
            }}
            allowClear
            style={{ marginTop: 20 }}
            placeholder="手机号"
          />
          <Input
            value={refund_no}
            onChange={(e) => {
              setRefundNo(e.target.value);
            }}
            allowClear
            style={{ marginTop: 20 }}
            placeholder="退款单号"
          />
          <Input
            value={order_no}
            onChange={(e) => {
              setOrderNo(e.target.value);
            }}
            allowClear
            style={{ marginTop: 20 }}
            placeholder="订单号"
          />
          <Select
            style={{ width: "100%", marginTop: 20 }}
            value={is_local}
            onChange={(e) => {
              setIsLocal(e);
            }}
            allowClear
            placeholder="退款类型"
            options={types}
          />
          <Select
            style={{ width: "100%", marginTop: 20 }}
            value={status}
            onChange={(e) => {
              setStatus(e);
            }}
            allowClear
            placeholder="退款状态"
            options={statusRows}
          />
          <RangePicker
            format={"YYYY-MM-DD"}
            value={createdAts}
            style={{ marginTop: 20 }}
            onChange={(date, dateString) => {
              setCreatedAt(dateString);
              setCreatedAts(date);
            }}
            placeholder={["开始日期", "结束日期"]}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default OrderRefundPage;
