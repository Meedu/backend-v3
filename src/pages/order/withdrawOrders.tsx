import { useState, useEffect } from "react";
import { Table, message, Input, Button, Tabs } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useDispatch } from "react-redux";
import { order } from "../../api/index";
import { titleAction } from "../../store/user/loginUserSlice";
import { PerButton } from "../../components";
import { dateFormat } from "../../utils/index";
import { WithdrawDialog } from "./components/withdraw-dailog";
import moment from "moment";
import * as XLSX from "xlsx";
import aliIcon from "../../assets/img/ali-pay.png";
import wepayIcon from "../../assets/img/wepay.png";

interface DataType {
  id: React.Key;
  user_id: number;
  created_at: string;
}

const WithdrawOrdersPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [user_id, setUserId] = useState("");
  const [status, setStatus] = useState("0");
  const [showHandleWin, setShowHandleWin] = useState<boolean>(false);
  const [tabs] = useState<any>([
    {
      label: "待处理",
      key: "0",
    },
    {
      label: "已处理",
      key: "5",
    },
    {
      label: "已驳回",
      key: "3",
    },
  ]);
  const statusOnChange = (status: string) => {
    setPage(1);
    setStatus(status);
    setRefresh(!refresh);
  };

  // 设置网页标题
  useEffect(() => {
    document.title = "余额提现";
    dispatch(titleAction("余额提现"));
  }, []);

  // 初次进入加载
  useEffect(() => {
    getData();
  }, [page, size, refresh]);

  // 获取列表数据
  const getData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    order
      .withdrawOrders({
        page: page,
        size: size,
        user_id: user_id,
        status: status,
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

  // 重置
  const resetList = () => {
    setPage(1);
    setSize(10);
    setList([]);
    setSelectedRowKeys([]);
    setUserId("");
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
      title: "记录ID",
      width: 120,
      dataIndex: "id",
      render: (id: number) => <span>{id}</span>,
    },
    {
      title: "学员",
      width: 200,
      render: (_, record: any) => (
        <>
          {record.user && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>{record.user.nick_name}</div>
              <div style={{ color: "rgba(0,0,0,.3)", fontSize: "10px" }}>
                ID#{record.user_id}
              </div>
            </div>
          )}
          {!record.user && <span className="c-red">-</span>}
        </>
      ),
    },
    {
      title: "渠道",
      width: 100,
      render: (_, record: any) => (
        <>
          <div>
            {record.channel === "alipay" ? (
              <img src={aliIcon} width="30" height="30" />
            ) : null}

            {record.channel === "wechat" ? (
              <img src={wepayIcon} width="30" height="30" />
            ) : null}
          </div>
        </>
      ),
    },
    {
      title: "提现金额",
      width: 200,
      render: (_, record: any) => (
        <>
          <span>￥{record.amount}</span>
          <br></br>
          <span style={{ color: "rgba(0,0,0,.3)", fontSize: "10px" }}>
            提现前余额: ￥{record.before_balance}
          </span>
        </>
      ),
    },
    {
      title: "状态",
      width: 150,
      render: (_, record: any) => (
        <>
          {record.status === 5 && <span className="c-green">· 已处理</span>}
          {record.status === 3 && <span className="c-red">· 已驳回</span>}
          {record.status === 0 && <span className="c-yellow">· 待处理</span>}
        </>
      ),
    },
    {
      title: "备注",
      render: (_, record: any) => <span>{record.remark}</span>,
    },
    {
      title: "申请时间",
      width: 200,
      dataIndex: "created_at",
      render: (created_at: string) => <span>{dateFormat(created_at)}</span>,
    },
    {
      title: "操作",
      width: 150,
      render: (_, record: any) => (
        <>
          {record.status === 0 ? (
            <PerButton
              type="link"
              text="处理"
              class="c-primary"
              icon={null}
              p="addons.MultiLevelShare.withdraw.handle"
              onClick={() => {
                setSelectedRowKeys([record.id]);
                setShowHandleWin(true);
              }}
              disabled={null}
            />
          ) : null}
        </>
      ),
    },
  ];

  const importexcel = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    let params = {
      page: 1,
      size: total,
      user_id: user_id,
      status: status,
    };
    order.withdrawOrders(params).then((res: any) => {
      if (res.data.total === 0) {
        message.error("数据为空");
        setLoading(false);
        return;
      }
      let filename = "余额提现.xlsx";
      let sheetName = "sheet1";

      let data = [
        [
          "学员ID",
          "学员",
          "金额",
          "收款人渠道",
          "收款人姓名",
          "收款人账号",
          "状态",
          "备注",
          "时间",
        ],
      ];
      res.data.data.forEach((item: any) => {
        let status;
        if (item.status === 0) {
          status = "待处理";
        } else if (item.status === 3) {
          status = "已驳回";
        } else if (item.status === 5) {
          status = "已处理";
        }
        data.push([
          item.user_id,
          item.user.nick_name,
          item.amount + "元",
          item.channel,
          item.channel_name,
          item.channel_account,
          status,
          item.remark,
          item.created_at
            ? moment(item.created_at).format("YYYY-MM-DD HH:mm")
            : "",
        ]);
      });

      const jsonWorkSheet = XLSX.utils.json_to_sheet(data);
      const workBook: XLSX.WorkBook = {
        SheetNames: [sheetName],
        Sheets: {
          [sheetName]: jsonWorkSheet,
        },
      };
      XLSX.writeFile(workBook, filename);
      setLoading(false);
    });
  };

  return (
    <div className="meedu-main-body">
      <WithdrawDialog
        open={showHandleWin}
        ids={selectedRowKeys}
        onCancel={() => setShowHandleWin(false)}
        onSuccess={() => {
          setShowHandleWin(false);
          setSelectedRowKeys([]);
          setRefresh(!refresh);
        }}
      ></WithdrawDialog>
      <div className="float-left j-b-flex mb-30">
        <div className="d-flex">
          <Button type="primary" onClick={() => importexcel()}>
            导出表格
          </Button>
        </div>
        <div className="d-flex">
          <Input
            value={user_id}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder="学员ID"
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
        <Tabs
          defaultActiveKey={status}
          items={tabs}
          onChange={statusOnChange}
        />
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

export default WithdrawOrdersPage;
