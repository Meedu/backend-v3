import { useState, useEffect } from "react";
import { Table, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { tuangou } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton, BackBartment } from "../../components";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface DataType {
  id: React.Key;
  user_id: number;
  created_at: string;
}

const TuangouRefundPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    document.title = "团购退款订单";
    dispatch(titleAction("团购退款订单"));
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
      .refundList({
        page: page,
        size: size,
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
      width: 80,
      render: (_, record: any) => <span>{record.id}</span>,
    },
    {
      title: "支付单号",
      render: (_, record: any) => <span>{record.oid}</span>,
    },
    {
      title: "支付方式",
      width: 120,
      render: (_, record: any) => (
        <span>{record.system_order.payment_text}</span>
      ),
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
      width: 120,
      render: (_, record: any) => <span>￥{record.charge}</span>,
    },
    {
      title: "状态",
      width: 100,
      render: (_, record: any) => <span>{record.status_text}</span>,
    },
    {
      title: "操作",
      width: 100,
      render: (_, record: any) => (
        <>
          {record.status == 0 && (
            <PerButton
              type="link"
              text="改为已处理"
              class="c-red"
              icon={null}
              p="addons.TuanGou.refund.handle"
              onClick={() => {
                handle(record.id);
              }}
              disabled={null}
            />
          )}
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
          .refundComplete(id, {
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

  return (
    <div className="meedu-main-body">
      <BackBartment title="团购商品退款订单" />
      <div className="float-left mb-30 mt-30">
        <div className="float-left d-flex">
          <div className="d-flex">
            请拿着支付订单号到相应的支付平台操作退款。
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
    </div>
  );
};

export default TuangouRefundPage;
